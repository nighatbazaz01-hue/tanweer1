"use client";
import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  aiDrawerOpen: boolean;
  pendingPrompt: string | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleAiDrawer: () => void;
  setAiDrawerOpen: (open: boolean) => void;
  openAIDrawer: () => void;
  setAIPrompt: (prompt: string) => void;
  clearPendingPrompt: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  aiDrawerOpen: false,
  pendingPrompt: null,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleAiDrawer: () =>
    set((state) => ({ aiDrawerOpen: !state.aiDrawerOpen })),
  setAiDrawerOpen: (open) => set({ aiDrawerOpen: open }),
  openAIDrawer: () => set({ aiDrawerOpen: true }),
  setAIPrompt: (prompt) => set({ pendingPrompt: prompt, aiDrawerOpen: true }),
  clearPendingPrompt: () => set({ pendingPrompt: null }),
}));
