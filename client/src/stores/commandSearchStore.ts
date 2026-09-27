import { create } from 'zustand';

interface CommandSearchState {
  isOpen: boolean;
  activeQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setQuery: (q: string) => void;
  // aliases
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCommandSearchStore = create<CommandSearchState>((set) => ({
  isOpen: false,
  activeQuery: '',

  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false, activeQuery: '' }),
  toggleSearch: () => set((state) => ({ isOpen: !state.isOpen })),
  setQuery: (q: string) => set({ activeQuery: q }),

  // Aliases for compatibility
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
