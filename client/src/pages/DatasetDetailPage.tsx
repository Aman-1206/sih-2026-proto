import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import {
  Database,
  Download,
  FileText,
  MapPin,
  Calendar,
  Layers,
  Copy,
  Check,
  Globe2,
  Sparkles,
  Terminal,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { DataVisualizer } from '../components/visualizers/DataVisualizer';
import { CitationModal } from '../components/common/CitationModal';
import { api } from '../services/api';
import { IDataset } from '@oruvia/shared';

export const DatasetDetailPage: React.FC = () => {
  const [, params] = useRoute('/datasets/:slug');
  const slug = params?.slug || '';

  const [dataset, setDataset] = useState<IDataset | null>(null);
  const [citations, setCitations] = useState<any | null>(null);
  const [jsonLd, setJsonLd] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [copiedDoi, setCopiedDoi] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.datasets.getBySlug(slug)
      .then((data) => {
        setDataset(data.dataset);
        setCitations(data.citations);
        setJsonLd(data.jsonLd);
      })
      .catch((err) => console.error('Failed to load dataset detail:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex items-center justify-center font-mono text-xs text-[#747A75]">
        Loading scientific dataset record...
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex flex-col justify-between">
        <Navbar />
        <main className="max-w-4xl mx-auto py-32 px-6 text-center space-y-4">
          <h1 className="font-serif text-3xl">Dataset Not Found</h1>
          <p className="text-xs font-mono text-[#747A75]">The requested dataset could not be found in the repository.</p>
          <Link href="/datasets" className="px-4 py-2 bg-[#0D1211] text-[#F4F2EC] rounded font-mono text-xs uppercase inline-block">
            Back to Datasets
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCopyDoi = () => {
    navigator.clipboard.writeText(`https://doi.org/${dataset.doi}`);
    setCopiedDoi(true);
    setTimeout(() => setCopiedDoi(false), 2000);
  };

  const handleDownloadTelemetry = () => {
    window.location.href = `/api/datasets/${dataset._id}/download`;
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      {/* Inject JSON-LD Schema.org Dataset metadata */}
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      )}

      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full space-y-12">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0D1211]/10">
          <div className="flex items-center gap-2 text-xs font-mono text-[#747A75]">
            <Link href="/datasets" className="hover:text-[#0D1211]">Datasets</Link>
            <span>/</span>
            <span className="text-[#0D1211] font-semibold">{dataset.scienceDomains?.[0]}</span>
            <span>/</span>
            <span className="truncate max-w-xs">{dataset.slug}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCitationModal(true)}
              className="px-3.5 py-1.5 rounded-lg border border-[#0D1211]/20 text-xs font-mono flex items-center gap-1.5 hover:bg-[#FAF9F5] transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> Cite Dataset
            </button>
            <button
              onClick={handleDownloadTelemetry}
              className="px-4 py-1.5 rounded-lg bg-[#0D1211] text-[#F4F2EC] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#192220] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#B7FF5A]" /> Download CSV ({dataset.fileSizeMb} MB)
            </button>
          </div>
        </div>

        {/* Hero Metadata */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#3D7BFF] text-white font-semibold">
              {dataset.scienceDomains?.join(' · ')}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#FAF9F5] border border-[#0D1211]/15 text-[#0D1211]">
              Level {dataset.processingLevel}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#2E7D32]/20 text-[#2E7D32] border border-[#2E7D32]/30 font-semibold">
              {dataset.accessRights} ACCESS
            </span>
            <span className="text-xs font-mono text-[#747A75]">
              Version {dataset.version}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0D1211] leading-tight">
            {dataset.title}
          </h1>

          <p className="text-base sm:text-lg text-[#747A75] font-light leading-relaxed max-w-4xl">
            {dataset.abstract}
          </p>

          {/* Creators and DOI badge */}
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-[#747A75] uppercase text-[10px] block">Principal Creators</span>
              <p className="font-medium text-[#0D1211] mt-0.5">
                {dataset.creators?.map((c) => c.name).join(', ')}
              </p>
            </div>
            <div>
              <span className="text-[#747A75] uppercase text-[10px] block">Digital Object Identifier</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[#3D7BFF] font-semibold">{dataset.doi}</span>
                <button
                  onClick={handleCopyDoi}
                  className="p-1 text-[#747A75] hover:text-[#0D1211]"
                  title="Copy DOI URL"
                >
                  {copiedDoi ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div>
              <span className="text-[#747A75] uppercase text-[10px] block">Temporal Coverage</span>
              <p className="text-[#0D1211] mt-0.5">
                {dataset.temporalCoverage?.startDate} to {dataset.temporalCoverage?.endDate}
              </p>
            </div>
            <div>
              <span className="text-[#747A75] uppercase text-[10px] block">Spatial Sector</span>
              <p className="text-[#0D1211] mt-0.5 truncate">
                {dataset.spatialCoverage?.regionName} ({dataset.spatialCoverage?.latitude}°, {dataset.spatialCoverage?.longitude}°)
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Telemetry Visualization */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-[#747A75]">
              Sensor Telemetry & Time Series
            </span>
            <span className="text-xs font-mono text-[#747A75]">
              Interactive Recharts Engine
            </span>
          </div>
          <DataVisualizer
            title={`${dataset.title.substring(0, 50)}...`}
            variables={dataset.variables}
            sampleData={dataset.sampleDataPreview}
            isDemoData={dataset.isDemoRecord}
          />
        </section>

        {/* Variables Measured Table */}
        <section className="space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#747A75]">
            Measured Scientific Variables
          </span>
          <div className="border border-[#0D1211]/15 rounded-xl bg-[#FAF9F5] overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F4F2EC] border-b border-[#0D1211]/10 text-[#747A75] uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Variable Name</th>
                  <th className="p-3.5">Unit</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Data Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0D1211]/10">
                {dataset.variables?.map((v) => (
                  <tr key={v.name} className="hover:bg-[#F4F2EC]/60">
                    <td className="p-3.5 font-semibold text-[#0D1211]">{v.name}</td>
                    <td className="p-3.5 text-[#3D7BFF]">{v.unit}</td>
                    <td className="p-3.5 text-[#747A75] font-sans">{v.description}</td>
                    <td className="p-3.5 text-[#747A75]">{v.dataType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Methodology & Provenance */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] block">
              Instrument & Methodology
            </span>
            <h3 className="font-serif text-xl font-medium text-[#0D1211]">Sensor Apparatus</h3>
            <p className="text-xs font-mono text-[#0D1211]">{dataset.instrument}</p>
            <p className="text-xs text-[#747A75] font-light leading-relaxed">
              Standard calibration performed before deployment with cross-comparison against primary reference standards.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] block">
              Provenance & Quality Control
            </span>
            <h3 className="font-serif text-xl font-medium text-[#0D1211]">Data Lineage</h3>
            <p className="text-xs text-[#747A75] font-light leading-relaxed">
              {dataset.provenance}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#2E7D32]">
              <ShieldCheck className="w-4 h-4" /> FAIR Compliant · Open Data License {dataset.license}
            </div>
          </div>
        </section>

        {/* Connected Knowledge Relationships */}
        <section className="p-6 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#747A75]">
            Connected Knowledge Relationships
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            {dataset.stationName && (
              <div className="p-3 rounded-lg bg-[#F4F2EC] border border-[#0D1211]/10">
                <span className="text-[10px] text-[#747A75] uppercase block">Recorded At Station</span>
                <span className="font-medium text-[#0D1211] mt-0.5 block">{dataset.stationName}</span>
              </div>
            )}
            {dataset.expeditionName && (
              <div className="p-3 rounded-lg bg-[#F4F2EC] border border-[#0D1211]/10">
                <span className="text-[10px] text-[#747A75] uppercase block">Collected During Expedition</span>
                <span className="font-medium text-[#0D1211] mt-0.5 block">{dataset.expeditionName}</span>
              </div>
            )}
            <div className="p-3 rounded-lg bg-[#F4F2EC] border border-[#0D1211]/10">
              <span className="text-[10px] text-[#747A75] uppercase block">FAIR Repository Standard</span>
              <span className="font-medium text-[#0D1211] mt-0.5 block">ISO 19115 & DataCite 4.4</span>
            </div>
          </div>
        </section>

        {/* Developer REST API Section */}
        <section className="p-6 rounded-xl bg-[#0D1211] text-[#F4F2EC] space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#B7FF5A]">
            <Terminal className="w-4 h-4" />
            <span className="uppercase tracking-widest text-[10px]">Programmatic REST API Access</span>
          </div>
          <div className="bg-[#192220] p-3 rounded-lg text-[11px] overflow-x-auto text-[#747A75]">
            <code>GET https://oruvia.science/api/datasets/{dataset.slug}</code>
          </div>
          <p className="text-[#747A75] text-[11px]">
            JSON-LD Linked Data and NetCDF binaries are accessible via authenticated or open scientific endpoints.
          </p>
        </section>
      </main>

      {/* Citation Modal */}
      {citations && (
        <CitationModal
          isOpen={showCitationModal}
          onClose={() => setShowCitationModal(false)}
          title={dataset.title}
          citations={citations}
        />
      )}

      <Footer />
    </div>
  );
};

export default DatasetDetailPage;
