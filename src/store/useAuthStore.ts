"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  schoolId: string;
  schoolName: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setUser: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: "tanweer-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
