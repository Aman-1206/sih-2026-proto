import React from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Compass,
  MapPin,
  Database,
  FileText,
  Image as ImageIcon,
  Globe2,
  Clock,
  BookOpen,
  Radio,
  GraduationCap,
  Sparkles,
  LogIn,
  LayoutDashboard,
  Zap,
} from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';
import { useAuthStore } from '../../stores/authStore';
import { useLiteModeStore } from '../../stores/liteModeStore';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { t, language, setLanguage } = useLanguageStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isLiteMode, toggleLiteMode } = useLiteModeStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0D1211]/60 backdrop-blur-sm z-50 lg:hidden"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-[#FAF9F5] border-l border-[#0D1211]/10 p-6 z-50 overflow-y-auto flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#0D1211]/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0D1211] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#B7FF5A]" />
                  </div>
                  <span className="font-serif text-xl tracking-wider">ORUVIA</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-[#747A75] hover:text-[#0D1211] rounded-full hover:bg-[#F4F2EC]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] block mb-2">
                    Discover
                  </span>
                  <div className="space-y-1">
                    <Link href="/explore" onClick={onClose} className="flex items-center gap-3 p-2 text-sm text-[#0D1211] hover:bg-[#F4F2EC] rounded">
                      <Compass className="w-4 h-4 text-[#747A75]" /> Explore
                    </Link>
                    <Link href="/datasets" onClick={onClose} className="flex items-center gap-3 p-2 text-sm text-[#0D1211] hover:bg-[#F4F2EC] rounded">
                      <Database className="w-4 h-4 text-[#747A75]" /> Datasets
                    </Link>
                    <Link href="/publications" onClick={onClose} className="flex items-center gap-3 p-2 text-sm text-[#0D1211] hover:bg-[#F4F2EC] rounded">
                      <FileText className="w-4 h-4 text-[#747A75]" /> Publications
                    </Link>
                    <Link href="/expeditions" onClick={onClose} className="flex items-center gap-3 p-2 text-sm text-[#0D1211] hover:bg-[#F4F2EC] rounded">
                      <MapPin className="w-4 h-4 text-[#747A75]" /> Expeditions
                    </Link>
                    <Link href="/media" onClick={onClose} className="flex items-center gap-3 p-2 text-sm text-[#0D1211] hover:bg-[#F4F2EC] rounded">
                      <ImageIcon className="w-4 h-4 text-[#747A75]" /> Media Archive
                    </Link>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] block mb-2">
                    Experience
                  </span>
                  <div className="space-y-1">
                    <Link href="/atlas" onClick={onClose} className="flex items-center gap-3 p-2 text-sm text-[#0D1211] hover:bg-[#F4F2EC] rounded">
                      <Globe2 className="w-4 h-4 text-[#747A75]" /> Scientific Atlas
                    </Link>
                    <Link href="/timeline" onClick={onClose} className="flex items-center gap-3 p-2 text-sm text-[#0D1211] hover:bg-[#F4F2EC] rounded">
                      <Clock className="w-4 h-4 text-[#747A75]" /> Timeline
                    </Link>
                    <Link href="/stories" onClick={onClose} className="flex items-center gap-3 p-2 text-sm text-[#0D1211] hover:bg-[#F4F2EC] rounded">
                      <BookOpen className="w-4 h-4 text-[#747A75]" /> Stories
                    </Link>
                    <Link href="/stations" onClick={onClose} className="flex items-center gap-3 p-2 text-sm text-[#0D1211] hover:bg-[#F4F2EC] rounded">
                      <Radio className="w-4 h-4 text-[#747A75]" /> Live Stations
                    </Link>
                    <Link href="/learn" onClick={onClose} className="flex items-center gap-3 p-2 text-sm text-[#0D1211] hover:bg-[#F4F2EC] rounded">
                      <GraduationCap className="w-4 h-4 text-[#747A75]" /> Learning Hub
                    </Link>
                    <Link href="/ask" onClick={onClose} className="flex items-center gap-3 p-2 text-sm text-[#0D1211] hover:bg-[#F4F2EC] rounded bg-[#B7FF5A]/20">
                      <Sparkles className="w-4 h-4 text-[#0D1211]" /> Ask ORUVIA
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#0D1211]/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#747A75]">
                <span>Language</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 rounded font-mono text-xs ${language === 'en' ? 'bg-[#0D1211] text-[#F4F2EC]' : 'bg-[#EBE8DF]'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`px-2 py-1 rounded font-mono text-xs ${language === 'hi' ? 'bg-[#0D1211] text-[#F4F2EC]' : 'bg-[#EBE8DF]'}`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#747A75]">
                <span>Lite Mode</span>
                <button
                  onClick={toggleLiteMode}
                  className={`px-2 py-1 rounded font-mono text-xs flex items-center gap-1 ${isLiteMode ? 'bg-[#B7FF5A] text-[#0D1211]' : 'bg-[#EBE8DF]'}`}
                >
                  <Zap className="w-3 h-3" /> {isLiteMode ? 'ON' : 'OFF'}
                </button>
              </div>

              {isAuthenticated ? (
                <div className="pt-2 space-y-2">
                  <Link
                    href="/studio"
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono uppercase bg-[#0D1211] text-[#F4F2EC] rounded"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" /> Institutional Studio
                  </Link>
                  <button
                    onClick={() => { logout(); onClose(); }}
                    className="w-full py-2 text-xs font-mono text-[#747A75] hover:text-[#0D1211]"
                  >
                    Sign Out ({user?.name?.split(' ')[0]})
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono uppercase bg-[#0D1211] text-[#F4F2EC] rounded"
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign In
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
