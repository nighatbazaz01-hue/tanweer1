"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppRole } from "@/store/useRoleStore";

export type UserRole =
  | "super_admin"
  | "school_admin"
  | "teacher"
  | "student"
  | "parent"
  | "accountant";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  appRole: AppRole;
  schoolId: string;
  schoolName: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  firstLoginComplete: boolean;
  setUser: (user: User, token: string) => void;
  setFirstLoginComplete: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      firstLoginComplete: false,
      setUser: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      setFirstLoginComplete: (value) =>
        set({ firstLoginComplete: value }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          firstLoginComplete: false,
        }),
    }),
    {
      name: "tanweer-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        firstLoginComplete: state.firstLoginComplete,
      }),
    }
  )
);
