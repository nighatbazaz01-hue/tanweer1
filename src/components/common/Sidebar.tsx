"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, BookOpen, DollarSign,
  ClipboardList, Sparkles, Settings, ChevronLeft, ChevronRight,
  UserCheck, BookMarked, CalendarDays, TrendingUp, Award,
  Home, FileText, Bell, Megaphone, CheckSquare,
  Calendar, Mail, Shield, BookUser, GraduationCap, Bus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { useRoleStore, roleConfig } from "@/store/useRoleStore";
import { useDataStore } from "@/store/useDataStore";
import { Button } from "@/components/ui/button";
import { getUnreadCount } from "@/lib/mockData/notifications";
import { filterThreadsForRole } from "@/lib/permissions";

// ─── Navigation definitions (ordered by role-specific demo priority) ──────────
// Priority order = demo journey top → most important first → secondary → settings
const navByRole = {
  // Admin journey: Dashboard → Students → Attendance → Finance → Messages
  admin: [
    { label: "Dashboard",        href: "/admin",              icon: LayoutDashboard },
    { label: "Students",         href: "/students",           icon: Users },
    { label: "Attendance",       href: "/attendance",         icon: ClipboardList },
    { label: "Finance",          href: "/fees",               icon: DollarSign },
    { label: "Admissions",       href: "/admissions",         icon: UserCheck },
    { label: "Academics",        href: "/academics",          icon: BookOpen },
    { group: "Directories" },
    { label: "Student Directory",  href: "/directory/students", icon: BookUser },
    { label: "Teacher Directory",  href: "/directory/teachers", icon: GraduationCap },
    { label: "Parent Directory",   href: "/directory/parents",  icon: Users },
    { group: "Communication" },
    { label: "Messages",         href: "/messages",           icon: Mail,       badge: "messages" },
    { label: "Notifications",    href: "/notifications",      icon: Bell,       badge: "notif" },
    { label: "Announcements",    href: "/announcements",      icon: Megaphone },
    { label: "Meetings",         href: "/meetings",           icon: Calendar },
    { label: "Tasks",            href: "/tasks",              icon: CheckSquare },
    { group: "Intelligence & Security" },
    { label: "AI Insights",      href: "/ai-insights",        icon: Sparkles },
    { label: "Audit Center",     href: "/audit",              icon: Shield },
    { label: "Transport",        href: "/transport",          icon: Bus },
    { label: "Settings",         href: "/settings",           icon: Settings },
  ],

  // VP journey: Dashboard → Students → Attendance → Announcements → Messages
  vp1: [
    { label: "VP Dashboard",       href: "/vp",                  icon: LayoutDashboard },
    { label: "My Students",        href: "/directory/students",  icon: Users },
    { label: "Attendance",         href: "/attendance",          icon: ClipboardList },
    { label: "Transport",          href: "/transport",           icon: Bus },
    { group: "Communication" },
    { label: "Announcements",      href: "/announcements",       icon: Megaphone },
    { label: "Messages",           href: "/messages",            icon: Mail,     badge: "messages" },
    { label: "Notifications",      href: "/notifications",       icon: Bell,     badge: "notif" },
    { label: "Meetings",           href: "/meetings",            icon: Calendar },
    { group: "Directories" },
    { label: "Student Directory",  href: "/directory/students",  icon: BookUser },
    { label: "Teacher Directory",  href: "/directory/teachers",  icon: GraduationCap },
    { label: "Parent Directory",   href: "/directory/parents",   icon: BookUser },
    { group: "Intelligence" },
    { label: "AI Assistant",       href: "/ai-insights",         icon: Sparkles },
  ],

  vp2: [
    { label: "VP Dashboard",       href: "/vp",                  icon: LayoutDashboard },
    { label: "My Students",        href: "/directory/students",  icon: Users },
    { label: "Attendance",         href: "/attendance",          icon: ClipboardList },
    { label: "Transport",          href: "/transport",           icon: Bus },
    { group: "Communication" },
    { label: "Announcements",      href: "/announcements",       icon: Megaphone },
    { label: "Messages",           href: "/messages",            icon: Mail,     badge: "messages" },
    { label: "Notifications",      href: "/notifications",       icon: Bell,     badge: "notif" },
    { label: "Meetings",           href: "/meetings",            icon: Calendar },
    { group: "Directories" },
    { label: "Student Directory",  href: "/directory/students",  icon: BookUser },
    { label: "Teacher Directory",  href: "/directory/teachers",  icon: GraduationCap },
    { label: "Parent Directory",   href: "/directory/parents",   icon: BookUser },
    { group: "Intelligence" },
    { label: "AI Assistant",       href: "/ai-insights",         icon: Sparkles },
  ],

  vp3: [
    { label: "VP Dashboard",       href: "/vp",                  icon: LayoutDashboard },
    { label: "My Students",        href: "/directory/students",  icon: Users },
    { label: "Attendance",         href: "/attendance",          icon: ClipboardList },
    { label: "Transport",          href: "/transport",           icon: Bus },
    { group: "Communication" },
    { label: "Announcements",      href: "/announcements",       icon: Megaphone },
    { label: "Messages",           href: "/messages",            icon: Mail,     badge: "messages" },
    { label: "Notifications",      href: "/notifications",       icon: Bell,     badge: "notif" },
    { label: "Meetings",           href: "/meetings",            icon: Calendar },
    { group: "Directories" },
    { label: "Student Directory",  href: "/directory/students",  icon: BookUser },
    { label: "Teacher Directory",  href: "/directory/teachers",  icon: GraduationCap },
    { label: "Parent Directory",   href: "/directory/parents",   icon: BookUser },
    { group: "Intelligence" },
    { label: "AI Assistant",       href: "/ai-insights",         icon: Sparkles },
  ],

  // Teacher journey: Dashboard → Classes → Attendance → Homework → Messages
  teacher: [
    { label: "Dashboard",    href: "/teacher",             icon: LayoutDashboard },
    { label: "My Classes",   href: "/teacher/classes",     icon: BookOpen },
    { label: "Attendance",   href: "/teacher/attendance",  icon: ClipboardList },
    { label: "Homework",     href: "/teacher/homework",    icon: BookMarked },
    { label: "My Students",  href: "/students",            icon: Users },
    { label: "Performance",  href: "/teacher/performance", icon: TrendingUp },
    { group: "Communication" },
    { label: "Messages",     href: "/messages",            icon: Mail,       badge: "messages" },
    { label: "Meetings",     href: "/meetings",            icon: Calendar },
    { label: "Tasks",        href: "/tasks",               icon: CheckSquare },
    { label: "Notifications", href: "/notifications",      icon: Bell,       badge: "notif" },
    { label: "Announcements", href: "/announcements",      icon: Megaphone },
    { group: "Intelligence" },
    { label: "AI Assistant", href: "/ai-insights",         icon: Sparkles },
    { label: "Settings",     href: "/settings",            icon: Settings },
  ],

  // Parent journey: My Child → Attendance → Marks → Fee Payment → Transport → Messages → Meetings
  parent: [
    { label: "My Child",     href: "/parent",              icon: Home },
    { label: "Attendance",   href: "/parent/attendance",   icon: ClipboardList },
    { label: "Marks",        href: "/parent/marks",        icon: Award },
    { label: "Fee Payment",  href: "/fees",                icon: DollarSign },
    { label: "Timetable",    href: "/parent/timetable",    icon: CalendarDays },
    { label: "Transport",    href: "/transport",           icon: Bus },
    { group: "Communication" },
    { label: "Messages",     href: "/messages",            icon: Mail,       badge: "messages" },
    { label: "Meetings",     href: "/meetings",            icon: Calendar },
    { label: "Notifications", href: "/notifications",      icon: Bell,       badge: "notif" },
    { label: "Announcements", href: "/announcements",      icon: Megaphone },
    { group: "Intelligence" },
    { label: "AI Assistant", href: "/ai-insights",         icon: Sparkles },
  ],

  // Student journey: Dashboard → Homework → Exams → Marks → Attendance → AI
  student: [
    { label: "Dashboard",       href: "/student-view",            icon: LayoutDashboard },
    { label: "Homework",        href: "/student-view/homework",   icon: BookMarked },
    { label: "Exams",           href: "/student-view/exams",      icon: Award },
    { label: "My Marks",        href: "/student-view/marks",      icon: TrendingUp },
    { label: "Attendance",      href: "/student-view/attendance", icon: ClipboardList },
    { label: "Projects",        href: "/student-view/projects",   icon: FileText },
    { label: "Timetable",       href: "/student-view/timetable",  icon: CalendarDays },
    { group: "Communication" },
    { label: "Messages",        href: "/messages",                icon: Mail,   badge: "messages" },
    { label: "Notifications",   href: "/notifications",           icon: Bell,   badge: "notif" },
    { label: "Announcements",   href: "/announcements",           icon: Megaphone },
    { group: "Intelligence" },
    { label: "AI Study",        href: "/ai-insights",             icon: Sparkles },
  ],
};

