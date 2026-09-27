import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
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
  SlidersHorizontal,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { KnowledgeGraphView } from '../components/visualizers/KnowledgeGraphView';
import { api } from '../services/api';
import { SCIENCE_DOMAINS, REGIONS, ResourceType } from '@oruvia/shared';

export const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'graph' | 'domains' | 'places'>('all');
  const [graphData, setGraphData] = useState<any>({ nodes: [], links: [] });
  const [recentResources, setRecentResources] = useState<any[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    Promise.all([
      api.graph.getGraph(),
      api.datasets.list({ limit: 6 }),
    ]).then(([g, d]) => {
      setGraphData(g);
      setRecentResources(d.datasets || []);
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full space-y-12">
        {/* Header & Search Bar */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase">
              Connected Repository Explorer
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#0D1211]">
              Explore Scientific Knowledge
            </h1>
            <p className="text-sm sm:text-base text-[#747A75] font-light max-w-2xl">
              Navigate relationships across telemetry datasets, field publications, observation stations, and expedition logs.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="max-w-3xl flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#747A75] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all scientific resources..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#0D1211]/20 bg-[#FAF9F5] text-sm text-[#0D1211] focus:outline-none focus:border-[#0D1211] shadow-sm font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-[#0D1211] text-[#F4F2EC] text-xs font-mono uppercase tracking-wider hover:bg-[#192220] transition-colors shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 border-b border-[#0D1211]/10 pb-3">
          {[
            { id: 'all', label: 'Overview' },
            { id: 'graph', label: 'Interactive Knowledge Graph' },
            { id: 'domains', label: 'Science Domains' },
            { id: 'places', label: 'Geographic Regions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0D1211] text-[#F4F2EC]'
                  : 'bg-[#FAF9F5] text-[#747A75] hover:text-[#0D1211]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'all' && (
          <div className="space-y-12">
            {/* Quick Domain Badges */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase text-[#747A75]">Explore by Science Domain</span>
              <div className="flex flex-wrap gap-2">
                {SCIENCE_DOMAINS.map((domain) => (
                  <Link
                    key={domain}
                    href={`/datasets?domain=${encodeURIComponent(domain)}`}
                    className="px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-[#0D1211]/15 text-xs font-mono text-[#0D1211] hover:border-[#0D1211] hover:bg-[#0D1211] hover:text-[#F4F2EC] transition-all"
                  >
                    {domain}
                  </Link>
                ))}
              </div>
            </div>

            {/* Knowledge Graph Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#747A75]">
                  Knowledge Relationship Network
                </span>
                <button
                  onClick={() => setActiveTab('graph')}
                  className="text-xs font-mono text-[#3D7BFF] hover:underline"
                >
                  Expand Full Graph →
                </button>
              </div>
              <KnowledgeGraphView data={graphData} height={450} />
            </div>

            {/* Recently Indexed Datasets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#747A75]">
                  Recently Indexed Datasets
                </span>
                <Link href="/datasets" className="text-xs font-mono text-[#0D1211] hover:text-[#3D7BFF]">
                  View All Datasets →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentResources.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/datasets/${d.slug}`}
                    className="p-5 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] hover:border-[#0D1211] transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-[#747A75]">
                        <span className="px-2 py-0.5 rounded bg-[#3D7BFF]/15 text-[#3D7BFF] font-semibold">
                          {d.scienceDomains?.[0] || 'DATASET'}
                        </span>
                        <span>Level {d.processingLevel}</span>
                      </div>
                      <h3 className="font-serif text-lg font-medium text-[#0D1211] mt-2 group-hover:text-[#3D7BFF] transition-colors line-clamp-2">
                        {d.title}
                      </h3>
                      <p className="text-xs text-[#747A75] mt-1 line-clamp-2 font-light">{d.abstract}</p>
                    </div>

                    <div className="pt-2 border-t border-[#0D1211]/10 flex items-center justify-between text-[11px] font-mono text-[#747A75]">
                      <span>DOI: {d.doi}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Knowledge Graph */}
        {activeTab === 'graph' && (
          <div className="space-y-4">
            <p className="text-xs font-mono text-[#747A75]">
              Interactive force-directed graph illustrating connections between datasets, peer-reviewed publications, expedition legs, stations, and lead investigators.
            </p>
            <KnowledgeGraphView data={graphData} height={650} />
          </div>
        )}

        {/* Tab 3: Domains */}
        {activeTab === 'domains' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCIENCE_DOMAINS.map((domain) => (
              <Link
                key={domain}
                href={`/datasets?domain=${encodeURIComponent(domain)}`}
                className="p-6 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] hover:border-[#0D1211] transition-all space-y-3 group"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#3D7BFF] font-semibold">
                  Science Domain
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#0D1211] group-hover:text-[#3D7BFF] transition-colors">
                  {domain}
                </h3>
                <p className="text-xs text-[#747A75] font-light">
                  Explore calibrated observations, peer-reviewed journals, and models under {domain}.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0D1211] group-hover:underline pt-2">
                  View Resources →
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Tab 4: Places */}
        {activeTab === 'places' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGIONS.map((region) => (
              <Link
                key={region}
                href={`/search?region=${encodeURIComponent(region)}`}
                className="p-6 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] hover:border-[#0D1211] transition-all space-y-3 group"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5A93C] font-semibold">
                  Geographic Sector
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#0D1211] group-hover:text-[#3D7BFF] transition-colors">
                  {region}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0D1211] group-hover:underline pt-2">
                  Explore Region Records →
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ExplorePage;
