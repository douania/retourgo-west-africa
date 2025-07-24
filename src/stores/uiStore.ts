import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  theme: 'light' | 'dark';
  language: 'fr' | 'wo' | 'en';
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'fr' | 'wo' | 'en') => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  mobileMenuOpen: false,
  theme: 'light',
  language: 'fr',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));