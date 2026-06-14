/**
 * PIN Security Store — Tanweer Platform
 *
 * Session-level secondary authentication for sensitive data access.
 * Admin/VP roles must enter a role-specific PIN to unlock protected fields.
 * PIN state is NOT persisted — clears on page refresh / logout.
 */

import { create } from "zustand";

export interface PinAccessEntry {
  id: string;
  timestamp: string;
  role: string;
  actor: string;
  success: boolean;
  field: string;
}

let entryCounter = 0;

interface PinState {
  unlocked: boolean;
  failCount: number;
  accessLog: PinAccessEntry[];

  unlock: (enteredPin: string, correctPin: string, role: string, actor: string, field: string) => boolean;
  lock: () => void;
  resetFailCount: () => void;
}

export const usePinStore = create<PinState>((set, get) => ({
  unlocked: false,
  failCount: 0,
  accessLog: [],

  unlock: (enteredPin, correctPin, role, actor, field) => {
    const success = enteredPin === correctPin;
    const entry: PinAccessEntry = {
      id: `PIN-${++entryCounter}`,
      timestamp: new Date().toISOString(),
      role,
      actor,
      success,
      field,
    };
    set((state) => ({
      unlocked: success ? true : state.unlocked,
      failCount: success ? 0 : state.failCount + 1,
      accessLog: [entry, ...state.accessLog].slice(0, 50),
    }));
    return success;
  },

  lock: () => set({ unlocked: false }),

  resetFailCount: () => set({ failCount: 0 }),
}));
