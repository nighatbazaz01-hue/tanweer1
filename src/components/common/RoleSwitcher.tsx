"use client";
import { useRoleStore, roleConfig, type AppRole } from "@/store/useRoleStore";
import { useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const roleRoutes: Record<AppRole, string> = {
  admin: "/admin",
  teacher: "/teacher",
  parent: "/parent",
  student: "/student-view",
};

export function RoleSwitcher() {
  const { activeRole, setRole } = useRoleStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const config = roleConfig[activeRole];

  const handleSelect = (role: AppRole) => {
    setRole(role);
    setOpen(false);
    router.push(roleRoutes[role]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all",
          config.bg, config.color, "border-current/20 hover:opacity-90"
        )}
      >
        <span className="text-base leading-none">{config.emoji}</span>
        <span className="hidden sm:block">{config.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl border shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-2 border-b bg-slate-50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Switch Role</p>
          </div>
          {(["admin", "teacher", "parent", "student"] as AppRole[]).map((role) => {
            const cfg = roleConfig[role];
            const active = role === activeRole;
            return (
              <button
                key={role}
                onClick={() => handleSelect(role)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors",
                  active && "bg-slate-50"
                )}
              >
                <span className="text-xl">{cfg.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-semibold", cfg.color)}>{cfg.label}</p>
                  <p className="text-xs text-slate-400 truncate">{cfg.description}</p>
                </div>
                {active && <Check className="h-4 w-4 text-slate-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
