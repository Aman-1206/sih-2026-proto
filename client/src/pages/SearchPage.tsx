import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Search,
  Filter,
  Database,
  FileText,
  MapPin,
  Image as ImageIcon,
  Radio,
  BookOpen,
  ArrowRight,
  Sparkles,
  Bookmark,
  Check,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { ISearchResultItem, ISearchResponse, SCIENCE_DOMAINS } from '@oruvia/shared';
import { useAuthStore } from '../stores/authStore';

export const SearchPage: React.FC = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || '';
  const initialDomain = searchParams.get('domain') || '';
  const initialRegion = searchParams.get('region') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [results, setResults] = useState<ISearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const data = await api.search.query({
        q: query,
        type: selectedType || undefined,
        domain: selectedDomain || undefined,
        region: selectedRegion || undefined,
      });
      setResults(data);
    } catch (err) {
      console.error('Search query failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [selectedType, selectedDomain, selectedRegion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  const handleSaveSearch = async () => {
    if (!isAuthenticated) return;
    try {
      await api.search.saveSearch({
        query: query || 'Filtered Search',
        filters: { type: selectedType, domain: selectedDomain, region: selectedRegion },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to save search:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full space-y-8">
        {/* Search Bar */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#747A75] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search datasets, publications, expeditions, observations..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#0D1211]/20 bg-[#FAF9F5] text-sm text-[#0D1211] focus:outline-none focus:border-[#0D1211] shadow-sm font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-[#0D1211] text-[#F4F2EC] text-xs font-mono uppercase tracking-wider hover:bg-[#192220] transition-colors shrink-0"
            >
              Search
            </button>
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleSaveSearch}
                className="px-4 py-3.5 rounded-xl border border-[#0D1211]/20 text-xs font-mono flex items-center gap-1.5 hover:bg-[#EBE8DF]"
                title="Save this search"
              >
                {savedSuccess ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Bookmark className="w-4 h-4" />}
                <span className="hidden sm:inline">{savedSuccess ? 'Saved' : 'Save'}</span>
              </button>
            )}
          </form>
        </div>

        {/* Main Grid: Facets Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Facets Sidebar */}
          <aside className="lg:col-span-3 border border-[#0D1211]/15 rounded-xl bg-[#FAF9F5] p-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#0D1211]/10">
              <span className="text-xs font-mono uppercase font-semibold text-[#0D1211] flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Filters
              </span>
              {(selectedType || selectedDomain || selectedRegion) && (
                <button
                  onClick={() => { setSelectedType(''); setSelectedDomain(''); setSelectedRegion(''); }}
                  className="text-[11px] font-mono text-[#747A75] hover:text-[#0D1211]"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Resource Type Facet */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] block">
                Resource Type
              </span>
              <div className="space-y-1">
                {[
                  { id: '', label: 'All Types' },
                  { id: 'dataset', label: 'Datasets' },
                  { id: 'publication', label: 'Publications' },
                  { id: 'expedition', label: 'Expeditions' },
                  { id: 'media', label: 'Media Archive' },
                  { id: 'story', label: 'Editorial Stories' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono transition-colors ${
                      selectedType === t.id
                        ? 'bg-[#0D1211] text-[#F4F2EC] font-semibold'
                        : 'text-[#747A75] hover:text-[#0D1211] hover:bg-[#F4F2EC]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Science Domain Facet */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] block">
                Science Domain
              </span>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#0D1211]/15 bg-[#F4F2EC] text-xs font-mono text-[#0D1211]"
              >
                <option value="">All Domains</option>
                {SCIENCE_DOMAINS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </aside>

          {/* Results List */}
          <div className="lg:col-span-9 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#747A75]">
              <span>
                {isLoading ? 'Searching...' : `Found ${results?.total || 0} scientific results`}
              </span>
            </div>

            {isLoading && (
              <div className="py-16 text-center text-xs font-mono text-[#747A75]">
                Scanning indexed repository...
              </div>
            )}

            {!isLoading && results && results.items.length === 0 && (
              <div className="py-16 text-center border border-[#0D1211]/15 rounded-xl bg-[#FAF9F5] p-8 space-y-2">
                <p className="font-serif text-2xl text-[#0D1211]">We couldn’t find anything matching that search.</p>
                <p className="text-xs text-[#747A75] font-light max-w-md mx-auto">
                  Try adjusting filters or searching for general terms such as “Larsemann”, “CTD”, or “Glaciology”.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {results?.items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] hover:border-[#0D1211] transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-[#0D1211] text-[#F4F2EC]">
                      {item.type}
                    </span>
                    <span className="text-[#747A75]">{item.region || item.date}</span>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-[#0D1211] group-hover:text-[#3D7BFF] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#747A75] font-light line-clamp-2 leading-relaxed">
                    {item.abstractOrCaption}
                  </p>

                  <div className="pt-2 border-t border-[#0D1211]/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#747A75]">
                    <div>
                      {item.doi && <span>DOI: {item.doi}</span>}
                      {item.creators && item.creators.length > 0 && <span> · {item.creators[0]}</span>}
                    </div>
                    <a
                      href={`/${item.type === 'story' ? 'stories' : item.type + 's'}/${item.slug}`}
                      className="inline-flex items-center gap-1 text-[#0D1211] font-semibold hover:text-[#3D7BFF]"
                    >
                      View Resource <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