type NavItem =
  | { label: string; href: string; icon: React.ElementType; badge?: string; group?: never }
  | { group: string; label?: never; href?: never; icon?: never; badge?: never };

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { activeRole } = useRoleStore();
  const { threads } = useDataStore();
  const cfg = roleConfig[activeRole];
  const navItems = (navByRole[activeRole] ?? navByRole.admin) as NavItem[];
  const notifCount = getUnreadCount(activeRole);
  const msgCount = filterThreadsForRole(threads, activeRole)
    .filter((t) => !t.isArchived)
    .reduce((acc, t) => acc + t.unreadCount, 0);

  const getBadgeCount = (badge?: string) => {
    if (badge === "notif")    return notifCount;
    if (badge === "messages") return msgCount;
    return 0;
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-card border-r transition-all duration-300 relative shrink-0",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo / role header */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b">
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm shrink-0",
          cfg.bg, cfg.color
        )}>
          {cfg.emoji}
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate leading-none">Tanweer</p>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">{cfg.description}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {navItems.map((item, idx) => {
          // Group separator
          if ("group" in item && item.group) {
            if (sidebarCollapsed) {
              return <div key={`sep-${idx}`} className="my-2 border-t border-border/60" />;
            }
            return (
              <div key={`group-${idx}`} className="pt-3 pb-1 px-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  {item.group}
                </p>
              </div>
            );
          }

          // Nav link
          const navItem = item as { label: string; href: string; icon: React.ElementType; badge?: string };
          const Icon = navItem.icon;
          const badgeCount = getBadgeCount(navItem.badge);

          // Exact match for role home routes, prefix match for others
          const dashboardRoutes = ["/admin", "/teacher", "/parent", "/student-view", "/vp"];
          const active =
            pathname === navItem.href ||
            (!dashboardRoutes.includes(navItem.href) && pathname.startsWith(navItem.href));

          return (
            <Link
              key={`${navItem.href}-${idx}`}
              href={navItem.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? `${cfg.bg} ${cfg.color}`
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                sidebarCollapsed && "justify-center px-2"
              )}
              title={sidebarCollapsed ? navItem.label : undefined}
            >
              <div className="relative shrink-0">
                <Icon className="h-4 w-4" />
                {badgeCount > 0 && sidebarCollapsed && (
                  <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 bg-primary rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </span>
                )}
              </div>
              {!sidebarCollapsed && (
                <>
                  <span className="truncate flex-1">{navItem.label}</span>
                  {badgeCount > 0 && (
                    <span className="shrink-0 h-5 min-w-5 px-1 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                      {badgeCount > 99 ? "99+" : badgeCount}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
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
