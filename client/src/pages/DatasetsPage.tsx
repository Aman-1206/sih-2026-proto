import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  Database,
  Filter,
  Download,
  LayoutGrid,
  List as ListIcon,
  Table as TableIcon,
  Search,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { IDataset, SCIENCE_DOMAINS } from '@oruvia/shared';

export const DatasetsPage: React.FC = () => {
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadDatasets = async () => {
    setLoading(true);
    try {
      const data = await api.datasets.list({
        domain: selectedDomain || undefined,
        search: searchQuery || undefined,
      });
      setDatasets(data.datasets);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, [selectedDomain]);

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#0D1211]/10">
          <div className="space-y-2">
            <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase">
              FAIR Scientific Repository
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#0D1211]">
              Scientific Datasets
            </h1>
            <p className="text-sm sm:text-base text-[#747A75] font-light max-w-2xl">
              Calibrated in-situ telemetry, physical ice core properties, high-latitude hydrography, and atmospheric records indexed with DataCite DOIs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg border transition-colors ${
                viewMode === 'grid' ? 'bg-[#0D1211] text-[#F4F2EC] border-[#0D1211]' : 'bg-[#FAF9F5] text-[#747A75] border-[#0D1211]/15'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg border transition-colors ${
                viewMode === 'table' ? 'bg-[#0D1211] text-[#F4F2EC] border-[#0D1211]' : 'bg-[#FAF9F5] text-[#747A75] border-[#0D1211]/15'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Domain Pills */}
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
            onSubmit={(e) => { e.preventDefault(); loadDatasets(); }}
            className="relative sm:w-64 shrink-0"
          >
            <Search className="w-4 h-4 text-[#747A75] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search datasets..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#0D1211]/15 bg-[#FAF9F5] text-xs font-mono text-[#0D1211] focus:outline-none"
            />
          </form>
        </div>

        {/* Datasets View */}
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-[#747A75]">
            Loading calibrated dataset catalog...
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((dataset) => (
              <Link
                key={dataset.slug}
                href={`/datasets/${dataset.slug}`}
                className="p-6 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] hover:border-[#0D1211] transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[#747A75]">
                    <span className="px-2 py-0.5 rounded bg-[#3D7BFF]/15 text-[#3D7BFF] font-semibold">
                      {dataset.scienceDomains[0] || 'SCIENCE'}
                    </span>
                    <span>Level {dataset.processingLevel}</span>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-[#0D1211] group-hover:text-[#3D7BFF] transition-colors line-clamp-2">
                    {dataset.title}
                  </h3>

                  <p className="text-xs text-[#747A75] font-light line-clamp-3 leading-relaxed">
                    {dataset.abstract}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0D1211]/10 space-y-2 text-xs font-mono text-[#747A75]">
                  <div className="flex justify-between">
                    <span>Region:</span>
                    <span className="text-[#0D1211] truncate max-w-[160px]">{dataset.spatialCoverage?.regionName}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="truncate max-w-[180px]">DOI: {dataset.doi}</span>
                    <span className="text-[#0D1211] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="border border-[#0D1211]/15 rounded-xl bg-[#FAF9F5] overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F4F2EC] border-b border-[#0D1211]/10 text-[#747A75] uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Domain</th>
                  <th className="p-3.5">Region</th>
                  <th className="p-3.5">Level</th>
                  <th className="p-3.5">Formats</th>
                  <th className="p-3.5">DOI</th>
                  <th className="p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0D1211]/10">
                {datasets.map((dataset) => (
                  <tr key={dataset.slug} className="hover:bg-[#F4F2EC]/60 transition-colors">
                    <td className="p-3.5 font-medium text-[#0D1211] font-sans max-w-xs truncate">
                      {dataset.title}
                    </td>
                    <td className="p-3.5 text-[#3D7BFF]">{dataset.scienceDomains[0]}</td>
                    <td className="p-3.5 text-[#747A75]">{dataset.spatialCoverage?.regionName}</td>
                    <td className="p-3.5">{dataset.processingLevel}</td>
                    <td className="p-3.5 text-[#747A75]">{dataset.formats?.join(', ')}</td>
                    <td className="p-3.5 text-[#747A75]">{dataset.doi}</td>
                    <td className="p-3.5">
                      <Link
                        href={`/datasets/${dataset.slug}`}
                        className="px-2.5 py-1 bg-[#0D1211] text-[#F4F2EC] rounded hover:bg-[#192220]"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DatasetsPage;
