"use client";
/**
 * WelcomePanel — demo orientation panel
 *
 * - Appears on each role's home dashboard on every fresh page load
 * - Dismissed state is in-memory only (resets on refresh — ideal for demo)
 * - Renders null on non-home routes and after dismissal
 * - Zero impact on data layer, permissions, or event system
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X, ArrowRight,
  Users, ClipboardList, DollarSign, BookOpen,
  MessageSquare, BookMarked, Award, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoleStore, type AppRole } from "@/store/useRoleStore";
import { cn } from "@/lib/utils";

// ─── Routes that show the welcome panel ───────────────────────────────────────
const HOME_ROUTES: Partial<Record<AppRole, string>> = {
  admin:   "/admin",
  vp1:     "/vp",
  vp2:     "/vp",
  vp3:     "/vp",
  teacher: "/teacher",
  parent:  "/parent",
  student: "/student-view",
};

// ─── Per-role welcome content ─────────────────────────────────────────────────
interface QuickStep {
  step:  number;
  label: string;
  href:  string;
  desc:  string;
  icon:  React.ElementType;
}

interface WelcomeConfig {
  title:         string;
  subtitle:      string;
  gradientFrom:  string;
  gradientTo:    string;
  steps:         QuickStep[];
}

const WELCOME: Record<AppRole, WelcomeConfig> = {
  admin: {
    title:        "Welcome, Principal — here is your school overview",
    subtitle:     "Follow the guided flow below to explore Tanweer's core modules in the recommended order.",
    gradientFrom: "from-violet-600",
    gradientTo:   "to-indigo-600",
    steps: [
      { step: 1, label: "Student Records",  href: "/students",   desc: "600 enrolled students, searchable by grade or section", icon: Users },
      { step: 2, label: "Daily Attendance", href: "/attendance", desc: "School-wide view — 94.3% rate today",                   icon: ClipboardList },
      { step: 3, label: "Fee Collection",   href: "/fees",       desc: "87.5% collected · ₹1.87M this term",                   icon: DollarSign },
    ],
  },
  vp1: {
    title:        "Welcome, Vice Principal — Grades 1–4",
    subtitle:     "Your scope is the lower primary division. Start with your students, then check attendance.",
    gradientFrom: "from-indigo-600",
    gradientTo:   "to-sky-600",
    steps: [
      { step: 1, label: "My Students",   href: "/directory/students", desc: "Filtered to grades 1–4 only",       icon: Users },
      { step: 2, label: "Attendance",    href: "/attendance",          desc: "Daily presence for your division",  icon: ClipboardList },
      { step: 3, label: "Announcements", href: "/announcements",       desc: "Post or review division notices",   icon: BookOpen },
    ],
  },
  vp2: {
    title:        "Welcome, Vice Principal — Grades 5–8",
    subtitle:     "Your scope is the upper primary division. Start with your students, then check attendance.",
    gradientFrom: "from-sky-600",
    gradientTo:   "to-teal-600",
    steps: [
      { step: 1, label: "My Students",   href: "/directory/students", desc: "Filtered to grades 5–8 only",       icon: Users },
      { step: 2, label: "Attendance",    href: "/attendance",          desc: "Daily presence for your division",  icon: ClipboardList },
      { step: 3, label: "Announcements", href: "/announcements",       desc: "Post or review division notices",   icon: BookOpen },
    ],
  },
  vp3: {
    title:        "Welcome, Vice Principal — Grades 9–12",
    subtitle:     "Your scope is the secondary division. Start with your students, then check attendance.",
    gradientFrom: "from-teal-600",
    gradientTo:   "to-emerald-600",
    steps: [
      { step: 1, label: "My Students",   href: "/directory/students", desc: "Filtered to grades 9–12 only",       icon: Users },
      { step: 2, label: "Attendance",    href: "/attendance",          desc: "Daily presence for your division",   icon: ClipboardList },
      { step: 3, label: "Announcements", href: "/announcements",       desc: "Post or review division notices",    icon: BookOpen },
    ],
  },
  teacher: {
    title:        "Good morning, Dr. Sarah — your Grade 10-A dashboard",
    subtitle:     "You have 4 classes today. Here are your three most important actions to start the day.",
    gradientFrom: "from-blue-600",
    gradientTo:   "to-sky-500",
    steps: [
      { step: 1, label: "Today's Classes",  href: "/teacher/classes",    desc: "4 sessions scheduled · 1 ongoing",         icon: BookOpen },
      { step: 2, label: "Mark Attendance",  href: "/teacher/attendance", desc: "Grade 10-A · 32 students",                 icon: ClipboardList },
      { step: 3, label: "Homework Tracker", href: "/teacher/homework",   desc: "3 active assignments · 2 due this week",   icon: BookMarked },
    ],
  },
  parent: {
    title:        "Welcome — here is Ahmed's academic overview",
    subtitle:     "Everything about your child's school journey in one place. Start with the most important areas.",
    gradientFrom: "from-emerald-600",
    gradientTo:   "to-teal-500",
    steps: [
      { step: 1, label: "Attendance",       href: "/parent/attendance", desc: "94.3% this term · 12-day streak 🔥",  icon: ClipboardList },
      { step: 2, label: "Academic Marks",   href: "/parent/marks",      desc: "GPA 3.4 · Grade B+ overall",          icon: Award },
      { step: 3, label: "Message Teachers", href: "/messages",          desc: "12 unread · contact any teacher",     icon: MessageSquare },
    ],
  },
  student: {
    title:        "Hey Ahmed, here's what needs your attention today 👋",
    subtitle:     "Your personalised study dashboard. Tackle these three things first.",
    gradientFrom: "from-amber-500",
    gradientTo:   "to-orange-500",
    steps: [
      { step: 1, label: "Homework",       href: "/student-view/homework", desc: "2 assignments pending — don't forget!",   icon: BookMarked },
      { step: 2, label: "Upcoming Exams", href: "/student-view/exams",    desc: "4 exams coming · next Jun 20",             icon: Award },
      { step: 3, label: "AI Study Helper",href: "/ai-insights",           desc: "Get personalised study tips from AI",      icon: Sparkles },
    ],
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export function WelcomePanel() {
  const { activeRole } = useRoleStore();
  const pathname       = usePathname();

  // In-memory dismissal — resets on page refresh (ideal for demo presentations)
  const [visible, setVisible] = useState(true);

  const homeRoute = HOME_ROUTES[activeRole];

  // Only show on the role's home route
  if (!homeRoute || pathname !== homeRoute) return null;
  if (!visible) return null;

  const cfg = WELCOME[activeRole];

  return (
    <div className={cn(
      "rounded-xl bg-gradient-to-r text-white p-5 mb-5 relative",
      cfg.gradientFrom, cfg.gradientTo
    )}>
      {/* Dismiss button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Dismiss welcome panel"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Header */}
      <div className="pr-8">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1">
          Getting Started · Tanweer Demo
        </p>
        <h2 className="text-lg font-bold leading-snug">{cfg.title}</h2>
        <p className="text-sm text-white/80 mt-1 leading-relaxed">{cfg.subtitle}</p>
      </div>

      {/* Numbered quick-action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        {cfg.steps.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.step}
              href={s.href}
              onClick={() => setVisible(false)}
              className="group flex items-start gap-3 bg-white/15 hover:bg-white/25 transition-colors rounded-xl p-3.5"
            >
              {/* Step number */}
              <span className="shrink-0 h-6 w-6 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">
                {s.step}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-sm font-semibold truncate">{s.label}</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{s.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-0.5" />
            </Link>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] text-white/50">
          Click any card to navigate · dismisses automatically
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setVisible(false)}
          className="h-7 text-xs text-white/70 hover:text-white hover:bg-white/20 px-3"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}
