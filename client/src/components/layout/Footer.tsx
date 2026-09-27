import React from 'react';
import { Link } from 'wouter';
import { Compass, Database, Globe2, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';

export const Footer: React.FC = () => {
  const { t } = useLanguageStore();

  return (
    <footer className="bg-[#0D1211] text-[#F4F2EC] pt-20 pb-12 border-t border-[#192220]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Massive Typographic Header */}
        <div className="pb-16 border-b border-[#192220]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#B7FF5A] uppercase block mb-3">
                Scientific Knowledge System
              </span>
              <h2 className="font-serif text-6xl sm:text-7xl lg:text-8xl tracking-tight text-[#F4F2EC] font-normal leading-none">
                ORUVIA
              </h2>
              <p className="text-[#747A75] text-lg sm:text-xl font-light mt-3 max-w-xl">
                Knowledge, alive. Unifying Earth observation, expedition archives, and living planetary data.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="px-5 py-2.5 rounded-full bg-[#F4F2EC] text-[#0D1211] text-xs font-mono uppercase tracking-wider hover:bg-[#B7FF5A] transition-colors"
              >
                Explore Knowledge
              </Link>
              <Link
                href="/ask"
                className="px-5 py-2.5 rounded-full bg-[#192220] border border-[#747A75]/30 text-[#F4F2EC] text-xs font-mono uppercase tracking-wider hover:border-[#B7FF5A] transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B7FF5A]" />
                Ask ORUVIA
              </Link>
            </div>
          </div>
        </div>

        {/* Multi-Column Links */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 border-b border-[#192220] text-sm">
          {/* Col 1: Discovery */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#747A75] mb-4">
              Discovery
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/explore" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Global Explorer</Link></li>
              <li><Link href="/datasets" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Scientific Datasets</Link></li>
              <li><Link href="/publications" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Research Publications</Link></li>
              <li><Link href="/expeditions" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Expedition Log</Link></li>
              <li><Link href="/media" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Media Archive</Link></li>
              <li><Link href="/activities" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Institutional Activities</Link></li>
            </ul>
          </div>

          {/* Col 2: Experience */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#747A75] mb-4">
              Experience
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/atlas" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Scientific Atlas</Link></li>
              <li><Link href="/timeline" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Expedition Timeline</Link></li>
              <li><Link href="/stories" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Editorial Stories</Link></li>
              <li><Link href="/stations" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Live Stations</Link></li>
              <li><Link href="/learn" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Learning Hub</Link></li>
              <li><Link href="/ask" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Ask ORUVIA (RAG)</Link></li>
            </ul>
          </div>

          {/* Col 3: Studio */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#747A75] mb-4">
              Institutional Studio
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/studio" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Studio Dashboard</Link></li>
              <li><Link href="/studio/content" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Content Studio</Link></li>
              <li><Link href="/studio/upload" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Contributor Upload</Link></li>
              <li><Link href="/studio/review" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Evidence Lock Review</Link></li>
              <li><Link href="/studio/calendar" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Publishing Calendar</Link></li>
              <li><Link href="/studio/analytics" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Knowledge Outreach Metrics</Link></li>
            </ul>
          </div>

          {/* Col 4: Data Governance */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#747A75] mb-4">
              Governance & Standards
            </h4>
            <ul className="space-y-2.5 text-xs text-[#747A75]">
              <li className="flex items-center gap-1.5 text-[#F4F2EC]/80">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B7FF5A]" /> FAIR Data Compliance
              </li>
              <li>DataCite Schema 4.4</li>
              <li>ISO 19115 Geospatial Standard</li>
              <li>Schema.org JSON-LD Linked Data</li>
              <li>Open Science CC-BY-4.0</li>
              <li>Evidence Lock Citation Provenance</li>
            </ul>
          </div>

          {/* Col 5: System & API */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#747A75] mb-4">
              Developer & API
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#3D7BFF] hover:underline"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  REST API Health
                </a>
              </li>
              <li><Link href="/about" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Methodology & About</Link></li>
              <li><Link href="/login" className="text-[#F4F2EC]/80 hover:text-[#B7FF5A] transition-colors">Institutional Login</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#747A75]">
          <p>© 2026 ORUVIA. Standalone Scientific Knowledge & Outreach Architecture.</p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B7FF5A] animate-pulse" />
              <span>SYSTEMS CONNECTED</span>
            </span>
            <Link href="/about" className="hover:text-[#F4F2EC]">Accessibility (WCAG 2.2 AA)</Link>
            <Link href="/about" className="hover:text-[#F4F2EC]">Privacy & Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
