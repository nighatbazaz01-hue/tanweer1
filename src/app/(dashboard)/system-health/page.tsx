"use client";
import { useMemo, useState } from "react";
import {
  CheckCircle2, XCircle, AlertTriangle, RefreshCw,
  Database, Users, Shield, Zap, Activity, ChevronDown, ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/store/useDataStore";
import {
  runSystemHealthCheck,
  type SystemHealthReport,
  type CheckStatus,
  type IntegrityResult,
} from "@/lib/systemHealth";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<CheckStatus, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  pass: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", label: "Pass" },
  fail: { icon: XCircle,      color: "text-red-600",     bg: "bg-red-50 border-red-200",         label: "Fail" },
  warn: { icon: AlertTriangle, color: "text-amber-600",  bg: "bg-amber-50 border-amber-200",     label: "Warn" },
};

const CATEGORY_LABELS: Record<string, string> = {
  legacy_import:     "Legacy Imports",
  permission_engine: "Permission Engine Coverage",
  hardcoded_data:    "Hardcoded Data",
  event_system:      "Event System",
  data_source:       "Data Source Integrity",
  role_isolation:    "Role Isolation Tests",
};

const ROLE_COLORS: Record<string, string> = {
  admin:   "bg-violet-100 text-violet-700",
  vp1:     "bg-indigo-100 text-indigo-700",
  vp2:     "bg-sky-100 text-sky-700",
  vp3:     "bg-teal-100 text-teal-700",
  teacher: "bg-blue-100 text-blue-700",
  parent:  "bg-green-100 text-green-700",
  student: "bg-amber-100 text-amber-700",
};

