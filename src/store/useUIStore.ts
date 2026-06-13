"use client";
import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  aiDrawerOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleAiDrawer: () => void;
  setAiDrawerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  aiDrawerOpen: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleAiDrawer: () =>
    set((state) => ({ aiDrawerOpen: !state.aiDrawerOpen })),
  setAiDrawerOpen: (open) => set({ aiDrawerOpen: open }),
}));
