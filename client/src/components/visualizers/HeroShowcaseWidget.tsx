import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Sparkles,
  ShieldCheck,
  Globe,
  Compass,
  Activity,
  Terminal,
  Zap,
  ArrowUpRight,
  Database,
  Layers,
  Cpu,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'wouter';

interface StationTarget {
  id: string;
  name: string;
  code: string;
  region: string;
  coords: string;
  temp: number;
  pressure: number;
  wind: string;
  iceDepth: string;
  status: 'ONLINE' | 'TRANSMITTING' | 'CALIBRATING';
  xPct: number; // position inside radar visual %
  yPct: number;
}

const STATIONS: StationTarget[] = [
  {
    id: 'bharti',
    name: 'Bharti Station',
    code: 'BHT-ANT',
    region: 'East Antarctica (Larsemann Hills)',
    coords: '69°24\'S 76°11\'E',
    temp: -18.6,
    pressure: 982.4,
    wind: '28 kn SSW',
    iceDepth: '840.2 m',
    status: 'ONLINE',
    xPct: 62,
    yPct: 68,
  },
  {
    id: 'maitri',
    name: 'Maitri Station',
    code: 'MTR-ANT',
    region: 'Schirmacher Oasis, Antarctica',
    coords: '70°45\'S 11°44\'E',
    temp: -21.3,
    pressure: 978.1,
    wind: '34 kn S',
    iceDepth: '620.0 m',
    status: 'TRANSMITTING',
    xPct: 35,
    yPct: 75,
  },
  {
    id: 'himadri',
    name: 'Himadri Station',
    code: 'HMD-ARC',
    region: 'Svalbard, Arctic',
    coords: '78°55\'N 11°56\'E',
    temp: -6.4,
    pressure: 1004.2,
    wind: '16 kn ENE',
    iceDepth: '145.5 m',
    status: 'ONLINE',
    xPct: 48,
    yPct: 24,
  },
  {
    id: 'himansh',
    name: 'Himansh Station',
    code: 'HMS-HIM',
    region: 'Himalayas (Spiti Valley)',
    coords: '32°24\'N 77°37\'E',
    temp: -2.1,
    pressure: 640.8,
    wind: '12 kn NW',
    iceDepth: ' Glacier Core B4',
    status: 'ONLINE',
    xPct: 75,
    yPct: 42,
  },
];

const PROMPT_EXAMPLES = [
  {
    question: "What paleoclimate anomalies were logged at Bharti Station in 2024?",
    answer: "Analysis of 840m ice core isotope samples (δ18O) indicates a +1.4°C thermal variance anomaly during the 2024 Austral summer, verified via 3 sensor arrays.",
    sources: ["Bharti Core DS-8842", "Maitri Telemetry Log #440", "Polar Science Vol 142"],
    confidence: "99.8%",
    hash: "0x8f92a4b1"
  },
  {
    question: "Summarize Antarctic sea ice extent trend from recent telemetry",
    answer: "Satellite radiometric telemetry from Southern Ocean array shows seasonal minimum of 2.04 M km², stabilized by katabatic wind vectors in East Antarctica.",
    sources: ["SMMR Satellite Array", "Southern Ocean Buoy-09", "NSIDC Cross-Ref"],
    confidence: "98.5%",
    hash: "0x3e71c990"
  },
  {
    question: "What is the evidence verification status for Arctic aerosol datasets?",
    answer: "100% Cryptographic Evidence Lock. All 1,420 observational tuples locked with cryptographic hash verification across Svalbard ground stations.",
    sources: ["Himadri Atmospheric Log", "Aerosol Sounding #901"],
    confidence: "100%",
    hash: "0xaa12891f"
  }
];

