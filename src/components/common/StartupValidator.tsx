"use client";
/**
 * StartupValidator — zero-UI client component
 *
 * Mounts invisibly inside the dashboard layout.
 * On first mount, runs the DevGuard against the live Zustand store
 * and logs any architectural violations to the browser console.
 *
 * Re-validates automatically whenever new events are logged (eventLog grows).
 *
 * This component renders nothing — it is purely a side-effect hook.
 */

import { useEffect, useRef } from "react";
import { useDataStore } from "@/store/useDataStore";
import { runDevGuard } from "@/lib/devGuard";

export function StartupValidator() {
  const store      = useDataStore();
  const hasRun     = useRef(false);
  const lastCount  = useRef(-1);

  // ── Initial validation on first mount ──────────────────────────────────────
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (process.env.NODE_ENV !== "development") return;

    runDevGuard({
      threads:        store.threads,
      announcements:  store.announcements,
      meetings:       store.meetings,
      tasks:          store.tasks,
      notifications:  store.notifications,
      admissionLeads: store.admissionLeads,
      eventLog:       store.eventLog,
    });

    lastCount.current = store.eventLog.length;
  // Only run once on mount — deliberate empty deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-validate event schema whenever new events are logged ────────────────
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (!hasRun.current) return;
    if (store.eventLog.length === lastCount.current) return;

    lastCount.current = store.eventLog.length;

    // Only validate schema of newly added events (lightweight check)
    const newest = store.eventLog[0];
    if (!newest) return;

    const required = ["id", "type", "timestamp", "actor", "payload"] as const;
    const missing  = required.filter((f) => !newest[f as keyof typeof newest]);

    if (missing.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `[Tanweer DevGuard] 🚨 RULE-EVT-002 — New event "${newest.id}" is missing required fields: ${missing.join(", ")}`
      );
    }
    if (store.eventLog.length > 100) {
      // eslint-disable-next-line no-console
      console.warn(
        `[Tanweer DevGuard] ⚠️  RULE-EVT-003 — eventLog has ${store.eventLog.length} entries (cap: 100). Check slice(0,100) in useDataStore.`
      );
    }
  }, [store.eventLog]);

  return null;
}
