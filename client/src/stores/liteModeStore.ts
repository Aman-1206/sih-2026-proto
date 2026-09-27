import { create } from 'zustand';

interface LiteModeState {
  isLiteMode: boolean;
  toggleLiteMode: () => void;
  setLiteMode: (enabled: boolean) => void;
}

export const useLiteModeStore = create<LiteModeState>((set) => ({
  isLiteMode: localStorage.getItem('oruvia_lite_mode') === 'true',
  toggleLiteMode: () => {
    set((state) => {
      const next = !state.isLiteMode;
      localStorage.setItem('oruvia_lite_mode', String(next));
      if (next) {
        document.documentElement.classList.add('lite-mode');
      } else {
        document.documentElement.classList.remove('lite-mode');
      }
      return { isLiteMode: next };
    });
  },
  setLiteMode: (enabled) => {
    localStorage.setItem('oruvia_lite_mode', String(enabled));
    if (enabled) {
      document.documentElement.classList.add('lite-mode');
    } else {
      document.documentElement.classList.remove('lite-mode');
    }
    set({ isLiteMode: enabled });
  },
}));

interface CommandSearchState {
  isOpen: boolean;
  activeQuery: string;
  openSearch: (initialQuery?: string) => void;
  closeSearch: () => void;
  setQuery: (q: string) => void;
}

export const useCommandSearchStore = create<CommandSearchState>((set) => ({
  isOpen: false,
  activeQuery: '',
  openSearch: (initialQuery = '') => set({ isOpen: true, activeQuery: initialQuery }),
  closeSearch: () => set({ isOpen: false, activeQuery: '' }),
  setQuery: (q) => set({ activeQuery: q }),
}));