export const HeroShowcaseWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'rag' | 'expeditions'>('telemetry');
  const [selectedStation, setSelectedStation] = useState<StationTarget>(STATIONS[0]);
  const [activePromptIdx, setActivePromptIdx] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Real-time jitter for live telemetry feel
  const [liveJitter, setLiveJitter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveJitter((prev) => (prev + 1) % 100);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentPrompt = PROMPT_EXAMPLES[activePromptIdx];

  const handlePromptSelect = (idx: number) => {
    setIsSimulating(true);
    setActivePromptIdx(idx);
    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#B7FF5A]/30 via-[#3D7BFF]/20 to-[#B7FF5A]/20 rounded-3xl blur-xl opacity-60 animate-pulse pointer-events-none" />

      {/* Main Glassmorphic Dark Container */}
      <div className="relative bg-[#0D1211] text-[#F4F2EC] rounded-3xl p-5 sm:p-7 border border-[#F4F2EC]/15 shadow-2xl overflow-hidden font-sans">
        
        {/* Subtle grid pattern background overlay */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#F4F2EC 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Card Header & Controls */}
        <div className="relative flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F4F2EC]/10">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-[#B7FF5A]/20 border border-[#B7FF5A]/40">
              <span className="w-2 h-2 rounded-full bg-[#B7FF5A] animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-[#B7FF5A] relative" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#B7FF5A] font-medium tracking-wider uppercase">
                <span>ORUVIA TELEMETRY NODE</span>
                <span className="px-1.5 py-0.2 rounded bg-[#B7FF5A]/15 text-[9px]">LIVE</span>
              </div>
              <p className="text-[10px] font-mono text-[#747A75]">STREAM ID: POLAR-GRID-094 · 100% PROVENANCE</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#192220] border border-[#F4F2EC]/10 text-[11px] font-mono">
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'telemetry'
                  ? 'bg-[#B7FF5A] text-[#0D1211] font-semibold shadow'
                  : 'text-[#747A75] hover:text-[#F4F2EC]'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>Telemetry</span>
            </button>
            <button
              onClick={() => setActiveTab('rag')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'rag'
                  ? 'bg-[#B7FF5A] text-[#0D1211] font-semibold shadow'
                  : 'text-[#747A75] hover:text-[#F4F2EC]'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>RAG AI</span>
            </button>
            <button
              onClick={() => setActiveTab('expeditions')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'expeditions'
                  ? 'bg-[#B7FF5A] text-[#0D1211] font-semibold shadow'
                  : 'text-[#747A75] hover:text-[#F4F2EC]'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Expeditions</span>
            </button>
          </div>
        </div>

        {/* Tab 1: TELEMETRY & RADAR */}
        {activeTab === 'telemetry' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-5 space-y-4"
          >
            {/* Radar Sweeper & Interactive Map View */}
            <div className="relative w-full h-48 sm:h-56 rounded-2xl bg-[#131A18] border border-[#F4F2EC]/10 overflow-hidden flex items-center justify-center p-4">
              
              {/* Polar Radar Grid Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-44 h-44 rounded-full border border-[#B7FF5A]/15 border-dashed animate-spin-slow" />
                <div className="w-32 h-32 rounded-full border border-[#B7FF5A]/25 absolute" />
                <div className="w-20 h-20 rounded-full border border-[#3D7BFF]/30 absolute" />
                <div className="w-full h-[1px] bg-[#F4F2EC]/10 absolute" />
                <div className="h-full w-[1px] bg-[#F4F2EC]/10 absolute" />
              </div>

              {/* Radar Sweeping Beam */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none origin-center animate-spin"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(183, 255, 90, 0.25) 0deg, transparent 60deg, transparent 360deg)',
                  animationDuration: '6s'
                }}
              />

              {/* Station Radar Target Dots */}
              {STATIONS.map((st) => {
                const isSelected = selectedStation.id === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStation(st)}
                    className="absolute group transition-transform hover:scale-125 focus:outline-none"
                    style={{ left: `${st.xPct}%`, top: `${st.yPct}%` }}
                  >
                    <span className="relative flex h-4 w-4 items-center justify-center">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSelected ? 'bg-[#B7FF5A]' : 'bg-[#3D7BFF]'}`} />
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSelected ? 'bg-[#B7FF5A] ring-4 ring-[#B7FF5A]/30' : 'bg-[#3D7BFF]'}`} />
                    </span>

                    {/* Hover Label */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap px-2 py-0.5 rounded bg-[#0D1211] border border-[#F4F2EC]/20 text-[10px] font-mono text-[#F4F2EC] z-20 shadow-lg">
                      {st.name} ({st.code})
                    </div>
                  </button>
                );
              })}

              {/* Overlay Overlay Info Box */}
              <div className="absolute top-3 left-3 bg-[#0D1211]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#F4F2EC]/15 font-mono text-[10px] text-[#747A75]">
                <div className="text-[#B7FF5A] font-bold flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>POLAR TELEMETRY MATRIX</span>
                </div>
                <div>SELECT TARGET NODE TO VIEW</div>
              </div>

              {/* Top Right Coordinates readout */}
              <div className="absolute top-3 right-3 text-right font-mono text-[10px] text-[#747A75]">
                <div className="text-[#F4F2EC] font-semibold">{selectedStation.coords}</div>
                <div>{selectedStation.region}</div>
              </div>
            </div>

            {/* Station Details Card */}
            <div className="p-4 rounded-2xl bg-[#161D1B] border border-[#F4F2EC]/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-lg font-medium text-[#F4F2EC]">{selectedStation.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#B7FF5A]/15 text-[#B7FF5A] border border-[#B7FF5A]/30">
                      {selectedStation.code}
                    </span>
                  </div>
                  <p className="text-xs text-[#747A75] font-mono mt-0.5">{selectedStation.region}</p>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs text-[#747A75]">TEMP OBSERVATION</div>
                  <div className="text-xl font-bold text-[#B7FF5A]">
                    {(selectedStation.temp + (liveJitter % 2 === 0 ? 0.1 : -0.1)).toFixed(1)}°C
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1 border-t border-[#F4F2EC]/10">
                <div className="p-2 rounded-xl bg-[#0D1211]/50 border border-[#F4F2EC]/5">
                  <span className="text-[10px] text-[#747A75] block">PRESSURE</span>
                  <span className="font-bold text-[#F4F2EC]">
                    {(selectedStation.pressure + (liveJitter % 3 === 0 ? 0.2 : -0.1)).toFixed(1)} hPa
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#0D1211]/50 border border-[#F4F2EC]/5">
                  <span className="text-[10px] text-[#747A75] block">WIND VECTOR</span>
                  <span className="font-bold text-[#F4F2EC]">{selectedStation.wind}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#0D1211]/50 border border-[#F4F2EC]/5">
                  <span className="text-[10px] text-[#747A75] block">CORE DEPTH</span>
                  <span className="font-bold text-[#3D7BFF]">{selectedStation.iceDepth}</span>
                </div>
              </div>

              {/* Sparkline Live Wave Visual */}
              <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#747A75]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF5A] animate-ping" />
                  <span>Realtime Sensor Telemetry Stream (250Hz)</span>
                </div>
                {/* SVG Mini Wave */}
                <svg className="w-28 h-5 text-[#B7FF5A]" viewBox="0 0 100 20" fill="none">
                  <path
                    d={`M0 10 Q15 ${10 + (liveJitter % 5)}, 30 ${8 - (liveJitter % 4)} T60 ${12 + (liveJitter % 3)} T90 ${6 + (liveJitter % 2)} L100 10`}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: RAG AI ENGINE */}
        {activeTab === 'rag' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-5 space-y-4"
          >
            <div>
              <span className="text-[11px] font-mono text-[#747A75] block mb-2">TRY SAMPLE SCIENTIFIC RAG QUERIES:</span>
              <div className="flex flex-col gap-2">
                {PROMPT_EXAMPLES.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptSelect(idx)}
                    className={`p-2.5 rounded-xl text-left text-xs font-mono transition-all flex items-start justify-between gap-2 border ${
                      activePromptIdx === idx
                        ? 'bg-[#B7FF5A]/15 border-[#B7FF5A] text-[#F4F2EC]'
                        : 'bg-[#161D1B] border-[#F4F2EC]/10 text-[#747A75] hover:text-[#F4F2EC] hover:border-[#F4F2EC]/30'
                    }`}
                  >
                    <span className="line-clamp-1">{p.question}</span>
                    <Sparkles className={`w-3.5 h-3.5 shrink-0 ${activePromptIdx === idx ? 'text-[#B7FF5A]' : 'text-[#747A75]'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Display Box */}
            <div className="p-4 rounded-2xl bg-[#161D1B] border border-[#F4F2EC]/10 space-y-3 relative">
              {isSimulating ? (
                <div className="py-8 flex items-center justify-center gap-2 text-xs font-mono text-[#747A75]">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#B7FF5A]" />
                  <span>Synthesizing vector embeddings...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-[11px] font-mono border-b border-[#F4F2EC]/10 pb-2">
                    <div className="flex items-center gap-1.5 text-[#B7FF5A]">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>RAG RESPONSE GENERATED</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#747A75]">
                      <span>Confidence: <strong className="text-[#F4F2EC]">{currentPrompt.confidence}</strong></span>
                      <span className="px-1.5 py-0.5 rounded bg-[#3D7BFF]/20 text-[#3D7BFF] text-[9px]">PROVENANCE LOCKED</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#F4F2EC] font-serif leading-relaxed">
                    "{currentPrompt.answer}"
                  </p>

                  {/* Sources & Evidence Tags */}
                  <div className="pt-2 border-t border-[#F4F2EC]/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[#747A75]">CITED:</span>
                      {currentPrompt.sources.map((src, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#0D1211] border border-[#F4F2EC]/15 text-[#B7FF5A]">
                          {src}
                        </span>
                      ))}
                    </div>
                    <Link
                      href="/ask"
                      className="text-[#3D7BFF] hover:underline flex items-center gap-1"
                    >
                      <span>Open RAG AI Studio</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 3: EXPEDITIONS */}
        {activeTab === 'expeditions' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-5 space-y-3"
          >
            <div className="p-3.5 rounded-2xl bg-[#161D1B] border border-[#F4F2EC]/10 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#B7FF5A]/20 text-[#B7FF5A] font-semibold">
                    ACTIVE MISSION
                  </span>
                  <h4 className="font-serif text-base text-[#F4F2EC] mt-1 font-medium">43rd Indian Antarctic Expedition (NAE-43)</h4>
                  <p className="text-xs text-[#747A75] font-mono">Larsemann Hills & Schirmacher Oasis</p>
                </div>
                <span className="text-xs font-mono text-[#B7FF5A]">42 Deployed</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F4F2EC]/10 text-[11px] font-mono text-[#747A75]">
                <div>STATUS: <span className="text-[#F4F2EC]">ON STATION</span></div>
                <div>DATA SYNC: <span className="text-[#B7FF5A]">1.8 TB</span></div>
                <div>PROVENANCE: <span className="text-[#3D7BFF]">LOCKED</span></div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#161D1B] border border-[#F4F2EC]/10 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#3D7BFF]/20 text-[#3D7BFF] font-semibold">
                    ARCTIC MONITORING
                  </span>
                  <h4 className="font-serif text-base text-[#F4F2EC] mt-1 font-medium">Svalbard Glacier Dynamics Recon</h4>
                  <p className="text-xs text-[#747A75] font-mono">Ny-Ålesund, Arctic Archipelago</p>
                </div>
                <span className="text-xs font-mono text-[#3D7BFF]">16 Deployed</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F4F2EC]/10 text-[11px] font-mono text-[#747A75]">
                <div>STATUS: <span className="text-[#F4F2EC]">SAMPLING</span></div>
                <div>CORE DEPTH: <span className="text-[#F4F2EC]">145.5m</span></div>
                <div>VERIFIED: <span className="text-[#B7FF5A]">100%</span></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Card Footer Bar */}
        <div className="mt-5 pt-3 border-t border-[#F4F2EC]/10 flex items-center justify-between text-[11px] font-mono text-[#747A75]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B7FF5A]" />
            <span>ORUVIA Cryptographic Evidence Protocol v2.4</span>
          </div>
          <Link
            href="/explore"
            className="text-[#F4F2EC] hover:text-[#B7FF5A] transition-colors flex items-center gap-1 font-semibold"
          >
            <span>Explore full dataset →</span>
          </Link>
        </div>
      </div>

      {/* Floating Decorative Glass Badges surrounding the visual */}
      
      {/* Top Right Floating Badge */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-5 -right-4 sm:-right-6 bg-[#0D1211]/90 text-[#F4F2EC] border border-[#B7FF5A]/40 px-3.5 py-2 rounded-2xl shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2.5 z-20"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B7FF5A] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B7FF5A]" />
        </span>
        <div className="font-mono text-[11px]">
          <span className="text-[#747A75] block text-[9px] uppercase tracking-wider">BHARTI STATION</span>
          <span className="font-bold text-[#B7FF5A]">{(selectedStation.temp + (liveJitter % 2 === 0 ? 0.1 : -0.1)).toFixed(1)}°C</span>
          <span className="text-[#747A75] ml-1.5 font-normal">AIR TEMP</span>
        </div>
      </motion.div>

      {/* Bottom Left Floating Badge */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-5 -left-4 sm:-left-6 bg-[#0D1211]/90 text-[#F4F2EC] border border-[#F4F2EC]/20 px-3.5 py-2.5 rounded-2xl shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3 z-20"
      >
        <div className="w-7 h-7 rounded-xl bg-[#3D7BFF]/20 border border-[#3D7BFF]/40 flex items-center justify-center text-[#3D7BFF]">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="font-mono text-[11px]">
          <div className="flex items-center gap-1 font-bold text-[#F4F2EC]">
            <span>Evidence Lock</span>
            <span className="text-[#B7FF5A]">100%</span>
          </div>
          <span className="text-[9px] text-[#747A75] block">CRYPTOGRAPHICALLY VERIFIED</span>
        </div>
      </motion.div>

    </div>
  );
};
