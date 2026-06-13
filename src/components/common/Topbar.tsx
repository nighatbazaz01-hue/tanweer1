"use client";
import { Bell, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUIStore } from "@/store/useUIStore";
import { useRoleStore, roleConfig } from "@/store/useRoleStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getInitials } from "@/lib/utils";
import { getUnreadCount } from "@/lib/mockData/notifications";

export function Topbar() {
  const { toggleAiDrawer } = useUIStore();
  const { activeRole } = useRoleStore();
  const { user } = useAuthStore();
  const cfg = roleConfig[activeRole];
  const unreadCount = getUnreadCount(activeRole);

  const displayName = user?.name ?? cfg.label;
  const displaySubtitle = cfg.description;

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
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${cfg.bg} ${cfg.color} border-current/20`}
        >
          <span className="text-base leading-none">{cfg.emoji}</span>
          <span className="hidden sm:block">{cfg.label}</span>
        </div>

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
          className={`h-9 gap-1.5 hidden sm:flex ${activeRole === "student" ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50" : "text-violet-600 hover:text-violet-700 hover:bg-violet-50"}`}
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-medium">{activeRole === "student" ? "Study AI" : "School AI"}</span>
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={`text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-xs font-semibold leading-none">{displayName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{displaySubtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
