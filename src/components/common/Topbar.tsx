"use client";
import { Bell, Search, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getInitials } from "@/lib/utils";

export function Topbar() {
  const { toggleAiDrawer } = useUIStore();
  const { user } = useAuthStore();

  const displayUser = user || {
    name: "School Admin",
    role: "school_admin",
    schoolName: "Al-Noor Academy",
  };

  return (
    <header className="h-14 border-b bg-card flex items-center gap-4 px-4 shrink-0">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students, teachers..."
            className="pl-9 h-9 bg-muted/40 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span>Academic Year:</span>
        <Button variant="ghost" size="sm" className="h-8 gap-1 font-medium text-foreground">
          2024–2025 <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAiDrawer}
          className="h-9 gap-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline text-xs font-medium">AI Assistant</span>
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {getInitials(displayUser.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-xs font-medium leading-none">{displayUser.name}</p>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">
              {displayUser.role.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
