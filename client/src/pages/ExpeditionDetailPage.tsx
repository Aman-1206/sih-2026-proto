import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import {
  MapPin,
  Calendar,
  Users,
  Database,
  FileText,
  Image as ImageIcon,
  Compass,
  ArrowRight,
  Route,
  Ship,
  Download,
  Search,
  List,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { api } from '../services/api';
import { IExpedition, IDataset, IPublication, IMediaAsset } from '@oruvia/shared';

export const ExpeditionDetailPage: React.FC = () => {
  const [, params] = useRoute('/expeditions/:slug');
  const slug = params?.slug || '';

  const [expedition, setExpedition] = useState<IExpedition | null>(null);
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  const [publications, setPublications] = useState<IPublication[]>([]);
  const [media, setMedia] = useState<IMediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [docSearch, setDocSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'REPORT' | 'DATASETS' | 'MEDIA'>('REPORT');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.expeditions.getBySlug(slug)
      .then((data) => {
        setExpedition(data.expedition);
        setDatasets(data.datasets || []);
        setPublications(data.publications || []);
        setMedia(data.media || []);
      })
      .catch((err) => console.error('Failed to load expedition detail:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex items-center justify-center font-mono text-xs text-[#747A75]">
        Loading institutional expedition report and route log...
      </div>
    );
  }

  if (!expedition) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex flex-col justify-between">
        <Navbar />
        <main className="max-w-4xl mx-auto py-32 px-6 text-center space-y-4">
          <h1 className="font-serif text-3xl">Expedition Not Found</h1>
          <Link href="/expeditions" className="px-4 py-2 bg-[#0D1211] text-[#F4F2EC] rounded font-mono text-xs uppercase inline-block">
            Back to Expeditions
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleDownloadPdfReport = () => {
    const reportText = `ORUVIA DEMONSTRATION DOCUMENT — ILLUSTRATIVE DATA\n\nEXPEDITION REPORT: ${expedition.name} (${expedition.number})\nRegion: ${expedition.region}\nLead Scientist: ${expedition.leadScientist?.name}\n\n1. EXECUTIVE SUMMARY\n${expedition.overview}\n\n2. PRELIMINARY RESULTS\nDeep firn drilling successfully recovered 1,200m core sections. Atmospheric telemetry logged continuously at 10-minute intervals.\n\n3. PROVENANCE\nSubmitted under FAIR guidelines into ORUVIA Scientific Knowledge Repository.`;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${expedition.slug}_demo_report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-6 sm:px-8 pt-28 pb-24 w-full space-y-8">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0D1211]/10 text-xs font-mono text-[#747A75]">
          <div className="flex items-center gap-2">
            <Link href="/expeditions" className="hover:text-[#0D1211]">Expeditions</Link>
            <span>/</span>
            <span className="text-[#0D1211] font-semibold">{expedition.number}</span>
            <span>/</span>
            <span className="truncate max-w-xs">{expedition.slug}</span>
          </div>

          <div className="flex items-center gap-2">
            <VerificationBadge isDemo={true} />
            <button
              onClick={handleDownloadPdfReport}
              className="px-4 py-2 bg-[#0D1211] text-[#B7FF5A] rounded-lg font-mono text-xs uppercase font-semibold hover:bg-[#192220] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Demo Report
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded bg-[#0D1211] text-[#B7FF5A] font-semibold">
                {expedition.number}
              </span>
              <span className="text-[#747A75]">{expedition.region}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0D1211] leading-tight">
              {expedition.name}
            </h1>

            <p className="text-sm sm:text-base text-[#747A75] font-light leading-relaxed">
              {expedition.overview}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#747A75] uppercase block">Dates</span>
                <span className="text-[#0D1211]">{expedition.dates?.startDate} to {expedition.dates?.endDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#747A75] uppercase block">Lead Scientist</span>
                <span className="text-[#0D1211]">{expedition.leadScientist?.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#747A75] uppercase block">Vessel / Transport</span>
                <span className="text-[#0D1211]">{expedition.vesselOrTransport || 'Polar Ice-Class Vessel'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 h-80 rounded-2xl overflow-hidden border border-[#0D1211]/15 relative">
            <img
              src={expedition.coverImageUrl}
              alt={expedition.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0D1211]/80 backdrop-blur-md text-[10px] font-mono text-[#B7FF5A]">
              ORUVIA Demonstration Document — Illustrative Data
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="p-1.5 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 flex items-center gap-2 font-mono text-xs">
          {[
            { id: 'REPORT', label: '📖 Full Institutional Report' },
            { id: 'OVERVIEW', label: '🗺️ Route & Milestones' },
            { id: 'DATASETS', label: `📊 Datasets (${datasets.length})` },
            { id: 'MEDIA', label: `📸 Media Archive (${media.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === t.id ? 'bg-[#0D1211] text-[#B7FF5A]' : 'text-[#747A75] hover:text-[#0D1211]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: FULL INSTITUTIONAL REPORT VIEWER */}
        {activeTab === 'REPORT' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* TOC Sidebar */}
            <div className="lg:col-span-3 sticky top-28 space-y-3 p-4 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#0D1211]/10 pb-2">
                <span className="font-semibold text-[#0D1211]">Report Contents</span>
                <List className="w-3.5 h-3.5 text-[#747A75]" />
              </div>
              <nav className="space-y-1 text-[#747A75] text-[11px]">
                {[
                  { id: 'rep-exec', label: '1. Executive Summary' },
                  { id: 'rep-mission', label: '2. Mission Overview' },
                  { id: 'rep-objectives', label: '3. Strategic Objectives' },
                  { id: 'rep-team', label: '4. Team & Logistics' },
                  { id: 'rep-science', label: '5. Scientific Programme' },
                  { id: 'rep-[#0D1211]', label: '6. Operations & Milestones' },
                  { id: 'rep-results', label: '7. Preliminary Results' },
                  { id: 'rep-datasets', label: '8. Produced Datasets' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="w-full text-left py-1 px-2 rounded hover:bg-[#F4F2EC] hover:text-[#0D1211] block transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Report Document Body */}
            <div className="lg:col-span-9 space-y-8 bg-[#FAF9F5] p-8 rounded-2xl border border-[#0D1211]/15 shadow-sm">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 font-mono text-xs text-amber-800 flex items-center justify-between">
                <span>ORUVIA Institutional Report · Confidential Archive Representation</span>
                <span className="font-semibold">DEMO RECORD</span>
              </div>

              {/* 1. Executive Summary */}
              <section id="rep-exec" className="space-y-3">
                <h2 className="font-serif text-3xl font-medium text-[#0D1211]">1. Executive Summary</h2>
                <p className="text-sm text-[#747A75] font-light leading-relaxed">
                  The {expedition.name} was mobilized to conduct multi-disciplinary Earth observation and polar ice sampling across the {expedition.region}. Over the deployment period, the field team successfully achieved 100% of core scientific objectives, completing deep firn drilling operations, continuous meteorological logging, and high-resolution marine CTD casts.
                </p>
              </section>

              {/* 2. Mission Overview */}
              <section id="rep-mission" className="space-y-3 border-t border-[#0D1211]/10 pt-6">
                <h2 className="font-serif text-2xl font-medium text-[#0D1211]">2. Mission Overview & Logistics</h2>
                <div className="p-4 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 font-mono text-xs space-y-2">
                  <p><strong>Lead Scientist:</strong> {expedition.leadScientist?.name} ({expedition.leadScientist?.affiliation})</p>
                  <p><strong>Personnel:</strong> {expedition.participantsCount} Research Scientists, Engineers, and Logistics Officers</p>
                  <p><strong>Transport Platform:</strong> {expedition.vesselOrTransport || 'Polar Ice-Class Research Vessel'}</p>
                </div>
              </section>

              {/* 3. Strategic Objectives */}
              <section id="rep-objectives" className="space-y-3 border-t border-[#0D1211]/10 pt-6">
                <h2 className="font-serif text-2xl font-medium text-[#0D1211]">3. Strategic Research Objectives</h2>
                <ul className="space-y-2 text-sm text-[#747A75] font-light list-disc pl-5">
                  <li>Recover deep ice core sections down to 1,200m for paleoclimate isotopic reconstruction (δ18O, δD).</li>
                  <li>Deploy automated weather stations (AWS) for continuous high-altitude atmospheric boundary layer monitoring.</li>
                  <li>Measure seasonal ice velocity vectors using high-precision DGPS arrays.</li>
                  <li>Characterize coastal fjord hydrography and phytoplankton bloom dynamics.</li>
                </ul>
              </section>

              {/* 5. Scientific Programme */}
              <section id="rep-science" className="space-y-3 border-t border-[#0D1211]/10 pt-6">
                <h2 className="font-serif text-2xl font-medium text-[#0D1211]">5. Scientific Programme</h2>
                <p className="text-sm text-[#747A75] font-light leading-relaxed">
                  The scientific programme encompassed three major domains: Glaciology, Atmospheric Physics, and Oceanography. In-field processing of core samples was conducted in specialized sub-zero clean-room laboratory containers.
                </p>
              </section>

              {/* 7. Preliminary Results */}
              <section id="rep-results" className="space-y-3 border-t border-[#0D1211]/10 pt-6">
                <h2 className="font-serif text-2xl font-medium text-[#0D1211]">7. Preliminary Results</h2>
                <p className="text-sm text-[#747A75] font-light leading-relaxed">
                  Preliminary gas chromatography confirms pristine atmospheric retention within bubble closure depths. Meteorological telemetry captured severe katabatic wind events reaching peak speeds of 48.5 knots while maintaining complete instrument integrity.
                </p>
              </section>

              {/* 8. Produced Datasets */}
              <section id="rep-datasets" className="space-y-4 border-t border-[#0D1211]/10 pt-6 font-mono text-xs">
                <h2 className="font-serif text-2xl font-medium text-[#0D1211] font-sans">8. Produced Datasets & Publications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {datasets.map((d) => (
                    <div key={d.slug} className="p-4 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 space-y-2">
                      <span className="text-[#3D7BFF] font-semibold block">{d.title}</span>
                      <p className="text-[#747A75] text-[11px]">DOI: {d.doi}</p>
                      <Link href={`/datasets/${d.slug}`} className="inline-flex items-center gap-1 text-[#0D1211] font-bold hover:underline">
                        <span>Open Telemetry Dataset</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* TAB 2: OVERVIEW & MILESTONES */}
        {activeTab === 'OVERVIEW' && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-6 space-y-4">
                {expedition.milestones?.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono text-[#747A75]">
                      <span className="font-semibold text-[#0D1211]">{m.title}</span>
                      <span>{m.date}</span>
                    </div>
                    <p className="text-xs text-[#747A75] font-light leading-relaxed">{m.description}</p>
                  </div>
                ))}
              </div>

              <div className="md:col-span-6 p-6 rounded-xl bg-[#0D1211] text-[#F4F2EC] flex flex-col justify-between space-y-6 font-mono text-xs">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase text-[#B7FF5A] tracking-widest">Waypoints Log</span>
                  <h4 className="font-serif text-xl font-medium">Trajectory Coordinates</h4>
                  <div className="space-y-1 text-[#747A75] text-[11px] pt-2">
                    {expedition.routeCoordinates?.map((coord, i) => (
                      <div key={i} className="flex justify-between border-b border-[#192220] py-1">
                        <span>Waypoint {i + 1}</span>
                        <span className="text-[#F4F2EC]">{coord[1].toFixed(4)}°N, {coord[0].toFixed(4)}°E</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  href="/atlas"
                  className="w-full py-2.5 bg-[#B7FF5A] text-[#0D1211] rounded text-center uppercase font-semibold hover:bg-lime-400 transition-colors"
                >
                  Track in Scientific Atlas →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: DATASETS */}
        {activeTab === 'DATASETS' && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {datasets.map((d) => (
                <Link
                  key={d.slug}
                  href={`/datasets/${d.slug}`}
                  className="p-5 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] hover:border-[#0D1211] transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-[#3D7BFF]">
                    <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Calibrated Dataset</span>
                    <span>Level {d.processingLevel}</span>
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#0D1211] group-hover:text-[#3D7BFF] transition-colors">
                    {d.title}
                  </h4>
                  <p className="text-xs text-[#747A75] font-light line-clamp-2">{d.abstract}</p>
                  <span className="text-xs font-mono text-[#0D1211] group-hover:underline pt-2">
                    Inspect Dataset & Telemetry →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ExpeditionDetailPage;
