"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, DollarSign,
  ClipboardList, Sparkles, Settings, ChevronLeft, ChevronRight,
  UserCheck, BookMarked, CalendarDays, TrendingUp, MessageSquare,
  Home, FileText, Clock, Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { useRoleStore, roleConfig } from "@/store/useRoleStore";
import { Button } from "@/components/ui/button";

const navByRole = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Students", href: "/students", icon: Users },
    { label: "Admissions", href: "/admissions", icon: UserCheck },
    { label: "Academics", href: "/academics", icon: BookOpen },
    { label: "Attendance", href: "/attendance", icon: ClipboardList },
    { label: "Finance", href: "/fees", icon: DollarSign },
    { label: "AI Insights", href: "/ai-insights", icon: Sparkles },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  teacher: [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "My Classes", href: "/teacher/classes", icon: BookOpen },
    { label: "Attendance", href: "/teacher/attendance", icon: ClipboardList },
    { label: "Homework", href: "/teacher/homework", icon: BookMarked },
    { label: "Performance", href: "/teacher/performance", icon: TrendingUp },
    { label: "Students", href: "/students", icon: Users },
    { label: "AI Assistant", href: "/ai-insights", icon: Sparkles },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  parent: [
    { label: "My Child", href: "/parent", icon: Home },
    { label: "Attendance", href: "/parent/attendance", icon: ClipboardList },
    { label: "Academics", href: "/parent/marks", icon: Award },
    { label: "Timetable", href: "/parent/timetable", icon: CalendarDays },
    { label: "Teachers", href: "/parent/teachers", icon: GraduationCap },
    { label: "Messages", href: "/parent/messages", icon: MessageSquare },
    { label: "Fee Payment", href: "/fees", icon: DollarSign },
    { label: "AI Assistant", href: "/ai-insights", icon: Sparkles },
  ],
  student: [
    { label: "Dashboard", href: "/student-view", icon: LayoutDashboard },
    { label: "My Attendance", href: "/student-view/attendance", icon: ClipboardList },
    { label: "Homework", href: "/student-view/homework", icon: BookMarked },
    { label: "Projects", href: "/student-view/projects", icon: FileText },
    { label: "Exams", href: "/student-view/exams", icon: Award },
    { label: "My Marks", href: "/student-view/marks", icon: TrendingUp },
    { label: "Timetable", href: "/student-view/timetable", icon: CalendarDays },
    { label: "AI Study", href: "/ai-insights", icon: Sparkles },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { activeRole } = useRoleStore();
  const cfg = roleConfig[activeRole];
  const navItems = navByRole[activeRole];

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-card border-r transition-all duration-300 relative shrink-0",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center gap-2.5 px-4 py-4 border-b">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm shrink-0", cfg.bg, cfg.color)}>
          {cfg.emoji}
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate leading-none">Tanweer</p>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">{cfg.description}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/admin" && item.href !== "/teacher" && item.href !== "/parent" && item.href !== "/student-view" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? `${cfg.bg} ${cfg.color}`
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                sidebarCollapsed && "justify-center px-2"
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-sm"
      >
        {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </aside>
  );
}
