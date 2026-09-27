import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  Database,
  FileText,
  Image as ImageIcon,
  Activity as ActivityIcon,
  Globe2,
  Clock,
  BookOpen,
  Radio,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';

interface MegaMenuProps {
  type: 'discover' | 'experience';
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ type, onClose }) => {
  const { t } = useLanguageStore();

  if (type === 'discover') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 w-full bg-[#FAF9F5] border-b border-[#0D1211]/10 shadow-xl py-8 px-8 z-40"
        onMouseLeave={onClose}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-3 border-r border-[#0D1211]/10 pr-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75]">
              Information System
            </span>
            <h3 className="font-serif text-2xl mt-1 mb-2">Connected Knowledge</h3>
            <p className="text-xs text-[#747A75] leading-relaxed">
              Explore primary datasets, peer-reviewed articles, field expeditions, and institutional activities unified across Earth observation disciplines.
            </p>
            <div className="mt-4 pt-4 border-t border-[#0D1211]/10">
              <Link
                href="/explore"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0D1211] hover:text-[#3D7BFF] transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                Explore Global Repository →
              </Link>
            </div>
          </div>

          <div className="col-span-9 grid grid-cols-3 gap-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#747A75] block mb-3">
                Field Operations
              </span>
              <div className="space-y-3">
                <Link
                  href="/expeditions"
                  onClick={onClose}
                  className="group flex items-start gap-3 p-2 rounded hover:bg-[#F4F2EC] transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#747A75] group-hover:text-[#0D1211] mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-[#0D1211] block group-hover:text-[#3D7BFF]">
                      Expeditions
                    </span>
                    <span className="text-xs text-[#747A75]">Routes, vessel logs and polar campaigns</span>
                  </div>
                </Link>
                <Link
                  href="/activities"
                  onClick={onClose}
                  className="group flex items-start gap-3 p-2 rounded hover:bg-[#F4F2EC] transition-colors"
                >
                  <ActivityIcon className="w-4 h-4 text-[#747A75] group-hover:text-[#0D1211] mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-[#0D1211] block group-hover:text-[#3D7BFF]">
                      Institutional Activities
                    </span>
                    <span className="text-xs text-[#747A75]">Symposia, fieldwork, and workshops</span>
                  </div>
                </Link>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#747A75] block mb-3">
                Scientific Records
              </span>
              <div className="space-y-3">
                <Link
                  href="/datasets"
                  onClick={onClose}
                  className="group flex items-start gap-3 p-2 rounded hover:bg-[#F4F2EC] transition-colors"
                >
                  <Database className="w-4 h-4 text-[#747A75] group-hover:text-[#0D1211] mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-[#0D1211] block group-hover:text-[#3D7BFF]">
                      Datasets
                    </span>
                    <span className="text-xs text-[#747A75]">FAIR telemetry, sensor matrices & CSVs</span>
                  </div>
                </Link>
                <Link
                  href="/publications"
                  onClick={onClose}
                  className="group flex items-start gap-3 p-2 rounded hover:bg-[#F4F2EC] transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#747A75] group-hover:text-[#0D1211] mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-[#0D1211] block group-hover:text-[#3D7BFF]">
                      Publications
                    </span>
                    <span className="text-xs text-[#747A75]">Peer-reviewed journals with DOIs</span>
                  </div>
                </Link>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#747A75] block mb-3">
                Visual Archive
              </span>
              <div className="space-y-3">
                <Link
                  href="/media"
                  onClick={onClose}
                  className="group flex items-start gap-3 p-2 rounded hover:bg-[#F4F2EC] transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-[#747A75] group-hover:text-[#0D1211] mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-[#0D1211] block group-hover:text-[#3D7BFF]">
                      Media Archive
                    </span>
                    <span className="text-xs text-[#747A75]">Calibrated photography, videos & graphics</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Experience Mega Menu
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 w-full bg-[#FAF9F5] border-b border-[#0D1211]/10 shadow-xl py-8 px-8 z-40"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        <div className="col-span-3 border-r border-[#0D1211]/10 pr-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75]">
            Interactive Systems
          </span>
          <h3 className="font-serif text-2xl mt-1 mb-2">Living Experience</h3>
          <p className="text-xs text-[#747A75] leading-relaxed">
            Immerse yourself in geospatial atlas layers, deep historical timelines, live station observations, and editorial science stories.
          </p>
        </div>

        <div className="col-span-9 grid grid-cols-3 gap-6">
          <div className="space-y-3">
            <Link
              href="/atlas"
              onClick={onClose}
              className="group flex items-start gap-3 p-2 rounded hover:bg-[#F4F2EC] transition-colors"
            >
              <Globe2 className="w-4 h-4 text-[#747A75] group-hover:text-[#0D1211] mt-0.5" />
              <div>
                <span className="text-sm font-medium text-[#0D1211] block group-hover:text-[#3D7BFF]">
                  Scientific Atlas
                </span>
                <span className="text-xs text-[#747A75]">MapLibre geospatial exploration & layer stacks</span>
              </div>
            </Link>
            <Link
              href="/timeline"
              onClick={onClose}
              className="group flex items-start gap-3 p-2 rounded hover:bg-[#F4F2EC] transition-colors"
            >
              <Clock className="w-4 h-4 text-[#747A75] group-hover:text-[#0D1211] mt-0.5" />
              <div>
                <span className="text-sm font-medium text-[#0D1211] block group-hover:text-[#3D7BFF]">
                  Expedition Timeline
                </span>
                <span className="text-xs text-[#747A75]">Archival timeline across multi-decadal missions</span>
              </div>
            </Link>
          </div>

          <div className="space-y-3">
            <Link
              href="/stories"
              onClick={onClose}
              className="group flex items-start gap-3 p-2 rounded hover:bg-[#F4F2EC] transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#747A75] group-hover:text-[#0D1211] mt-0.5" />
              <div>
                <span className="text-sm font-medium text-[#0D1211] block group-hover:text-[#3D7BFF]">
                  Editorial Stories
                </span>
                <span className="text-xs text-[#747A75]">Multi-level narratives with reading level switches</span>
              </div>
            </Link>
            <Link
              href="/stations"
              onClick={onClose}
              className="group flex items-start gap-3 p-2 rounded hover:bg-[#F4F2EC] transition-colors"
            >
              <Radio className="w-4 h-4 text-[#747A75] group-hover:text-[#0D1211] mt-0.5" />
              <div>
                <span className="text-sm font-medium text-[#0D1211] block group-hover:text-[#3D7BFF]">
                  Live Stations
                </span>
                <span className="text-xs text-[#747A75]">Real-time and demo telemetry from polar posts</span>
              </div>
            </Link>
          </div>

          <div className="space-y-3">
            <Link
              href="/learn"
              onClick={onClose}
              className="group flex items-start gap-3 p-2 rounded hover:bg-[#F4F2EC] transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-[#747A75] group-hover:text-[#0D1211] mt-0.5" />
              <div>
                <span className="text-sm font-medium text-[#0D1211] block group-hover:text-[#3D7BFF]">
                  Learning Hub
                </span>
                <span className="text-xs text-[#747A75]">Interactive explainers, quizzes & visual glossary</span>
              </div>
            </Link>
            <Link
              href="/ask"
              onClick={onClose}
              className="group flex items-start gap-3 p-2 rounded hover:bg-[#F4F2EC] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#747A75] group-hover:text-[#0D1211] mt-0.5" />
              <div>
                <span className="text-sm font-medium text-[#0D1211] block group-hover:text-[#3D7BFF]">
                  Ask ORUVIA
                </span>
                <span className="text-xs text-[#747A75]">Evidence-grounded RAG research assistant</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
