"use client";
import { useState, useMemo } from "react";
import {
  Shield, AlertTriangle, Clock, User, LogIn, LogOut,
  Eye, Edit3, Download, Lock, Unlock, Search,
  ChevronDown, ChevronRight, Activity,
  Database, FileText, Megaphone, Calendar,
  DollarSign, BookOpen, Settings, TrendingUp,
  RefreshCw, Bot, Send,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  getAllAuditLogs, getRecentAuditLogs, getSensitiveAccessLogs,
  getLoginHistory, getSecurityAlerts, getActivityTimeline,
  securityMetrics, actionSummary, topUsersByActivity,
  moduleActivityBreakdown, dailyActivityLast30Days, aiSecurityResponses,
  type AuditLogEntry, type AuditAction, type AuditModule,
} from "@/lib/mockData/auditLogs";
import { TrendArea } from "@/components/charts";
import { cn } from "@/lib/utils";

// ── Visual config ──────────────────────────────────────────────────────────────
const severityStyle: Record<string, { bg: string; text: string; dot: string }> = {
  critical: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-600" },
  high:     { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  medium:   { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  low:      { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-400" },
  info:     { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
};

const outcomeStyle: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-700",
  failed:  "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
};

const actionIcon: Partial<Record<AuditAction, React.ElementType>> = {
  LOGIN: LogIn, LOGOUT: LogOut, LOGIN_FAILED: AlertTriangle,
  STUDENT_PROFILE_VIEWED: User, TEACHER_PROFILE_VIEWED: User, PARENT_PROFILE_VIEWED: User,
  ATTENDANCE_MARKED: Clock, ATTENDANCE_EDITED: Edit3,
  MARKS_ENTERED: BookOpen, MARKS_EDITED: Edit3,
  HOMEWORK_ASSIGNED: BookOpen,
  FEE_VIEWED: DollarSign, FEE_MODIFIED: DollarSign, FEE_PAYMENT_RECORDED: DollarSign,
  MESSAGE_SENT: Send, ANNOUNCEMENT_CREATED: Megaphone, MEETING_CREATED: Calendar,
  REPORT_GENERATED: FileText, DATA_EXPORTED: Download,
  SENSITIVE_ADDRESS_VIEWED: Eye, SENSITIVE_PHONE_VIEWED: Eye, SENSITIVE_FEE_RECORD_VIEWED: Eye,
  SETTINGS_CHANGED: Settings, PIN_UNLOCK: Unlock, SESSION_EXPIRED: Lock,
  PASSWORD_RESET: Lock,
};

const tabs = [
  { id: "dashboard", label: "Security Dashboard", icon: Shield },
  { id: "logs", label: "Audit Logs", icon: Activity },
  { id: "sensitive", label: "Sensitive Access", icon: Eye },
  { id: "logins", label: "Login History", icon: LogIn },
  { id: "alerts", label: "Security Alerts", icon: AlertTriangle },
  { id: "timeline", label: "Activity Timeline", icon: Clock },
  { id: "ai", label: "AI Security", icon: Bot },
] as const;

type TabId = typeof tabs[number]["id"];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AuditPage() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    setLastRefreshed(new Date().toLocaleTimeString());
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Audit & Security Center"
        description={`${securityMetrics.totalLogs.toLocaleString()} total records · Last updated: ${lastRefreshed}`}
        breadcrumbs={[{ label: "Security" }, { label: "Audit Center" }]}
        actions={
          <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        }
      />

      {/* Critical Alert Banner */}
      {securityMetrics.criticalAlerts > 0 && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-800 font-medium">
            {securityMetrics.criticalAlerts} critical security events detected in the last 30 days — immediate review required.
          </p>
          <Button size="sm" variant="outline" className="ml-auto text-red-700 border-red-300 hover:bg-red-100 shrink-0 text-xs" onClick={() => setActiveTab("alerts")}>
            View Alerts
          </Button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-0.5 border-b">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 -mb-px transition-all",
                activeTab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === "dashboard" && <SecurityDashboard />}
      {activeTab === "logs" && <AuditLogsTab />}
      {activeTab === "sensitive" && <SensitiveAccessTab />}
      {activeTab === "logins" && <LoginHistoryTab />}
      {activeTab === "alerts" && <SecurityAlertsTab />}
      {activeTab === "timeline" && <ActivityTimelineTab />}
      {activeTab === "ai" && <AISecurityTab />}
    </div>
  );
}

// ── Security Dashboard ─────────────────────────────────────────────────────────
function SecurityDashboard() {
  const chartData = dailyActivityLast30Days.map((d) => ({ ...d, name: d.day }));

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Audit Logs", value: securityMetrics.totalLogs.toLocaleString(), icon: Database, color: "bg-indigo-50 text-indigo-700" },
          { label: "Today's Activity", value: securityMetrics.todayLogs, icon: Activity, color: "bg-blue-50 text-blue-700" },
          { label: "Failed Logins", value: securityMetrics.failedLogins, icon: AlertTriangle, color: "bg-red-50 text-red-700" },
          { label: "Sensitive Accesses", value: securityMetrics.sensitiveAccesses, icon: Eye, color: "bg-amber-50 text-amber-700" },
          { label: "Grade Changes", value: securityMetrics.gradeChanges, icon: Edit3, color: "bg-violet-50 text-violet-700" },
          { label: "Fee Modifications", value: securityMetrics.feeModifications, icon: DollarSign, color: "bg-emerald-50 text-emerald-700" },
          { label: "Data Exports", value: securityMetrics.dataExports, icon: Download, color: "bg-orange-50 text-orange-700" },
          { label: "Critical Alerts", value: securityMetrics.criticalAlerts, icon: Shield, color: "bg-red-50 text-red-700" },
        ].map((s) => (
          <Card key={s.label} className={s.color}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className="h-5 w-5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs font-medium leading-tight">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            Daily Activity — Last 30 Days (Total vs. Sensitive)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TrendArea
            data={chartData}
            xKey="day"
            lines={[
              { key: "total", color: "#6366f1", label: "Total Actions" },
              { key: "sensitive", color: "#ef4444", label: "Sensitive Accesses" },
            ]}
            height={200}
            legend
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top Users */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Top Users by Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topUsersByActivity.map((u, i) => (
              <div key={u.name} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-5 text-right shrink-0">{i + 1}</span>
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700 font-bold">{u.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.name}</p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: `${(u.actions / topUsersByActivity[0].actions) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">{u.actions.toLocaleString()}</p>
                  <p className={cn("text-xs font-medium", u.sensitiveActions > 100 ? "text-red-600" : "text-muted-foreground")}>
                    {u.sensitiveActions} sensitive
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Module Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Activity by Module</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {moduleActivityBreakdown.map((m) => (
              <div key={m.module} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{m.module}</span>
                  <span className="font-semibold">{m.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${(m.count / moduleActivityBreakdown[0].count) * 100}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Action Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Action Summary — Last 6 Months</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {actionSummary.map((a) => (
              <div key={a.action} className="p-3 rounded-xl bg-muted/40 border">
                <p className="text-lg font-bold">{a.count.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.action}</p>
                <p className={cn("text-xs font-medium mt-1", a.trend > 0 ? "text-emerald-600" : "text-red-500")}>
                  {a.trend > 0 ? "↑" : "↓"} {Math.abs(a.trend)}% vs last month
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Shared Log Table ──────────────────────────────────────────────────────────
function LogTable({ logs, showSensitiveTag }: { logs: AuditLogEntry[]; showSensitiveTag?: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-1.5">
      {logs.map((log) => {
        const Icon = actionIcon[log.action] ?? Activity;
        const sev = severityStyle[log.severity];
        const isOpen = expanded === log.id;
        const isSensitive = ["SENSITIVE_ADDRESS_VIEWED", "SENSITIVE_PHONE_VIEWED", "SENSITIVE_FEE_RECORD_VIEWED", "DATA_EXPORTED", "FEE_MODIFIED", "MARKS_EDITED"].includes(log.action);

        return (
          <div key={log.id} className={cn("rounded-xl border transition-all", log.severity === "critical" && "border-red-200 bg-red-50/30", log.outcome === "failed" && "border-red-200 bg-red-50/20")}>
            <button className="w-full text-left" onClick={() => setExpanded(isOpen ? null : log.id)}>
              <div className="flex items-start gap-3 p-3">
                <div className={cn("p-1.5 rounded-lg shrink-0 mt-0.5", sev.bg)}>
                  <Icon className={cn("h-3.5 w-3.5", sev.text)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <Avatar className="h-5 w-5 shrink-0">
                        <AvatarFallback className="text-[9px] bg-indigo-100 text-indigo-700">{log.userAvatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-semibold truncate">{log.userName}</span>
                      <Badge variant="secondary" className="text-[10px]">{log.userRole}</Badge>
                      {isSensitive && showSensitiveTag && (
                        <Badge className="text-[10px] bg-red-100 text-red-700">🔐 Sensitive</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={cn("text-[10px] capitalize", outcomeStyle[log.outcome])}>{log.outcome}</Badge>
                      <Badge className={cn("text-[10px] capitalize border", sev.bg, sev.text)}>{log.severity}</Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{log.date} {log.time}</span>
                      {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{log.details}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-[10px]">{log.module}</Badge>
                    {log.recordLabel && <span className="text-[10px] text-muted-foreground truncate">→ {log.recordLabel}</span>}
                  </div>
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="px-3 pb-3 pt-1 border-t bg-muted/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <DetailItem label="Log ID" value={log.id} mono />
                  <DetailItem label="Session ID" value={log.sessionId} mono />
                  <DetailItem label="IP Address" value={log.ipAddress} mono />
                  <DetailItem label="Device" value={`${log.deviceType} · ${log.browser || "—"}`} />
                  <DetailItem label="Module" value={log.module} />
                  {log.recordType && <DetailItem label="Record Type" value={log.recordType} />}
                  {log.recordId && <DetailItem label="Record ID" value={log.recordId} mono />}
                  {log.fieldsViewed && (
                    <div className="sm:col-span-2">
                      <p className="font-semibold text-muted-foreground uppercase tracking-wide mb-1">Fields Viewed</p>
                      <div className="flex flex-wrap gap-1">
                        {log.fieldsViewed.map((f) => <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>)}
                      </div>
                    </div>
                  )}
                  {log.fieldsModified && (
                    <div className="sm:col-span-2">
                      <p className="font-semibold text-muted-foreground uppercase tracking-wide mb-1">Fields Modified</p>
                      <div className="flex flex-wrap gap-1">
                        {log.fieldsModified.map((f) => <Badge key={f} className="text-[10px] bg-amber-100 text-amber-800">{f}</Badge>)}
                      </div>
                    </div>
                  )}
                  {(log.beforeValue || log.afterValue) && (
                    <div className="sm:col-span-3">
                      <p className="font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Change Record</p>
                      <div className="grid grid-cols-2 gap-2">
                        {log.beforeValue && (
                          <div className="bg-red-50 rounded-lg p-2 border border-red-100">
                            <p className="text-[10px] font-bold text-red-600 mb-1">BEFORE</p>
                            {Object.entries(log.beforeValue).map(([k, v]) => (
                              <p key={k} className="text-[10px]"><span className="text-muted-foreground">{k}:</span> <span className="font-mono">{v}</span></p>
                            ))}
                          </div>
                        )}
                        {log.afterValue && (
                          <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
                            <p className="text-[10px] font-bold text-emerald-600 mb-1">AFTER</p>
                            {Object.entries(log.afterValue).map(([k, v]) => (
                              <p key={k} className="text-[10px]"><span className="text-muted-foreground">{k}:</span> <span className="font-mono">{v}</span></p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DetailItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={cn("text-xs mt-0.5", mono && "font-mono")}>{value}</p>
    </div>
  );
}

// ── Audit Logs Tab ─────────────────────────────────────────────────────────────
function AuditLogsTab() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 25;

  const raw = useMemo(() => getRecentAuditLogs(500), []);
  const filtered = useMemo(() => raw.filter((l) => {
    const matchSearch = !search || l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.recordLabel || "").toLowerCase().includes(search.toLowerCase());
    const matchMod = moduleFilter === "all" || l.module === moduleFilter;
    const matchSev = severityFilter === "all" || l.severity === severityFilter;
    return matchSearch && matchMod && matchSev;
  }), [raw, search, moduleFilter, severityFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const modules = [...new Set(raw.map((l) => l.module))];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by user, action, record..." className="pl-9 h-9 text-sm" />
        </div>
        <select value={moduleFilter} onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }} className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
          <option value="all">All Modules</option>
          {modules.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }} className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
          <option value="all">All Severities</option>
          {["critical", "high", "medium", "low", "info"].map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <Badge variant="secondary" className="text-xs">{filtered.length.toLocaleString()} results</Badge>
      </div>

      <LogTable logs={paged} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
          <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      )}
    </div>
  );
}

// ── Sensitive Access Tab ──────────────────────────────────────────────────────
function SensitiveAccessTab() {
  const logs = useMemo(() => getSensitiveAccessLogs(), []);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Address Accesses", value: logs.filter((l) => l.action === "SENSITIVE_ADDRESS_VIEWED").length, color: "bg-red-50 text-red-700" },
          { label: "Phone Accesses", value: logs.filter((l) => l.action === "SENSITIVE_PHONE_VIEWED").length, color: "bg-amber-50 text-amber-700" },
          { label: "Fee Record Views", value: logs.filter((l) => l.action === "SENSITIVE_FEE_RECORD_VIEWED").length, color: "bg-violet-50 text-violet-700" },
          { label: "Data Exports", value: logs.filter((l) => l.action === "DATA_EXPORTED").length, color: "bg-red-100 text-red-800" },
        ].map((s) => (
          <Card key={s.label} className={s.color}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="rounded-xl border bg-amber-50/40 px-4 py-3 flex items-start gap-2">
        <Eye className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-800">All sensitive data accesses are logged here with full field-level detail. Click any entry to see exactly which fields were accessed.</p>
      </div>
      <LogTable logs={logs} showSensitiveTag />
    </div>
  );
}

// ── Login History Tab ─────────────────────────────────────────────────────────
function LoginHistoryTab() {
  const logs = useMemo(() => getLoginHistory(), []);
  const failed = logs.filter((l) => l.action === "LOGIN_FAILED").length;
  const success = logs.filter((l) => l.action === "LOGIN").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Successful Logins", value: success, color: "bg-emerald-50 text-emerald-700" },
          { label: "Failed Logins", value: failed, color: "bg-red-50 text-red-700" },
          { label: "Logouts", value: logs.filter((l) => l.action === "LOGOUT").length, color: "bg-slate-50 text-slate-700" },
          { label: "PIN Unlocks", value: logs.filter((l) => l.action === "PIN_UNLOCK").length, color: "bg-amber-50 text-amber-700" },
          { label: "Expired Sessions", value: logs.filter((l) => l.action === "SESSION_EXPIRED").length, color: "bg-blue-50 text-blue-700" },
        ].map((s) => (
          <Card key={s.label} className={s.color}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <LogTable logs={logs} />
    </div>
  );
}

// ── Security Alerts Tab ───────────────────────────────────────────────────────
function SecurityAlertsTab() {
  const logs = useMemo(() => getSecurityAlerts(), []);
  const critical = logs.filter((l) => l.severity === "critical").length;
  const high = logs.filter((l) => l.severity === "high").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Critical", value: critical, color: "bg-red-50 text-red-700" },
          { label: "High", value: high, color: "bg-amber-50 text-amber-700" },
          { label: "Failed Actions", value: logs.filter((l) => l.outcome === "failed").length, color: "bg-orange-50 text-orange-700" },
          { label: "Total Alerts", value: logs.length, color: "bg-slate-50 text-slate-700" },
        ].map((s) => (
          <Card key={s.label} className={s.color}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <LogTable logs={logs} showSensitiveTag />
    </div>
  );
}

// ── Activity Timeline Tab ─────────────────────────────────────────────────────
function ActivityTimelineTab() {
  const logs = useMemo(() => getActivityTimeline(100), []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Last 100 actions across all users and modules</p>
        <Badge variant="secondary" className="text-xs">Live Feed</Badge>
      </div>
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-0">
          {logs.map((log, i) => {
            const Icon = actionIcon[log.action] ?? Activity;
            const sev = severityStyle[log.severity];
            return (
              <div key={log.id} className="flex gap-4 pl-2 pb-4">
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-background", sev.bg)}>
                  <Icon className={cn("h-3.5 w-3.5", sev.text)} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <span className="font-semibold text-sm">{log.userName}</span>
                      <span className="text-muted-foreground text-sm"> — {log.details}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge className={cn("text-[10px]", outcomeStyle[log.outcome])}>{log.outcome}</Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{log.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <Badge variant="outline" className="text-[10px]">{log.module}</Badge>
                    <Badge className={cn("text-[10px]", sev.bg, sev.text)}>{log.severity}</Badge>
                    {log.recordLabel && <span className="text-[10px] text-muted-foreground">→ {log.recordLabel}</span>}
                    <span className="text-[10px] text-muted-foreground font-mono">{log.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── AI Security Assistant Tab ─────────────────────────────────────────────────
type AIMsgType = { role: "user" | "assistant"; text: string };

const aiQueries = [
  { label: "Who viewed student addresses this month?", key: "address" },
  { label: "Which teachers modified marks after deadlines?", key: "marks" },
  { label: "Attendance changes for Grade 10 this week", key: "attendance" },
  { label: "Users accessing sensitive data most often", key: "sensitive" },
  { label: "Analyze failed login attempts", key: "failed" },
];

function AISecurityTab() {
  const [messages, setMessages] = useState<AIMsgType[]>([
    { role: "assistant", text: "🔐 **AI Security Assistant** — I can analyze audit logs, detect suspicious patterns, and answer compliance questions.\n\nTry asking me about sensitive data accesses, grade changes, login anomalies, or any specific user's activity." }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = (text?: string) => {
    const q = (text || input).trim();
    if (!q) return;
    setMessages((p) => [...p, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const lq = q.toLowerCase();
      let response = aiSecurityResponses.address;
      if (lq.includes("mark") || lq.includes("grade") || lq.includes("deadline")) response = aiSecurityResponses.marks;
      else if (lq.includes("attendance") || lq.includes("grade 10")) response = aiSecurityResponses.attendance;
      else if (lq.includes("sensitive") || lq.includes("most often") || lq.includes("access")) response = aiSecurityResponses.sensitive;
      else if (lq.includes("failed") || lq.includes("login")) response = aiSecurityResponses.failed;
      else if (lq.includes("address") || lq.includes("viewed")) response = aiSecurityResponses.address;
      setMessages((p) => [...p, { role: "assistant", text: response }]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {aiQueries.map((q) => (
          <button key={q.key} onClick={() => send(q.label)}
            className="text-xs px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
            {q.label}
          </button>
        ))}
      </div>

      <Card className="min-h-96">
        <CardContent className="p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
              {m.role === "assistant" && (
                <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <Shield className="h-3.5 w-3.5 text-indigo-600" />
                </div>
              )}
              <div className={cn("max-w-[85%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-line leading-relaxed", m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm")}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Shield className="h-3.5 w-3.5 text-indigo-600" />
              </div>
              <div className="bg-muted rounded-xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask a security or compliance question..." className="h-9 text-sm" />
        <Button size="sm" onClick={() => send()} className="gap-2 px-4">
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

