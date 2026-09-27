import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Database,
  FileText,
  MapPin,
  Radio,
  Globe2,
  Calendar,
  Layers,
  Activity,
  Search,
  BookOpen,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { DataVisualizer } from '../components/visualizers/DataVisualizer';
import { ScientificAtlas } from '../components/visualizers/ScientificAtlas';
import { HeroShowcaseWidget } from '../components/visualizers/HeroShowcaseWidget';
import { useLanguageStore } from '../stores/languageStore';
import { api } from '../services/api';
import { SCIENCE_DOMAINS, REGIONS } from '@oruvia/shared';

export const HomePage: React.FC = () => {
  const { t } = useLanguageStore();
  const [stations, setStations] = useState<any[]>([]);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [expeditions, setExpeditions] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [activeScienceDomain, setActiveScienceDomain] = useState<string>('Cryosphere');
  const [selectedRegion, setSelectedRegion] = useState<string>('East Antarctica (Larsemann Hills)');

  // Ask ORUVIA quick demo prompt state
  const [quickPrompt, setQuickPrompt] = useState('');
  const [quickAnswer, setQuickAnswer] = useState<any | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    // Load initial showcase data
    Promise.all([
      api.stations.list(),
      api.datasets.list({ limit: 4 }),
      api.expeditions.list(),
      api.stories.list(),
    ]).then(([st, dt, exp, stList]) => {
      setStations(st.stations || []);
      setDatasets(dt.datasets || []);
      setExpeditions(exp.expeditions || []);
      setStories(stList.stories || []);
    }).catch((err) => {
      console.error('Failed to load homepage data:', err);
    });
  }, []);

  const handleQuickAsk = async (promptText: string) => {
    setQuickPrompt(promptText);
    setIsAsking(true);
    try {
      const res = await api.ai.ask(promptText);
      setQuickAnswer(res);
    } finally {
      setIsAsking(false);
    }
  };

  const featuredStory = stories[0] || {
    slug: 'voices-of-the-polar-ice',
    title: 'Voices of the Polar Ice: How 1,800 Years of Climate Memory Are Read from Cold Cylinders',
    subtitle: 'Inside the sub-zero laboratories where ancient atmospheric bubbles reveal our planet’s thermal heartbeats.',
    heroImageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=80',
    publishedAt: '2024-10-15',
    author: { name: 'Marcus Thorne', role: 'Senior Science Editor' },
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] selection:bg-[#B7FF5A]">
      <Navbar />

      {/* ============================================================ */}
      {/* SECTION 01 — HERO                                           */}
      {/* ============================================================ */}
      <section className="relative min-h-[95vh] flex flex-col justify-between pt-32 pb-16 px-6 sm:px-8 border-b border-[#0D1211]/10 overflow-hidden">
        {/* Background Subtle Atmospheric Abstract Gradient Texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F5] via-[#F4F2EC] to-[#EBE8DF]/40 -z-10" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-[#3D7BFF]/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-[#B7FF5A]/15 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Hero Copy & CTA */}
            <div className="lg:col-span-6 space-y-6">
              {/* System Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1211]/5 border border-[#0D1211]/10 text-[11px] font-mono tracking-wide text-[#747A75]">
                <span className="w-2 h-2 rounded-full bg-[#B7FF5A] animate-pulse" />
                <span>ORUVIA · CONNECTED SCIENTIFIC KNOWLEDGE SYSTEM</span>
              </div>

              {/* Display Title */}
              <h1 className="font-serif text-display-xl tracking-tight text-[#0D1211] font-normal leading-[0.92]">
                Knowledge, <br />
                <span className="italic">alive.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-lg sm:text-xl text-[#747A75] font-light max-w-xl leading-relaxed">
                Discover the expeditions, observations, people and discoveries shaping our understanding of Earth’s most extraordinary environments.
              </p>

              {/* CTA Group */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/explore"
                  className="px-6 py-3.5 rounded-full bg-[#0D1211] text-[#F4F2EC] text-xs font-mono uppercase tracking-wider hover:bg-[#192220] transition-colors flex items-center gap-2 shadow-lg group"
                >
                  <span>Explore knowledge</span>
                  <ArrowRight className="w-4 h-4 text-[#B7FF5A] transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/ask"
                  className="px-6 py-3.5 rounded-full bg-[#FAF9F5] border border-[#0D1211]/20 text-[#0D1211] text-xs font-mono uppercase tracking-wider hover:border-[#0D1211] transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#3D7BFF]" />
                  <span>Ask ORUVIA (RAG AI)</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Interactive Scientific Control Node */}
            <div className="lg:col-span-6 pt-4 lg:pt-0">
              <HeroShowcaseWidget />
            </div>
          </div>
        </div>

        {/* Hero Footer Bar */}
        <div className="max-w-7xl mx-auto w-full pt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-xs font-mono text-[#747A75]">
          <div className="flex items-center gap-8">
            <div>
              <span className="text-[#0D1211] font-semibold block text-base font-serif">43 Expeditions</span>
              <span>Southern Ocean & Arctic</span>
            </div>
            <div className="border-l border-[#0D1211]/15 pl-8">
              <span className="text-[#0D1211] font-semibold block text-base font-serif">100% Provenance</span>
              <span>Evidence Lock Verification</span>
            </div>
          </div>

          <div className="flex items-center gap-2 animate-bounce">
            <span className="text-[10px] uppercase tracking-widest">Scroll to explore live telemetry</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-90" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 02 — LIVE PLANET (Globe & Live Station Observations) */}
      {/* ============================================================ */}
      <section className="py-24 px-6 sm:px-8 border-b border-[#0D1211]/10 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase block mb-2">
                Live Planetary Observations
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#0D1211]">
                Live Scientific Stations
              </h2>
            </div>
            <Link
              href="/stations"
              className="text-xs font-mono uppercase text-[#0D1211] hover:text-[#3D7BFF] transition-colors flex items-center gap-1.5"
            >
              View all 4 polar observatories →
            </Link>
          </div>

          {/* Station Observation Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stations.map((station) => (
              <div
                key={station.slug}
                className="p-5 rounded-xl border border-[#0D1211]/15 bg-[#F4F2EC] flex flex-col justify-between space-y-4 hover:border-[#0D1211] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#0D1211]">{station.code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#E5A93C]/20 text-[#E5A93C] border border-[#E5A93C]/30">
                      DEMO TELEMETRY
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-medium mt-1 text-[#0D1211]">{station.name}</h3>
                  <p className="text-xs text-[#747A75] font-mono mt-0.5">{station.region}</p>
                </div>

                {station.currentObservations && (
                  <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#0D1211]/10 space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[#747A75]">Ambient Temp</span>
                      <span className="text-lg font-bold text-[#0D1211]">
                        {station.currentObservations.temperatureC}°C
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#747A75]">
                      <span>Wind: {station.currentObservations.windSpeedKts} kts</span>
                      <span>Press: {station.currentObservations.pressureHpa} hPa</span>
                    </div>
                  </div>
                )}

                <Link
                  href={`/stations/${station.slug}`}
                  className="w-full py-2 text-center text-xs font-mono uppercase bg-[#0D1211] text-[#F4F2EC] rounded hover:bg-[#192220] transition-colors"
                >
                  Station Telemetry →
                </Link>
              </div>
            ))}
          </div>

          {/* Interactive Atlas Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#747A75]">
                Geospatial Layer Projection
              </span>
              <Link href="/atlas" className="text-xs font-mono text-[#3D7BFF] hover:underline flex items-center gap-1">
                Full-screen Atlas <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
            <ScientificAtlas height="500px" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 03 — KNOWLEDGE AT A GLANCE (Animated Metrics)         */}
      {/* ============================================================ */}
      <section className="py-24 px-6 sm:px-8 border-b border-[#0D1211]/10 bg-[#F4F2EC]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase">
              Section 03 · Repository Synthesis
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#0D1211]">
              Knowledge, indexed & interconnected.
            </h2>
            <p className="text-sm sm:text-base text-[#747A75] font-light leading-relaxed">
              Every scientific datum captured during high-latitude campaigns is linked with peer-reviewed publications, physical sample provenance, and multimedia archives.
            </p>
          </div>

          {/* Compositional Metrics Matrix */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-1">
              <span className="font-serif text-5xl sm:text-6xl font-normal text-[#0D1211] block">43</span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#747A75]">Polar Expeditions</span>
              <p className="text-[11px] text-[#747A75] pt-2">Spanning 1981 to present</p>
            </div>

            <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-1">
              <span className="font-serif text-5xl sm:text-6xl font-normal text-[#3D7BFF] block">15+</span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#747A75]">FAIR Datasets</span>
              <p className="text-[11px] text-[#747A75] pt-2">Calibrated L2/L3 telemetry</p>
            </div>

            <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-1">
              <span className="font-serif text-5xl sm:text-6xl font-normal text-[#0D1211] block">18</span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#747A75]">Publications</span>
              <p className="text-[11px] text-[#747A75] pt-2">With DataCite DOIs</p>
            </div>

            <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-1">
              <span className="font-serif text-5xl sm:text-6xl font-normal text-[#0D1211] block">40</span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#747A75]">Media Records</span>
              <p className="text-[11px] text-[#747A75] pt-2">Calibrated photography</p>
            </div>

            <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-1">
              <span className="font-serif text-5xl sm:text-6xl font-normal text-[#2E7D32] block">4</span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#747A75]">Stations</span>
              <p className="text-[11px] text-[#747A75] pt-2">Antarctica, Arctic, Himalayas</p>
            </div>

            <div className="p-6 rounded-xl bg-[#0D1211] text-[#F4F2EC] space-y-1 flex flex-col justify-between">
              <div>
                <span className="font-serif text-2xl font-normal text-[#B7FF5A] block">100%</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#747A75]">Evidence Lock</span>
              </div>
              <Link href="/studio" className="text-xs font-mono text-[#B7FF5A] hover:underline pt-2">
                Open Studio →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 04 — FEATURED STORY (Large Editorial Split Layout)   */}
      {/* ============================================================ */}
      <section className="py-24 px-6 sm:px-8 border-b border-[#0D1211]/10 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase">
              Featured Editorial Story
            </span>
            <div className="flex items-center gap-2 text-xs font-mono text-[#747A75]">
              <span>Reading Levels: Quick · Student · General · Research</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F4F2EC] rounded-2xl border border-[#0D1211]/15 overflow-hidden p-6 sm:p-10">
            {/* Cinematic Image */}
            <div className="lg:col-span-6 overflow-hidden rounded-xl h-80 sm:h-96">
              <img
                src={featuredStory.heroImageUrl}
                alt={featuredStory.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Long-form title and metadata */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3 text-xs font-mono text-[#747A75]">
                <span>By {featuredStory.author.name}</span>
                <span>·</span>
                <span>{new Date(featuredStory.publishedAt).toLocaleDateString()}</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl text-[#0D1211] font-normal leading-tight">
                {featuredStory.title}
              </h3>

              <p className="text-sm sm:text-base text-[#747A75] font-light leading-relaxed">
                {featuredStory.subtitle}
              </p>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  href={`/stories/${featuredStory.slug}`}
                  className="px-6 py-3 rounded-full bg-[#0D1211] text-[#F4F2EC] text-xs font-mono uppercase tracking-wider hover:bg-[#192220] transition-colors flex items-center gap-2"
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B7FF5A]" />
                </Link>
                <Link
                  href="/stories"
                  className="text-xs font-mono text-[#747A75] hover:text-[#0D1211] transition-colors"
                >
                  Browse all 6 stories →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 05 — EXPLORE BY PLACE                               */}
      {/* ============================================================ */}
      <section className="py-24 px-6 sm:px-8 border-b border-[#0D1211]/10 bg-[#F4F2EC]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase block mb-2">
              Geographical Focus
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#0D1211]">
              Explore by Place
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'East Antarctica',
                region: 'Larsemann Hills & Princess Elizabeth Land',
                desc: 'Coastal rock oasis, firn drilling, and Bharati Research Station.',
                img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
                station: 'Bharati Station',
              },
              {
                name: 'Central Dronning Maud Land',
                region: 'Schirmacher Oasis & Inland Nunataks',
                desc: 'Paleolimnology, auroral geomagnetism, and Maitri Station.',
                img: 'https://images.unsplash.com/photo-1548263594-a71ea65a8598?auto=format&fit=crop&w=800&q=80',
                station: 'Maitri Station',
              },
              {
                name: 'Svalbard Archipelago',
                region: 'Ny-Ålesund & Kongsfjorden (79°N)',
                desc: 'Arctic fjord hydrography, marine metagenomics, and Himadri Station.',
                img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
                station: 'Himadri Arctic Station',
              },
              {
                name: 'Western Himalayas',
                region: 'Chandra-Bhaga Basin (4,080m)',
                desc: 'High-altitude glacier mass balance, DGPS, and Himansh Observatory.',
                img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                station: 'Himansh Observatory',
              },
            ].map((place) => (
              <div
                key={place.name}
                className="group rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={place.img}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#0D1211]/80 backdrop-blur-sm text-[10px] font-mono text-[#B7FF5A]">
                    {place.station}
                  </div>
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#0D1211]">{place.name}</h3>
                    <p className="text-xs text-[#747A75] font-mono mt-0.5">{place.region}</p>
                    <p className="text-xs text-[#747A75] mt-2 font-light">{place.desc}</p>
                  </div>
                  <Link
                    href={`/search?region=${encodeURIComponent(place.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#0D1211] font-semibold hover:text-[#3D7BFF] pt-2"
                  >
                    Explore Resources →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 06 — EXPLORE BY SCIENCE (Horizontal Taxonomy)       */}
      {/* ============================================================ */}
      <section className="py-24 px-6 sm:px-8 border-b border-[#0D1211]/10 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase block mb-2">
              Scientific Disciplines
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#0D1211]">
              Explore by Science
            </h2>
          </div>

          {/* Interactive Horizontal Taxonomy Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SCIENCE_DOMAINS.map((domain) => (
              <button
                key={domain}
                onClick={() => setActiveScienceDomain(domain)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeScienceDomain === domain
                    ? 'bg-[#0D1211] text-[#B7FF5A] shadow-md font-semibold'
                    : 'bg-[#F4F2EC] text-[#747A75] hover:text-[#0D1211] hover:bg-[#EBE8DF]'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>

          {/* Active Domain Overview Card */}
          <div className="p-8 rounded-2xl bg-[#F4F2EC] border border-[#0D1211]/15 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#3D7BFF] font-semibold">
                Research Domain
              </span>
              <h3 className="font-serif text-3xl font-medium text-[#0D1211]">
                {activeScienceDomain} Dynamics & Telemetry
              </h3>
              <p className="text-sm text-[#747A75] font-light leading-relaxed">
                Discover verified datasets, peer-reviewed articles, sensor arrays, and expedition reports categorized under {activeScienceDomain}.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <Link
                href={`/datasets?domain=${encodeURIComponent(activeScienceDomain)}`}
                className="px-6 py-3 rounded-full bg-[#0D1211] text-[#F4F2EC] text-xs font-mono uppercase tracking-wider hover:bg-[#192220] transition-colors"
              >
                Filter {activeScienceDomain} Datasets →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 07 — EXPEDITION TIMELINE                            */}
      {/* ============================================================ */}
      <section className="py-24 px-6 sm:px-8 border-b border-[#0D1211]/10 bg-[#F4F2EC]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase block mb-2">
                Archival Record
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#0D1211]">
                Expedition Timeline
              </h2>
            </div>
            <Link href="/timeline" className="text-xs font-mono uppercase text-[#0D1211] hover:text-[#3D7BFF]">
              Full Interactive Timeline →
            </Link>
          </div>

          <div className="space-y-4">
            {expeditions.slice(0, 4).map((exp, idx) => (
              <div
                key={exp.slug}
                className="p-6 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#0D1211] transition-all"
              >
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-full bg-[#0D1211] text-[#B7FF5A] font-mono text-xs flex items-center justify-center shrink-0">
                    {exp.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#0D1211]">{exp.name}</h3>
                    <p className="text-xs text-[#747A75] font-mono mt-0.5">{exp.region} · {exp.dates?.startDate} to {exp.dates?.endDate}</p>
                    <p className="text-xs text-[#747A75] mt-1 line-clamp-1">{exp.overview}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${exp.status === 'COMPLETED' ? 'bg-[#EBE8DF] text-[#747A75]' : 'bg-[#B7FF5A]/30 text-[#2E7D32]'}`}>
                    {exp.status}
                  </span>
                  <Link
                    href={`/expeditions/${exp.slug}`}
                    className="px-4 py-2 bg-[#0D1211] text-[#F4F2EC] rounded text-xs font-mono uppercase hover:bg-[#192220]"
                  >
                    View Route & Datasets →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 08 — ASK ORUVIA (RAG AI Assistant Entrance)         */}
      {/* ============================================================ */}
      <section className="py-24 px-6 sm:px-8 border-b border-[#0D1211]/10 bg-[#0D1211] text-[#F4F2EC]">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#192220] border border-[#747A75]/30 text-xs font-mono text-[#B7FF5A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RETRIEVAL-AUGMENTED GENERATION ASSISTANT</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl font-normal text-[#F4F2EC] leading-tight">
            Ask ORUVIA
          </h2>

          <p className="text-sm sm:text-base text-[#747A75] font-light max-w-xl mx-auto">
            Every scientific answer produced is backed by verifiable citation chips linked to indexed datasets, expedition logs, and peer-reviewed papers.
          </p>

          {/* Quick AI Search Box */}
          <div className="p-2 rounded-2xl bg-[#131B19] border border-[#747A75]/30 flex flex-col sm:flex-row gap-2 text-left">
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="Ask about Larsemann ice cores, Kongsfjorden CTD casts, or Himalayan mass balance..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-[#F4F2EC] placeholder:text-[#747A75] focus:outline-none font-mono"
            />
            <button
              onClick={() => handleQuickAsk(quickPrompt || 'What did the 43rd Antarctic expedition discover in the Larsemann Hills?')}
              disabled={isAsking}
              className="px-6 py-3 rounded-xl bg-[#B7FF5A] text-[#0D1211] font-mono text-xs uppercase font-semibold hover:bg-lime-400 transition-colors shrink-0"
            >
              {isAsking ? 'Querying Repository...' : 'Ask ORUVIA'}
            </button>
          </div>

          {/* Suggested Questions */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {[
              'What are the key variables measured at Bharati Station?',
              'How is Atlantic water intrusion mapped in Kongsfjorden?',
              'What is the ice thinning rate in the Chandra Basin?',
            ].map((q) => (
              <button
                key={q}
                onClick={() => handleQuickAsk(q)}
                className="px-3 py-1.5 rounded-full bg-[#192220] hover:bg-[#25322F] text-xs font-mono text-[#747A75] hover:text-[#F4F2EC] border border-[#747A75]/20 transition-colors text-left"
              >
                "{q}"
              </button>
            ))}
          </div>

          {/* Quick Answer Display with Provenance Citations */}
          {quickAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-[#192220] border border-[#747A75]/30 text-left space-y-4 text-xs font-mono"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#747A75]/20">
                <span className="text-[#B7FF5A] font-semibold">Evidence-Grounded Response</span>
                <span className="text-[#747A75]">Confidence: {Math.round((quickAnswer.confidenceScore || 0.9) * 100)}%</span>
              </div>
              <p className="text-sm font-sans font-light leading-relaxed text-[#F4F2EC]">{quickAnswer.answer}</p>

              {quickAnswer.sources?.length > 0 && (
                <div className="pt-2 border-t border-[#747A75]/20 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#747A75] block">Provenance Citations:</span>
                  <div className="flex flex-wrap gap-2">
                    {quickAnswer.sources.map((s: any, i: number) => (
                      <Link
                        key={i}
                        href={`/${s.resourceType}s/${s.slug}`}
                        className="px-2.5 py-1 rounded bg-[#131B19] border border-[#3D7BFF]/40 text-[#3D7BFF] hover:border-[#3D7BFF] transition-colors flex items-center gap-1.5"
                      >
                        <span>{s.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 09 — MEDIA ARCHIVE MOSAIC                           */}
      {/* ============================================================ */}
      <section className="py-24 px-6 sm:px-8 border-b border-[#0D1211]/10 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase block mb-2">
                Calibrated Imagery
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#0D1211]">
                Media Archive
              </h2>
            </div>
            <Link href="/media" className="text-xs font-mono uppercase text-[#0D1211] hover:text-[#3D7BFF]">
              Browse all 40 archival records →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Bharati Promontory at Sunset', region: 'East Antarctica', img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80' },
              { title: 'Kongsfjorden Glacier Terminus', region: 'Svalbard', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' },
              { title: 'Himansh Observatory High Pass', region: 'Himalayas', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
              { title: 'Southern Ocean CTD Deployment', region: 'Southern Ocean', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
            ].map((m, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden h-64 border border-[#0D1211]/15"
              >
                <img
                  src={m.img}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1211]/90 via-[#0D1211]/20 to-transparent p-4 flex flex-col justify-end text-[#F4F2EC]">
                  <span className="text-[10px] font-mono text-[#B7FF5A]">{m.region}</span>
                  <h4 className="font-serif text-base font-medium">{m.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — FOOTER */}
      <Footer />
    </div>
  );
};

export default HomePage;