function StatusIcon({ status }: { status: CheckStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return <Icon className={cn("h-4 w-4 shrink-0", cfg.color)} />;
}

function CheckRow({ check }: { check: IntegrityResult }) {
  const cfg = STATUS_CONFIG[check.status];
  return (
    <div className={cn("flex items-start gap-3 p-3 rounded-lg border text-xs", cfg.bg)}>
      <StatusIcon status={check.status} />
      <div className="flex-1 min-w-0">
        <p className="font-mono font-semibold text-[11px] text-muted-foreground">{check.id}</p>
        <p className="font-medium mt-0.5">{check.scope}</p>
        <p className="text-muted-foreground mt-0.5 leading-relaxed">{check.detail}</p>
      </div>
      <Badge
        variant={check.status === "pass" ? "success" : check.status === "fail" ? "destructive" : "warning"}
        className="text-[10px] shrink-0"
      >
        {cfg.label}
      </Badge>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SystemHealthPage() {
  const store = useDataStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    legacy_import:     true,
    permission_engine: false,
    hardcoded_data:    true,
    event_system:      true,
    data_source:       true,
    role_isolation:    true,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const report: SystemHealthReport = useMemo(
    () =>
      runSystemHealthCheck({
        threads:        store.threads,
        announcements:  store.announcements,
        meetings:       store.meetings,
        tasks:          store.tasks,
        notifications:  store.notifications,
        admissionLeads: store.admissionLeads,
        eventLog:       store.eventLog,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshKey, store.eventLog.length]
  );

  const grouped = useMemo(() => {
    const map: Record<string, IntegrityResult[]> = {};
    for (const check of report.checks) {
      if (!map[check.category]) map[check.category] = [];
      map[check.category].push(check);
    }
    return map;
  }, [report.checks]);

  const toggleSection = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const genTime = new Date(report.generatedAt).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Health Dashboard"
        description={`Developer validation layer · Last checked ${genTime}`}
        breadcrumbs={[{ label: "Dev Tools" }, { label: "System Health" }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setRefreshKey((k) => k + 1)}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Re-run Checks
          </Button>
        }
      />

      {/* ── Banner ──────────────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 flex items-center gap-3">
        <Shield className="h-4 w-4 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800 font-medium">
          Developer-only tool. This page validates the permission engine, data store, and event system.
          Not visible in the main sidebar navigation.
        </p>
      </div>

      {/* ── Summary Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-emerald-700">{report.summary.pass}</p>
            <p className="text-xs text-emerald-600 font-medium">Checks Passed</p>
          </CardContent>
        </Card>
        <Card className={cn(report.summary.fail > 0 ? "border-red-200 bg-red-50/50" : "border-slate-200")}>
          <CardContent className="p-4 text-center">
            <XCircle className={cn("h-6 w-6 mx-auto mb-1", report.summary.fail > 0 ? "text-red-500" : "text-muted-foreground")} />
            <p className={cn("text-2xl font-bold", report.summary.fail > 0 ? "text-red-700" : "text-muted-foreground")}>
              {report.summary.fail}
            </p>
            <p className={cn("text-xs font-medium", report.summary.fail > 0 ? "text-red-600" : "text-muted-foreground")}>
              Checks Failed
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-amber-700">{report.summary.warn}</p>
            <p className="text-xs text-amber-600 font-medium">Warnings</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 text-center">
            <Zap className="h-6 w-6 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-700">{store.eventLog.length}</p>
            <p className="text-xs text-blue-600 font-medium">Events Logged</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Population Stats ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            Population Dataset (from population.ts)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {[
              { label: "Students",           value: report.population.totalStudents,          color: "text-violet-700" },
              { label: "Teachers",           value: report.population.totalTeachers,          color: "text-blue-700" },
              { label: "Parents",            value: report.population.totalParents,           color: "text-green-700" },
              { label: "Attendance Records", value: report.population.totalAttendanceRecords, color: "text-amber-700" },
              { label: "Fee Records",        value: report.population.totalFeeRecords,        color: "text-teal-700" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-3 rounded-lg bg-muted/50">
                <p className={cn("text-xl font-bold", color)}>{value.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Store Snapshot ───────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Live Store Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { label: "Threads",       value: store.threads.length },
              { label: "Announcements", value: store.announcements.length },
              { label: "Meetings",      value: store.meetings.length },
              { label: "Tasks",         value: store.tasks.length },
              { label: "Notifications", value: store.notifications.length },
              { label: "Leads",         value: store.admissionLeads.length },
              { label: "Events Logged", value: store.eventLog.length },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-lg bg-muted/50">
                <p className="text-lg font-bold">{value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Role Access Matrix ────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Role Access Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-3 font-semibold text-muted-foreground">Role</th>
                {["Students", "Teachers", "Parents", "Attend.", "Fees", "Threads", "Annmt.", "Meetings", "Tasks", "Notifs"].map((h) => (
                  <th key={h} className="text-center py-2 px-2 font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.roleAccess.map((row) => (
                <tr key={row.role} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="py-2 pr-3">
                    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold", ROLE_COLORS[row.role])}>
                      {row.role}
                    </span>
                  </td>
                  {[
                    row.students, row.teachers, row.parents, row.attendanceRecords,
                    row.feeRecords, row.threads, row.announcements, row.meetings, row.tasks, row.notifications,
                  ].map((val, i) => (
                    <td key={i} className="text-center py-2 px-2 tabular-nums font-medium">
                      <span className={val === 0 ? "text-muted-foreground/50" : ""}>
                        {val.toLocaleString()}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ── Event Log ─────────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Event Log (last {Math.min(store.eventLog.length, 15)} of {store.eventLog.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {store.eventLog.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs">
              <Zap className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>No events logged yet.</p>
              <p className="mt-1">Interact with Messages, Tasks, Meetings, or Admissions to generate events.</p>
            </div>
          ) : (
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  {["Event ID", "Type", "Actor", "Timestamp", "Payload Preview"].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {store.eventLog.slice(0, 15).map((evt) => (
                  <tr key={evt.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 pr-4 font-mono text-[10px] text-muted-foreground">{evt.id}</td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-medium whitespace-nowrap">
                        {evt.type}
                      </span>
                    </td>
                    <td className="py-2 pr-4 font-medium">{evt.actor}</td>
                    <td className="py-2 pr-4 text-muted-foreground font-mono text-[10px]">
                      {new Date(evt.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </td>
                    <td className="py-2 max-w-[280px] truncate text-muted-foreground font-mono text-[10px]">
                      {JSON.stringify(evt.payload)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* ── Integrity Checks ──────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Integrity Checks ({report.summary.total} total)
        </h2>

        {Object.entries(grouped).map(([category, checks]) => {
          const catFail = checks.filter((c) => c.status === "fail").length;
          const catWarn = checks.filter((c) => c.status === "warn").length;
          const catPass = checks.filter((c) => c.status === "pass").length;
          const isOpen  = expanded[category];

          return (
            <Card key={category}>
              <button
                className="w-full text-left"
                onClick={() => toggleSection(category)}
              >
                <CardHeader className="pb-3 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-sm font-semibold">{CATEGORY_LABELS[category] ?? category}</span>
                      <span className="text-xs text-muted-foreground">({checks.length})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {catPass > 0 && (
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {catPass} pass
                        </span>
                      )}
                      {catWarn > 0 && (
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                          {catWarn} warn
                        </span>
                      )}
                      {catFail > 0 && (
                        <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          {catFail} fail
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </button>
              {isOpen && (
                <CardContent className="pt-0 pb-4 space-y-2">
                  {checks.map((check) => (
                    <CheckRow key={check.id} check={check} />
                  ))}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
