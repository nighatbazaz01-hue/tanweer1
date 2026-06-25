"use client";
import { create } from "zustand";
import type { MbsMode } from "@/lib/aiSuggestions";

interface UIState {
  sidebarCollapsed: boolean;
  aiDrawerOpen: boolean;
  pendingPrompt: string | null;
  pendingMbsMode: MbsMode | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleAiDrawer: () => void;
  setAiDrawerOpen: (open: boolean) => void;
  openAIDrawer: () => void;
  setAIPrompt: (prompt: string) => void;
  setAIPromptWithMode: (prompt: string, mode: MbsMode) => void;
  clearPendingPrompt: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  aiDrawerOpen: false,
  pendingPrompt: null,
  pendingMbsMode: null,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleAiDrawer: () =>
    set((state) => ({ aiDrawerOpen: !state.aiDrawerOpen })),
  setAiDrawerOpen: (open) => set({ aiDrawerOpen: open }),
  openAIDrawer: () => set({ aiDrawerOpen: true }),
  setAIPrompt: (prompt) => set({ pendingPrompt: prompt, pendingMbsMode: null, aiDrawerOpen: true }),
  setAIPromptWithMode: (prompt, mode) => set({ pendingPrompt: prompt, pendingMbsMode: mode, aiDrawerOpen: true }),
  clearPendingPrompt: () => set({ pendingPrompt: null, pendingMbsMode: null }),
}));
