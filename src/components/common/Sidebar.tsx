"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, DollarSign,
  ClipboardList, Sparkles, Settings, ChevronLeft, ChevronRight,
  Building2, UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Admissions", href: "/admissions", icon: UserCheck },
  { label: "Students", href: "/students", icon: Users },
  { label: "Academics", href: "/academics", icon: BookOpen },
  { label: "Attendance", href: "/attendance", icon: ClipboardList },
  { label: "Finance", href: "/fees", icon: DollarSign },
  { label: "AI Insights", href: "/ai-insights", icon: Sparkles },
];

const bottomNavItems = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-card border-r transition-all duration-300 relative",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0">
          T
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">Tanweer</p>
            <p className="text-xs text-muted-foreground truncate">Al-Noor Academy</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
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

      <div className="p-2 space-y-1 border-t">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                sidebarCollapsed && "justify-center px-2"
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-sm"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </aside>
  );
}
