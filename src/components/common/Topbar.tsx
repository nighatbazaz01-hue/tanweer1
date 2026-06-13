"use client";
import { Bell, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUIStore } from "@/store/useUIStore";
import { useRoleStore, roleConfig } from "@/store/useRoleStore";
import { RoleSwitcher } from "./RoleSwitcher";
import { getInitials } from "@/lib/utils";
import { getUnreadCount } from "@/lib/mockData/notifications";

const roleNames: Record<string, { name: string; subtitle: string }> = {
  admin: { name: "Dr. Khalid Al-Mansouri", subtitle: "Principal" },
  vp1: { name: "Dr. Khalid Al-Otaibi", subtitle: "VP · Grades 1–4" },
  vp2: { name: "Ms. Nora Al-Zahrani", subtitle: "VP · Grades 5–8" },
  vp3: { name: "Mr. Faris Al-Mutairi", subtitle: "VP · Grades 9–12" },
  teacher: { name: "Dr. Sarah Al-Hamdan", subtitle: "Mathematics · Grade 10" },
  parent: { name: "Mohammed Al-Rashidi", subtitle: "Ahmed's Father" },
  student: { name: "Ahmed Al-Rashidi", subtitle: "Grade 10-A · STU-2024-001" },
};

export function Topbar() {
  const { toggleAiDrawer } = useUIStore();
  const { activeRole } = useRoleStore();
  const user = roleNames[activeRole];
  const cfg = roleConfig[activeRole];
  const unreadCount = getUnreadCount(activeRole);

  return (
    <header className="h-14 border-b bg-card flex items-center gap-3 px-4 shrink-0">
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 h-9 bg-muted/40 border-0 focus-visible:ring-1 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <RoleSwitcher />

        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAiDrawer}
          className="h-9 gap-1.5 text-violet-600 hover:text-violet-700 hover:bg-violet-50 hidden sm:flex"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-medium">AI</span>
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={`text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-xs font-semibold leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user.subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
