import { create } from "zustand";

/**
 * Store UI client (Zustand) — exemple minimal qui valide l'intégration.
 * À enrichir au fil des features (ex. état d'une sidebar, modales, filtres).
 */
type UiState = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
