"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppRole = "admin" | "vp1" | "vp2" | "vp3" | "teacher" | "parent" | "student";

export const roleConfig: Record<AppRole, { label: string; color: string; bg: string; emoji: string; description: string }> = {
  admin: { label: "Principal / Admin", color: "text-violet-700", bg: "bg-violet-100", emoji: "🏫", description: "Foundation School Humhama" },
  vp1: { label: "VP Grades 1–4", color: "text-indigo-700", bg: "bg-indigo-100", emoji: "📚", description: "Lower Primary Division" },
  vp2: { label: "VP Grades 5–8", color: "text-sky-700", bg: "bg-sky-100", emoji: "📖", description: "Upper Primary Division" },
  vp3: { label: "VP Grades 9–12", color: "text-teal-700", bg: "bg-teal-100", emoji: "🎓", description: "Secondary Division" },
  teacher: { label: "Class Teacher", color: "text-blue-700", bg: "bg-blue-100", emoji: "👨‍🏫", description: "Grade 10-A · Mathematics" },
  parent: { label: "Parent / Guardian", color: "text-green-700", bg: "bg-green-100", emoji: "👨‍👩‍👧", description: "Aarav Sharma's Parent" },
  student: { label: "Student", color: "text-amber-700", bg: "bg-amber-100", emoji: "🎒", description: "Grade 10-A · STU-2024-001" },
};

interface RoleState {
  activeRole: AppRole;
  setRole: (role: AppRole) => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      activeRole: "admin",
      setRole: (role) => set({ activeRole: role }),
    }),
    { name: "tanweer-role" }
  )
);
