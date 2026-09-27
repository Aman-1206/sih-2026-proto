import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  FileText,
  Search,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { IPublication, SCIENCE_DOMAINS } from '@oruvia/shared';

export const PublicationsPage: React.FC = () => {
  const [publications, setPublications] = useState<IPublication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadPublications = async () => {
    setLoading(true);
    try {
      const data = await api.publications.list({
        domain: selectedDomain || undefined,
        search: searchQuery || undefined,
      });
      setPublications(data.publications);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications();
  }, [selectedDomain]);

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full space-y-8">
        {/* Header */}
        <div className="space-y-2 pb-6 border-b border-[#0D1211]/10">
          <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase">
            Peer-Reviewed Science
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#0D1211]">
            Research Publications
          </h1>
          <p className="text-sm sm:text-base text-[#747A75] font-light max-w-2xl">
            Articles and monographs published in international geophysical and cryospheric journals, directly connected to the raw datasets collected in the field.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedDomain('')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors whitespace-nowrap ${
                selectedDomain === ''
                  ? 'bg-[#0D1211] text-[#F4F2EC]'
                  : 'bg-[#FAF9F5] text-[#747A75] border border-[#0D1211]/10'
              }`}
            >
              All Domains ({total})
            </button>
            {SCIENCE_DOMAINS.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors whitespace-nowrap ${
                  selectedDomain === domain
                    ? 'bg-[#0D1211] text-[#F4F2EC]'
                    : 'bg-[#FAF9F5] text-[#747A75] border border-[#0D1211]/10 hover:border-[#0D1211]'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); loadPublications(); }}
            className="relative sm:w-64 shrink-0"
          >
            <Search className="w-4 h-4 text-[#747A75] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search publications..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#0D1211]/15 bg-[#FAF9F5] text-xs font-mono text-[#0D1211] focus:outline-none"
            />
          </form>
        </div>

        {/* Publication Cards List */}
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-[#747A75]">
            Loading peer-reviewed articles...
          </div>
        ) : (
          <div className="space-y-4">
            {publications.map((pub) => (
              <Link
                key={pub.slug}
                href={`/publications/${pub.slug}`}
                className="p-6 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] hover:border-[#0D1211] transition-all flex flex-col justify-between space-y-4 group block"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-[#3D7BFF] font-semibold">{pub.journal} ({pub.year})</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#2E7D32]/20 text-[#2E7D32] font-semibold">
                      OPEN ACCESS
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#0D1211] group-hover:text-[#3D7BFF] transition-colors leading-snug">
                    {pub.title}
                  </h3>

                  <p className="text-xs font-mono text-[#747A75]">
                    Authors: {pub.authors?.map((a) => a.name).join(', ')}
                  </p>

                  <p className="text-xs text-[#747A75] font-light line-clamp-2 leading-relaxed">
                    {pub.abstract}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0D1211]/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#747A75]">
                  <span>DOI: {pub.doi}</span>
                  <span className="text-[#0D1211] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                    Read Article & Linked Datasets <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PublicationsPage;
