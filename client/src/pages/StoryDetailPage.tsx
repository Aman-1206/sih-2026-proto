import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { api } from '../services/api';
import { BookOpen, ShieldCheck, Database, FileText, ExternalLink, Calendar, User, ArrowLeft } from 'lucide-react';

interface EvidenceLockClaim {
  id: string;
  claimText: string;
  datasetName: string;
  datasetSlug: string;
  variable: string;
  timeRange: string;
  doi: string;
  confidence: number;
}

export const StoryDetailPage: React.FC = () => {
  const [, params] = useRoute('/stories/:slug');
  const slug = params?.slug || '';

  const [activeEvidence, setActiveEvidence] = useState<EvidenceLockClaim | null>(null);

  const DEMO_EVIDENCE_LOCKS: Record<string, EvidenceLockClaim> = {
    claim1: {
      id: 'claim1',
      claimText: 'High-latitude atmospheric temperatures over the Princess Elizabeth Land sector exhibited a +1.2°C warming anomaly over three decades.',
      datasetName: 'Larsemann Hills Firn & Core Isotope Series',
      datasetSlug: 'larsemann-hills-boundary-met-2024',
      variable: 'Air Temperature (°C)',
      timeRange: '1994 - 2024 (Monthly Mean)',
      doi: '10.5281/oruvia.2024.08912',
      confidence: 0.98,
    },
    claim2: {
      id: 'claim2',
      claimText: 'Glacial ice oxygen isotopic ratios (δ18O) reached peak depletion levels of -41.2‰ during maximum ice sheet thickness phases.',
      datasetName: 'Larsemann Deep Core Isotope Stratigraphy',
      datasetSlug: 'larsemann-hills-boundary-met-2024',
      variable: 'δ18O Isotope Ratio (‰)',
      timeRange: '120,000 BP to 2,000 BP',
      doi: '10.1038/s41561-024-01429-w',
      confidence: 1.0,
    },
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-4xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full space-y-10">
        {/* Top Navigation */}
        <div className="flex items-center justify-between pb-4 border-b border-[#0D1211]/10 text-xs font-mono text-[#747A75]">
          <Link href="/stories" className="hover:text-[#0D1211] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Stories
          </Link>
          <VerificationBadge isDemo={true} />
        </div>

        {/* Story Title & Meta Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-mono text-[#3D7BFF]">
            <span className="px-2.5 py-0.5 rounded bg-[#3D7BFF]/10 uppercase font-semibold">Long-Form Feature</span>
            <span>·</span>
            <span>Glaciology & Paleoclimate</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#0D1211] leading-tight">
            Voices of the Polar Ice: How 1,800 Years of Climate Memory Are Read from Cold Cylinders
          </h1>

          <p className="text-base sm:text-xl text-[#747A75] font-light leading-relaxed">
            Inside the sub-zero laboratories where ancient atmospheric bubbles reveal our planet’s thermal heartbeats.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#747A75] pt-2 border-t border-[#0D1211]/10">
            <span>By Dr. Evelyn Vance & Marcus Thorne</span>
            <span>·</span>
            <span>Published Oct 15, 2024</span>
            <span>·</span>
            <span className="text-[#2E7D32]">Evidence Lock Verified (100% Provenance)</span>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="rounded-2xl overflow-hidden border border-[#0D1211]/15 h-96">
          <img
            src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=80"
            alt="Polar Ice Core"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Long-Form Editorial Body Text with Evidence Lock Interactive Highlights */}
        <article className="prose prose-slate max-w-none text-base sm:text-lg leading-relaxed font-light text-[#0D1211] space-y-6">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-normal first-letter:mr-3 first-letter:float-left first-letter:text-[#0D1211]">
            Deep beneath the windswept surface of the East Antarctic ice sheet lies an unwritten library. Every annual snowfall traps tiny pockets of the atmosphere as it compresses into ice. Over centuries, these microscopic air bubbles build a continuous record of Earth’s climate history.
          </p>

          {/* Evidence Lock Statement 1 */}
          <div className="p-4 rounded-xl bg-[#FAF9F5] border-l-4 border-[#B7FF5A] space-y-2 font-mono text-xs shadow-sm">
            <div className="flex items-center justify-between text-[#747A75]">
              <span className="text-[#2E7D32] font-semibold uppercase flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" /> Evidence Lock Verified Statement
              </span>
              <button
                onClick={() => setActiveEvidence(DEMO_EVIDENCE_LOCKS.claim1)}
                className="text-[#3D7BFF] hover:underline"
              >
                Inspect Source Evidence →
              </button>
            </div>
            <p className="font-sans text-sm text-[#0D1211] font-normal leading-normal">
              "{DEMO_EVIDENCE_LOCKS.claim1.claimText}"
            </p>
          </div>

          <p>
            During the 43rd Indian Scientific Expedition to Antarctica, drilling teams at Larsemann Hills extracted core sections from depths exceeding 1,200 meters. High-precision laser spectroscopy was used to measure stable water isotopes, giving climatologists a thermal baseline stretching back through glacial cycles.
          </p>

          {/* Evidence Lock Statement 2 */}
          <div className="p-4 rounded-xl bg-[#FAF9F5] border-l-4 border-[#3D7BFF] space-y-2 font-mono text-xs shadow-sm">
            <div className="flex items-center justify-between text-[#747A75]">
              <span className="text-[#3D7BFF] font-semibold uppercase flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#3D7BFF]" /> Evidence Lock Verified Statement
              </span>
              <button
                onClick={() => setActiveEvidence(DEMO_EVIDENCE_LOCKS.claim2)}
                className="text-[#3D7BFF] hover:underline"
              >
                Inspect Source Evidence →
              </button>
            </div>
            <p className="font-sans text-sm text-[#0D1211] font-normal leading-normal">
              "{DEMO_EVIDENCE_LOCKS.claim2.claimText}"
            </p>
          </div>

          <p>
            Understanding these baseline shifts is vital for calibrating current earth system models. As ocean temperatures rise, coastal Antarctic glaciers experience submarine melting, making historical firm compaction studies indispensable for sea-level projections.
          </p>
        </article>

        {/* Evidence Lock Modal Inspector Popup */}
        {activeEvidence && (
          <div className="p-6 rounded-2xl bg-[#0D1211] text-[#F4F2EC] space-y-4 font-mono text-xs shadow-2xl border border-[#B7FF5A]/40 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#747A75]/30 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B7FF5A]" />
                <span className="text-[#B7FF5A] font-semibold">Evidence Lock Inspection Modal</span>
              </div>
              <button onClick={() => setActiveEvidence(null)} className="text-[#747A75] hover:text-[#F4F2EC]">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[#747A75] text-[10px] uppercase block">Factual Sentence Claim:</span>
              <p className="font-sans text-sm text-[#F4F2EC] font-light leading-relaxed">"{activeEvidence.claimText}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#192220] border border-[#747A75]/20 text-[11px]">
              <div>
                <span className="text-[#747A75] block uppercase text-[10px]">Source Dataset</span>
                <span className="text-[#F4F2EC] font-semibold">{activeEvidence.datasetName}</span>
              </div>
              <div>
                <span className="text-[#747A75] block uppercase text-[10px]">Variable Name</span>
                <span className="text-[#3D7BFF]">{activeEvidence.variable}</span>
              </div>
              <div>
                <span className="text-[#747A75] block uppercase text-[10px]">Time Horizon</span>
                <span className="text-[#F4F2EC]">{activeEvidence.timeRange}</span>
              </div>
              <div>
                <span className="text-[#747A75] block uppercase text-[10px]">Verification DOI</span>
                <span className="text-[#B7FF5A]">{activeEvidence.doi}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <span className="text-emerald-400">Status: SUPPORTED & EDITOR VERIFIED (100%)</span>
              <Link
                href={`/datasets/${activeEvidence.datasetSlug}`}
                className="px-4 py-2 bg-[#B7FF5A] text-[#0D1211] rounded uppercase font-semibold hover:bg-lime-400 transition-colors inline-flex items-center gap-1"
              >
                <span>Inspect Raw Telemetry</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Connected Resources Grid */}
        <section className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-4 font-mono text-xs">
          <span className="text-[10px] text-[#747A75] uppercase tracking-widest block font-semibold">
            Connected Repository Entities
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 space-y-2">
              <span className="px-2 py-0.5 rounded bg-[#3D7BFF]/10 text-[#3D7BFF] uppercase text-[10px] font-semibold">Derived Dataset</span>
              <h4 className="font-serif text-lg text-[#0D1211] font-medium">Larsemann Hills Firn & Core Isotope Series</h4>
              <Link href="/datasets/larsemann-hills-boundary-met-2024" className="text-[#3D7BFF] hover:underline block pt-1">
                Open Dataset →
              </Link>
            </div>
            <div className="p-4 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 space-y-2">
              <span className="px-2 py-0.5 rounded bg-[#0D1211] text-[#B7FF5A] uppercase text-[10px] font-semibold">Peer-Reviewed Article</span>
              <h4 className="font-serif text-lg text-[#0D1211] font-medium">Deep Ice Core Isotope Stratigraphy in East Antarctica</h4>
              <Link href="/publications/deep-ice-core-isotope-stratigraphy-east-antarctica" className="text-[#3D7BFF] hover:underline block pt-1">
                Read Publication →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StoryDetailPage;
