import { create } from 'zustand';

export type SupportedLanguage = 'en' | 'hi';

interface LanguageState {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    'brand.tagline': 'Knowledge, alive.',
    'nav.discover': 'Discover',
    'nav.explore': 'Explore',
    'nav.expeditions': 'Expeditions',
    'nav.research': 'Research',
    'nav.datasets': 'Datasets',
    'nav.publications': 'Publications',
    'nav.media': 'Media Archive',
    'nav.activities': 'Activities',
    'nav.experience': 'Experience',
    'nav.atlas': 'Atlas',
    'nav.timeline': 'Timeline',
    'nav.stories': 'Stories',
    'nav.stations': 'Live Stations',
    'nav.learn': 'Learning Hub',
    'nav.ask': 'Ask ORUVIA',
    'nav.about': 'About',
    'nav.studio': 'Institutional Studio',
    'nav.signin': 'Sign In',
    'nav.signout': 'Sign Out',
    'nav.litemode': 'Lite Mode',
    'hero.title': 'Knowledge, alive.',
    'hero.subtitle': 'Discover the expeditions, observations, people and discoveries shaping our understanding of Earth’s most extraordinary environments.',
    'hero.cta.explore': 'Explore knowledge',
    'hero.cta.ask': 'Ask ORUVIA',
    'search.placeholder': 'Search datasets, expeditions, publications, stations...',
    'search.cmdK': 'Search (⌘K)',
    'evidence.supported': 'SUPPORTED',
    'evidence.editorVerified': 'EDITOR VERIFIED',
    'evidence.editorial': 'EDITORIAL',
    'evidence.unverified': 'UNVERIFIED',
    'evidence.locked': 'LOCKED FOR APPROVAL',
    'common.download': 'Download Dataset',
    'common.citation': 'Cite Resource',
    'common.demoData': 'DEMO TELEMETRY',
    'common.demoRecord': 'Demo Record',
  },
  hi: {
    'brand.tagline': 'ज्ञान, सजीव।',
    'nav.discover': 'खोजें',
    'nav.explore': 'अन्वेषण',
    'nav.expeditions': 'अभियान',
    'nav.research': 'अनुसंधान',
    'nav.datasets': 'डेटासेट',
    'nav.publications': 'प्रकाशन',
    'nav.media': 'मीडिया संग्रह',
    'nav.activities': 'गतिविधियाँ',
    'nav.experience': 'अनुभव',
    'nav.atlas': 'मानचित्र (Atlas)',
    'nav.timeline': 'समयरेखा (Timeline)',
    'nav.stories': 'कहानियाँ',
    'nav.stations': 'लाइव स्टेशन',
    'nav.learn': 'लर्निंग हब',
    'nav.ask': 'ORUVIA से पूछें',
    'nav.about': 'परिचय',
    'nav.studio': 'संस्थागत स्टूडियो',
    'nav.signin': 'साइन इन',
    'nav.signout': 'साइन आउट',
    'nav.litemode': 'लाइट मोड',
    'hero.title': 'ज्ञान, सजीव।',
    'hero.subtitle': 'पृथ्वी के सबसे असाधारण पर्यावरण को समझने वाले अभियानों, वैज्ञानिक अवलोकनों, शोधकर्ताओं और खोजों का अन्वेषण करें।',
    'hero.cta.explore': 'ज्ञान का अन्वेषण करें',
    'hero.cta.ask': 'ORUVIA से पूछें',
    'search.placeholder': 'डेटासेट, अभियान, प्रकाशन, स्टेशन खोजें...',
    'search.cmdK': 'खोजें (⌘K)',
    'evidence.supported': 'सत्यापित साक्ष्य',
    'evidence.editorVerified': 'संपादक द्वारा सत्यापित',
    'evidence.editorial': 'संपादकीय कथन',
    'evidence.unverified': 'अपुष्ट / असत्यापित',
    'evidence.locked': 'स्वीकृति हेतु अवरुद्ध',
    'common.download': 'डेटासेट डाउनलोड करें',
    'common.citation': 'उद्धरण प्राप्त करें',
    'common.demoData': 'डेमो टेलीमेट्री',
    'common.demoRecord': 'डेमो रिकॉर्ड',
  },
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: (localStorage.getItem('oruvia_lang') as SupportedLanguage) || 'en',
  setLanguage: (lang) => {
    localStorage.setItem('oruvia_lang', lang);
    set({ language: lang });
  },
  t: (key) => {
    const lang = get().language;
    return translations[lang]?.[key] || translations.en[key] || key;
  },
}));
