import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Search,
  ChevronDown,
  Sparkles,
  Zap,
  Globe,
  User as UserIcon,
  Menu,
  LayoutDashboard,
} from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { MobileDrawer } from './MobileDrawer';
import { useLanguageStore } from '../../stores/languageStore';
import { useAuthStore } from '../../stores/authStore';
import { useLiteModeStore } from '../../stores/liteModeStore';
import { useCommandSearchStore } from '../../stores/commandSearchStore';

export const Navbar: React.FC = () => {
  const [activeMegaMenu, setActiveMegaMenu] = useState<'discover' | 'experience' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  const { language, setLanguage, t } = useLanguageStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isLiteMode, toggleLiteMode } = useLiteModeStore();
  const { openSearch } = useCommandSearchStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mega menu on route change
  useEffect(() => {
    setActiveMegaMenu(null);
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F4F2EC]/90 backdrop-blur-md border-b border-[#0D1211]/10 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-[#0D1211] flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-2.5 h-2.5 rounded-full bg-[#B7FF5A]" />
            </div>
            <div>
              <span className="font-serif text-2xl tracking-wider font-semibold text-[#0D1211] block leading-none">
                ORUVIA
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#747A75] uppercase block mt-0.5">
                {t('brand.tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
            {/* Discover */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMegaMenu('discover')}
            >
              <button
                onClick={() => setActiveMegaMenu(activeMegaMenu === 'discover' ? null : 'discover')}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-2 ${
                  activeMegaMenu === 'discover' ? 'text-[#0D1211]' : 'text-[#747A75] hover:text-[#0D1211]'
                }`}
                aria-expanded={activeMegaMenu === 'discover'}
              >
                {t('nav.discover')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMegaMenu === 'discover' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Experience */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMegaMenu('experience')}
            >
              <button
                onClick={() => setActiveMegaMenu(activeMegaMenu === 'experience' ? null : 'experience')}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-2 ${
                  activeMegaMenu === 'experience' ? 'text-[#0D1211]' : 'text-[#747A75] hover:text-[#0D1211]'
                }`}
                aria-expanded={activeMegaMenu === 'experience'}
              >
                {t('nav.experience')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMegaMenu === 'experience' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Ask ORUVIA */}
            <Link
              href="/ask"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase rounded-full bg-[#0D1211]/5 hover:bg-[#B7FF5A]/30 text-[#0D1211] transition-all border border-[#0D1211]/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3D7BFF]" />
              {t('nav.ask')}
            </Link>

            {/* About */}
            <Link
              href="/about"
              className="text-sm font-medium text-[#747A75] hover:text-[#0D1211] transition-colors"
            >
              {t('nav.about')}
            </Link>
          </nav>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-4">
            {/* Search CMD+K button */}
            <button
              onClick={() => openSearch()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-[#0D1211]/15 text-xs text-[#747A75] hover:border-[#0D1211] hover:text-[#0D1211] transition-all shadow-sm"
              title="Search repository (CMD+K / Ctrl+K)"
              aria-label="Open command search"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t('search.cmdK')}</span>
            </button>

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center bg-[#FAF9F5] border border-[#0D1211]/15 rounded-full p-0.5 text-[11px] font-mono">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  language === 'en' ? 'bg-[#0D1211] text-[#F4F2EC]' : 'text-[#747A75] hover:text-[#0D1211]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  language === 'hi' ? 'bg-[#0D1211] text-[#F4F2EC]' : 'text-[#747A75] hover:text-[#0D1211]'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Lite Mode Toggle */}
            <button
              onClick={toggleLiteMode}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
                isLiteMode
                  ? 'bg-[#B7FF5A] text-[#0D1211] border-[#B7FF5A]'
                  : 'bg-transparent text-[#747A75] border-[#0D1211]/15 hover:text-[#0D1211]'
              }`}
              title="Low-bandwidth lite mode"
            >
              <Zap className="w-3 h-3" />
              <span className="text-[10px]">{isLiteMode ? 'LITE ON' : 'LITE'}</span>
            </button>

            {/* Auth / Studio Entry */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/studio"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0D1211] text-[#F4F2EC] text-xs font-mono uppercase tracking-wider hover:bg-[#192220] transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#B7FF5A]" />
                  <span>Studio</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-xs text-[#747A75] hover:text-[#0D1211] font-mono px-2 py-1"
                  title="Sign out"
                >
                  Exit
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0D1211] text-[#F4F2EC] text-xs font-mono uppercase tracking-wider hover:bg-[#192220] transition-colors shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t('nav.signin')}</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#0D1211] hover:bg-[#0D1211]/5 rounded-lg"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Overlay */}
        {activeMegaMenu && (
          <MegaMenu
            type={activeMegaMenu}
            onClose={() => setActiveMegaMenu(null)}
          />
        )}
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};
