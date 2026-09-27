import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Database,
  FileText,
  MapPin,
  Image as ImageIcon,
  Radio,
  BookOpen,
  ArrowRight,
  Sparkles,
  Command,
} from 'lucide-react';
import { useCommandSearchStore } from '../../stores/commandSearchStore';
import { api } from '../../services/api';

export const CommandPalette: React.FC = () => {
  const { isOpen, closeSearch, activeQuery, setQuery } = useCommandSearchStore();
  const [suggestions, setSuggestions] = useState<any>({
    datasets: [],
    publications: [],
    expeditions: [],
    media: [],
    stations: [],
    stories: [],
  });
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: CMD+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          closeSearch();
        } else {
          useCommandSearchStore.getState().openSearch();
        }
      } else if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!activeQuery.trim()) {
      setSuggestions({ datasets: [], publications: [], expeditions: [], media: [], stations: [], stories: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.search.suggestions(activeQuery);
        setSuggestions(data);
      } catch (err) {
        console.error('Failed to load search suggestions:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [activeQuery]);

  const handleSelect = (url: string) => {
    closeSearch();
    setLocation(url);
  };

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeQuery.trim()) {
      closeSearch();
      setLocation(`/search?q=${encodeURIComponent(activeQuery)}`);
    }
  };

  const hasResults =
    (suggestions.datasets?.length || 0) +
    (suggestions.publications?.length || 0) +
    (suggestions.expeditions?.length || 0) +
    (suggestions.media?.length || 0) +
    (suggestions.stations?.length || 0) +
    (suggestions.stories?.length || 0) > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-[#0D1211]/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-2xl bg-[#FAF9F5] border border-[#0D1211]/20 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
          >
            {/* Search Input Bar */}
            <form onSubmit={handleFullSearch} className="flex items-center px-4 py-3.5 border-b border-[#0D1211]/10 bg-[#FAF9F5]">
              <Search className="w-5 h-5 text-[#747A75] mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={activeQuery}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search datasets, publications, expeditions, telemetry, stations..."
                className="w-full bg-transparent text-sm sm:text-base text-[#0D1211] placeholder:text-[#747A75] focus:outline-none"
              />
              {activeQuery && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-[#747A75] hover:text-[#0D1211]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-[#747A75] bg-[#EBE8DF] rounded ml-2">
                ESC
              </kbd>
            </form>

            {/* Suggestions & Quick Links */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {!activeQuery && (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] block mb-2">
                      Suggested Exploration
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSelect('/datasets')}
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#F4F2EC] hover:bg-[#EBE8DF] text-xs font-medium text-left transition-colors"
                      >
                        <Database className="w-4 h-4 text-[#3D7BFF]" />
                        <span>All Scientific Datasets</span>
                      </button>
                      <button
                        onClick={() => handleSelect('/expeditions')}
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#F4F2EC] hover:bg-[#EBE8DF] text-xs font-medium text-left transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-[#E5A93C]" />
                        <span>Expedition Archive</span>
                      </button>
                      <button
                        onClick={() => handleSelect('/atlas')}
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#F4F2EC] hover:bg-[#EBE8DF] text-xs font-medium text-left transition-colors"
                      >
                        <Radio className="w-4 h-4 text-[#B7FF5A]" />
                        <span>Geospatial Atlas</span>
                      </button>
                      <button
                        onClick={() => handleSelect('/ask')}
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#F4F2EC] hover:bg-[#EBE8DF] text-xs font-medium text-left transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-[#3D7BFF]" />
                        <span>Ask ORUVIA AI Assistant</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] block mb-2">
                      Popular Search Topics
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Larsemann Hills', 'Kongsfjorden CTD', 'Boundary Layer', 'Glacier Mass Balance', 'Bharati Station', 'Southern Ocean pCO2'].map((topic) => (
                        <button
                          key={topic}
                          onClick={() => setQuery(topic)}
                          className="px-2.5 py-1 rounded-full bg-[#EBE8DF] hover:bg-[#0D1211] hover:text-[#F4F2EC] text-xs font-mono text-[#0D1211] transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="py-8 text-center text-xs font-mono text-[#747A75]">
                  Searching connected repository...
                </div>
              )}

              {activeQuery && !loading && !hasResults && (
                <div className="py-8 text-center">
                  <p className="text-sm font-serif text-[#0D1211]">We couldn’t find anything matching that search.</p>
                  <p className="text-xs text-[#747A75] mt-1">Try querying general domains such as “Glaciology”, “Larsemann”, or “Aerosol”.</p>
                </div>
              )}

              {/* Grouped Results */}
              {suggestions.datasets?.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] flex items-center gap-1.5 mb-1.5">
                    <Database className="w-3 h-3 text-[#3D7BFF]" /> Datasets
                  </span>
                  <div className="space-y-1">
                    {suggestions.datasets.map((d: any) => (
                      <button
                        key={d.slug}
                        onClick={() => handleSelect(`/datasets/${d.slug}`)}
                        className="w-full text-left p-2 rounded hover:bg-[#F4F2EC] transition-colors flex items-center justify-between group"
                      >
                        <span className="text-xs sm:text-sm font-medium text-[#0D1211] truncate">{d.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#747A75] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.publications?.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] flex items-center gap-1.5 mb-1.5">
                    <FileText className="w-3 h-3 text-[#3D7BFF]" /> Publications
                  </span>
                  <div className="space-y-1">
                    {suggestions.publications.map((p: any) => (
                      <button
                        key={p.slug}
                        onClick={() => handleSelect(`/publications/${p.slug}`)}
                        className="w-full text-left p-2 rounded hover:bg-[#F4F2EC] transition-colors flex items-center justify-between group"
                      >
                        <span className="text-xs sm:text-sm font-medium text-[#0D1211] truncate">{p.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#747A75] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.expeditions?.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3 h-3 text-[#E5A93C]" /> Expeditions
                  </span>
                  <div className="space-y-1">
                    {suggestions.expeditions.map((e: any) => (
                      <button
                        key={e.slug}
                        onClick={() => handleSelect(`/expeditions/${e.slug}`)}
                        className="w-full text-left p-2 rounded hover:bg-[#F4F2EC] transition-colors flex items-center justify-between group"
                      >
                        <span className="text-xs sm:text-sm font-medium text-[#0D1211] truncate">{e.name} ({e.number})</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#747A75] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.stations?.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] flex items-center gap-1.5 mb-1.5">
                    <Radio className="w-3 h-3 text-[#B7FF5A]" /> Research Stations
                  </span>
                  <div className="space-y-1">
                    {suggestions.stations.map((s: any) => (
                      <button
                        key={s.slug}
                        onClick={() => handleSelect(`/stations/${s.slug}`)}
                        className="w-full text-left p-2 rounded hover:bg-[#F4F2EC] transition-colors flex items-center justify-between group"
                      >
                        <span className="text-xs sm:text-sm font-medium text-[#0D1211] truncate">{s.name} ({s.code})</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#747A75] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom bar */}
            <div className="px-4 py-2.5 bg-[#EBE8DF]/50 border-t border-[#0D1211]/10 flex items-center justify-between text-[11px] font-mono text-[#747A75]">
              <button
                onClick={handleFullSearch}
                className="hover:text-[#0D1211] font-medium"
              >
                Press Enter for full faceted search →
              </button>
              <span>CMD+K Global Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
