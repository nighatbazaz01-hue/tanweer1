"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldX } from "lucide-react";
import { useRoleStore } from "@/store/useRoleStore";
import { useDataStore } from "@/store/useDataStore";
import { useAuthStore } from "@/store/useAuthStore";
import type { AppRole } from "@/store/useRoleStore";

// ─── Which path prefixes each role may access ────────────────────────────────
const ROLE_ALLOWED_PREFIXES: Record<AppRole, string[]> = {
  admin: ["/"],  // admin has unrestricted access to all routes

  vp1: [
    "/vp", "/directory", "/attendance", "/transport",
    "/announcements", "/messages", "/notifications",
    "/meetings", "/tasks", "/ai-insights", "/students", "/dashboard",
  ],
  vp2: [
    "/vp", "/directory", "/attendance", "/transport",
    "/announcements", "/messages", "/notifications",
    "/meetings", "/tasks", "/ai-insights", "/students", "/dashboard",
  ],
  vp3: [
    "/vp", "/directory", "/attendance", "/transport",
    "/announcements", "/messages", "/notifications",
    "/meetings", "/tasks", "/ai-insights", "/students", "/dashboard",
  ],

  teacher: [
    "/teacher", "/students", "/messages", "/meetings",
    "/tasks", "/notifications", "/announcements",
    "/settings", "/ai-insights", "/dashboard",
  ],

  parent: [
    "/parent", "/fees", "/transport", "/messages",
    "/meetings", "/notifications", "/announcements",
    "/ai-insights", "/dashboard",
  ],

  student: [
    "/student-view", "/transport", "/messages",
    "/notifications", "/announcements", "/ai-insights", "/dashboard",
  ],
};

// ─── Where each role lands after an unauthorized redirect ─────────────────────
const ROLE_HOME: Record<AppRole, string> = {
  admin:   "/admin",
  vp1:     "/vp",
  vp2:     "/vp",
  vp3:     "/vp",
  teacher: "/teacher",
  parent:  "/parent",
  student: "/student-view",
};

function isPathAllowed(pathname: string, role: AppRole): boolean {
  const prefixes = ROLE_ALLOWED_PREFIXES[role];
  return prefixes.some((prefix) => {
    if (prefix === "/") return true;                          // admin wildcard
    return pathname === prefix || pathname.startsWith(prefix + "/");
  });
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { activeRole }        = useRoleStore();
  const { user }              = useAuthStore();
  const { logSecurityEvent }  = useDataStore();

  const allowed = isPathAllowed(pathname, activeRole);

  // Log + redirect exactly once per denied path (avoid loops on re-render)
  const deniedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!allowed && deniedRef.current !== pathname) {
      deniedRef.current = pathname;
      logSecurityEvent(
        activeRole,
        pathname,
        user?.name ?? "Unknown",
      );
      const t = setTimeout(() => {
        router.replace(ROLE_HOME[activeRole]);
      }, 1400);
      return () => clearTimeout(t);
    }
    if (allowed) {
      deniedRef.current = null;
    }
  }, [allowed, pathname, activeRole, user, router, logSecurityEvent]);

  if (!allowed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] gap-5 text-center px-4">
        <div className="rounded-full bg-red-100 p-6">
          <ShieldX className="h-10 w-10 text-red-600" />
        </div>
        <div>
          <p className="text-xl font-bold text-red-700">Access Denied</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            You do not have permission to view this page.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Redirecting to your dashboard…
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
