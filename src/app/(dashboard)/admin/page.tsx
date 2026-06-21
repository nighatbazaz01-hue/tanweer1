"use client";
import {
  Users, GraduationCap, DollarSign, UserCheck, TrendingUp,
  AlertTriangle, Sparkles, Heart, ArrowUpRight, ArrowDownRight,
  Shield, Activity, Eye, Edit3, LogIn, BookOpen, Send,
  Download, Lock, Megaphone, Calendar, FileText, X,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendArea, GroupedBar, DonutChart, HorizontalBar } from "@/components/charts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useUIStore } from "@/store/useUIStore";
import { useDataStore } from "@/store/useDataStore";
import {
  adminStats, attendanceTrend, feeCollectionTrend, teacherAttendanceTrend,
  admissionFunnel, gradeDistribution, atRiskStudents, parentSatisfactionData, recentAlerts,
} from "@/lib/mockData/admin";
import { getAllStudents } from "@/lib/mockData/population";
import { getActivityTimeline, securityMetrics, type AuditAction } from "@/lib/mockData/auditLogs";
import { cn } from "@/lib/utils";

const activityIcon: Partial<Record<AuditAction, React.ElementType>> = {
  LOGIN: LogIn, LOGOUT: Lock, LOGIN_FAILED: AlertTriangle,
  STUDENT_PROFILE_VIEWED: Eye, TEACHER_PROFILE_VIEWED: Eye,
  ATTENDANCE_MARKED: UserCheck, ATTENDANCE_EDITED: Edit3,
  MARKS_ENTERED: BookOpen, MARKS_EDITED: Edit3,
  FEE_VIEWED: DollarSign, FEE_MODIFIED: DollarSign, FEE_PAYMENT_RECORDED: DollarSign,
  MESSAGE_SENT: Send, ANNOUNCEMENT_CREATED: Megaphone, MEETING_CREATED: Calendar,
  REPORT_GENERATED: FileText, DATA_EXPORTED: Download,
  SENSITIVE_ADDRESS_VIEWED: Eye, SENSITIVE_PHONE_VIEWED: Eye,
};

const severityDot: Record<string, string> = {
  critical: "bg-red-500", high: "bg-amber-500",
  medium: "bg-yellow-400", low: "bg-blue-400", info: "bg-slate-300",
};

const alertSeverity: Record<string, "destructive" | "warning" | "info" | "success" | "secondary"> = {
  high: "destructive", medium: "warning", info: "info", positive: "success",
};

export default function AdminDashboard() {
  const { toggleAiDrawer } = useUIStore();
  const { students, feeRecords, attendanceRecords, schoolConfig } = useDataStore();
  const feeCollectionRate = useMemo(() => {
    if (!feeRecords || feeRecords.length === 0) return adminStats.feeCollectionRate;
    const total = feeRecords.reduce((s, r) => s + r.amount, 0);
    const paid  = feeRecords.reduce((s, r) => s + r.paidAmount, 0);
    return total > 0 ? Math.round((paid / total) * 100) : adminStats.feeCollectionRate;
  }, [feeRecords]);

  const liveAttendanceRate = useMemo(() => {
    if (!attendanceRecords || attendanceRecords.length === 0) return adminStats.attendanceRate;
    const present = attendanceRecords.filter((r) => r.status === "present").length;
    return Math.round((present / attendanceRecords.length) * 100);
  }, [attendanceRecords]);

  const liveTeacherRate  = adminStats.teacherAttendanceRate;
  const liveParentSat    = useMemo(() => {
    const avg = parentSatisfactionData.reduce((s, d) => s + d.score, 0) / parentSatisfactionData.length;
    return avg.toFixed(1);
  }, []);
  const feeCollectedDisplay = useMemo(() => {
    const paid = feeRecords.reduce((s, r) => s + r.paidAmount, 0);
    if (paid === 0) return "—";
    const m = paid / 1_000_000;
    return m >= 1 ? `₹${m.toFixed(2)}M` : `₹${Math.round(paid / 1000).toLocaleString()}K`;
  }, [feeRecords]);
  const liveGradeDistribution = useMemo(() => {
    const colors = ["#34d399", "#60a5fa", "#a78bfa", "#f59e0b"];
    const ranges = [
      { label: "Grade 1-3",   min: 1,  max: 3  },
      { label: "Grade 4-6",   min: 4,  max: 6  },
      { label: "Grade 7-9",   min: 7,  max: 9  },
      { label: "Grade 10-12", min: 10, max: 12 },
    ];
    return ranges.map((r, i) => ({
      grade:    r.label,
      students: students.filter((s) => { const g = parseInt(String(s.grade)); return g >= r.min && g <= r.max; }).length,
      color:    colors[i],
    }));
  }, [students]);

  const activityFeed = getActivityTimeline(20);
  const feeChartData = feeCollectionTrend.map((d) => ({
    ...d,
    collected: Math.round(d.collected / 1000),
    target: Math.round(d.target / 1000),
  }));

  // At-risk students derived from shared population + admin mock data
  const extendedAtRiskList = useMemo(() => {
    const fromPop = students
      .filter((s) => s.performanceTier === "at-risk")
      .slice(0, 15)
      .map((s) => ({
        id: s.id,
        name: s.name,
        grade: `Grade ${s.grade}-${s.section}`,
        risk: s.attendanceRate < 80 ? "Low Attendance + Academic" : "Academic Decline",
        score: Math.round(70 + (1 - s.gpa / 4) * 30),
        avatar: s.avatar,
      }));
    // Merge with admin curated list (admin list takes priority by id)
    const adminIds = new Set(atRiskStudents.map((s) => s.id));
    const merged = [
      ...atRiskStudents,
      ...fromPop.filter((s) => !adminIds.has(s.id)).slice(0, 8 - atRiskStudents.length),
    ];
    return merged;
  }, [students]);

  const fullTimeline = getActivityTimeline(50);

  const kpiCards = [
    { title: "School Health Score", value: `${adminStats.schoolHealthScore}/100`, sub: "Overall platform score", icon: Heart, color: "bg-violet-500", trend: { v: 3, up: true } },
    { title: "Total Students", value: students.length.toLocaleString(), sub: "Active enrollments", icon: Users, color: "bg-blue-500", trend: { v: 5.2, up: true } },
    { title: "Fee Collection", value: `${feeCollectionRate}%`, sub: `${feeCollectedDisplay} collected`, icon: DollarSign, color: "bg-emerald-500", trend: { v: 2.1, up: false } },
    { title: "Attendance Rate", value: `${liveAttendanceRate}%`, sub: "School-wide today", icon: UserCheck, color: "bg-amber-500", trend: { v: 1.3, up: true } },
    { title: "Teacher Attendance", value: `${adminStats.teacherAttendanceRate}%`, sub: `${adminStats.totalTeachers} total teachers`, icon: GraduationCap, color: "bg-sky-500", trend: { v: 0.5, up: true } },
    { title: "Parent Satisfaction", value: `${liveParentSat}/5`, sub: "Avg rating this month", icon: Heart, color: "bg-pink-500", trend: { v: 0.2, up: true } },
    { title: "New Admissions", value: adminStats.newLeadsThisMonth, sub: `${adminStats.enrolledThisMonth} enrolled`, icon: TrendingUp, color: "bg-indigo-500", trend: { v: 12, up: true } },
    { title: "At-Risk Students", value: extendedAtRiskList.length, sub: "Needs intervention", icon: AlertTriangle, color: "bg-red-500", trend: { v: 4, up: false } },
  ];

  const [atRiskOpen, setAtRiskOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Principal Dashboard"
        description={`${schoolConfig.name} — Real-time school operations overview`}
        breadcrumbs={[{ label: "Admin" }, { label: "Dashboard" }]}
        actions={
          <Button onClick={toggleAiDrawer} size="sm" className="gap-2 bg-violet-600 hover:bg-violet-700">
            <Sparkles className="h-4 w-4" />
            AI Executive Assistant
          </Button>
        }
      />

      {/* Health Score Banner */}
      <div className="rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-sm font-medium">School Health Score</p>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-5xl font-bold">87</span>
              <span className="text-2xl text-violet-200 mb-1">/100</span>
              <Badge className="mb-1.5 bg-white/20 text-white border-white/30 hover:bg-white/20">
                ↑ 3 pts this month
              </Badge>
            </div>
            <p className="text-violet-200 text-sm mt-2">Good — Minor attention needed on fee collection &amp; at-risk students</p>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3 text-center">
            {[
              { label: "Attendance",   val: `${liveAttendanceRate}%`,       ok: liveAttendanceRate >= 90            },
              { label: "Fees",         val: `${feeCollectionRate}%`,         ok: feeCollectionRate >= 85             },
              { label: "Teachers",     val: `${liveTeacherRate}%`,           ok: liveTeacherRate >= 90               },
              { label: "Satisfaction", val: `${liveParentSat}/5`,            ok: parseFloat(liveParentSat) >= 4.0   },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-lg px-4 py-2">
                <p className="text-lg font-bold">{s.val}</p>
                <p className="text-xs text-violet-200">{s.label}</p>
                <span className="text-xs">{s.ok ? "✅" : "⚠️"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpiCards.map((k) => (
          <Card key={k.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{k.title}</p>
                  <p className="text-xl font-bold">{k.value}</p>
                  <p className="text-xs text-muted-foreground">{k.sub}</p>
                  <p className={`text-xs font-medium flex items-center gap-0.5 ${k.trend.up ? "text-emerald-600" : "text-red-500"}`}>
                    {k.trend.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {k.trend.v}%
                  </p>
                </div>
                <div className={`rounded-lg p-2 shrink-0 ${k.color}`}>
                  <k.icon className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Attendance Trend — 6 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendArea
              data={attendanceTrend}
              xKey="month"
              lines={[
                { key: "present", color: "#34d399", label: "Present %" },
                { key: "absent", color: "#f87171", label: "Absent %" },
              ]}
              legend
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Fee Collection vs. Target (₹ 000s)</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupedBar
              data={feeChartData}
              xKey="month"
              bars={[
                { key: "collected", color: "#6366f1", label: "Collected" },
                { key: "target", color: "#e2e8f0", label: "Target" },
              ]}
              legend
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Admissions Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={admissionFunnel.map((d) => ({ name: d.stage, value: d.count, color: d.color }))}
              height={180}
            />
            <div className="mt-3 space-y-1.5">
              {admissionFunnel.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-muted-foreground">{s.stage}</span>
                  </div>
                  <span className="font-semibold">{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={liveGradeDistribution.map((d) => ({ name: d.grade, value: d.students, color: d.color }))}
              height={180}
            />
            <div className="mt-3 space-y-1.5">
              {liveGradeDistribution.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-muted-foreground">{s.grade}</span>
                  </div>
                  <span className="font-semibold">{s.students}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Parent Satisfaction Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBar
              data={parentSatisfactionData.map((d) => ({ name: d.category, value: d.score * 20, color: "#6366f1" }))}
              height={200}
              max={100}
            />
          </CardContent>
        </Card>
      </div>

      {/* At-Risk Students + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">At-Risk Students</CardTitle>
            <Button variant="outline" size="sm" className="text-xs h-7"
              onClick={() => setAtRiskOpen(true)}>View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {atRiskStudents.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs bg-red-100 text-red-700 font-semibold">{s.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.grade} · {s.risk}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-red-600">{s.score}%</p>
                  <p className="text-xs text-muted-foreground">risk</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">AI Alerts &amp; Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                  alert.severity === "high" ? "bg-red-500" :
                  alert.severity === "medium" ? "bg-amber-500" :
                  alert.severity === "positive" ? "bg-emerald-500" : "bg-blue-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                </div>
                <Badge variant={alertSeverity[alert.severity]} className="shrink-0 text-xs">
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Teacher Attendance Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Teacher Attendance Rate — 6 Months</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendArea
            data={teacherAttendanceTrend}
            xKey="month"
            lines={[{ key: "rate", color: "#6366f1", label: "Attendance %" }]}
            height={160}
          />
        </CardContent>
      </Card>

      {/* Security Overview + Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="border-indigo-100">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-600" /> Security Overview
            </CardTitle>
            <Link href="/audit">
              <Button variant="outline" size="sm" className="text-xs h-7">View Audit</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Total Audit Logs", value: securityMetrics.totalLogs.toLocaleString(), color: "text-indigo-600" },
              { label: "Today's Actions", value: securityMetrics.todayLogs, color: "text-blue-600" },
              { label: "Failed Logins", value: securityMetrics.failedLogins, color: "text-red-600" },
              { label: "Sensitive Accesses", value: securityMetrics.sensitiveAccesses, color: "text-amber-600" },
              { label: "Grade Changes", value: securityMetrics.gradeChanges, color: "text-violet-600" },
              { label: "Data Exports", value: securityMetrics.dataExports, color: "text-orange-600" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{s.label}</span>
                <span className={cn("font-bold", s.color)}>{s.value}</span>
              </div>
            ))}
            {securityMetrics.criticalAlerts > 0 && (
              <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                <p className="text-xs text-red-700 font-medium">{securityMetrics.criticalAlerts} critical alerts pending review</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              Live Activity Feed
              <Badge className="text-[10px] bg-emerald-100 text-emerald-700 ml-1">Live</Badge>
            </CardTitle>
            <Button variant="outline" size="sm" className="text-xs h-7"
              onClick={() => setTimelineOpen(true)}>Full Timeline</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {activityFeed.map((entry) => {
                const Icon = activityIcon[entry.action] ?? Activity;
                const isSensitive = ["SENSITIVE_ADDRESS_VIEWED","SENSITIVE_PHONE_VIEWED","SENSITIVE_FEE_RECORD_VIEWED","DATA_EXPORTED","FEE_MODIFIED","MARKS_EDITED","LOGIN_FAILED"].includes(entry.action);
                return (
                  <div key={entry.id} className={cn("flex items-start gap-2.5 p-2.5 rounded-lg transition-all", isSensitive ? "bg-amber-50 border border-amber-100" : "hover:bg-muted/50")}>
                    <div className={cn("p-1.5 rounded-lg shrink-0", isSensitive ? "bg-amber-100" : "bg-muted")}>
                      <Icon className={cn("h-3 w-3", isSensitive ? "text-amber-700" : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold truncate">{entry.userName}</span>
                        <Badge variant="secondary" className="text-[9px] px-1 py-0">{entry.userRole}</Badge>
                        {isSensitive && <Badge className="text-[9px] px-1 py-0 bg-amber-100 text-amber-700">⚠ Sensitive</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{entry.details}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", severityDot[entry.severity])} />
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{entry.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* At-Risk Full List Dialog — derived from shared store + admin data */}
      <Dialog open={atRiskOpen} onOpenChange={setAtRiskOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              At-Risk Students — {extendedAtRiskList.length} shown
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2.5 max-h-96 overflow-y-auto py-2">
            {extendedAtRiskList.map((s, i) => (
              <div key={s.id || i} className="flex items-center gap-3 p-3 rounded-lg border">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="text-xs bg-red-100 text-red-700 font-semibold">{s.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.grade} · {s.risk}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-red-600">{s.score}%</p>
                  <p className="text-xs text-muted-foreground">risk</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAtRiskOpen(false)} className="gap-1">
              <X className="h-4 w-4" /> Close
            </Button>
            <Link href="/ai-insights">
              <Button className="gap-1">
                <Sparkles className="h-4 w-4" /> View AI Insights
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Timeline Dialog */}
      <Dialog open={timelineOpen} onOpenChange={setTimelineOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-600" /> Full Activity Timeline
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[28rem] overflow-y-auto py-2 pr-1">
            {fullTimeline.map((entry) => {
              const Icon = activityIcon[entry.action] ?? Activity;
              const isSensitive = ["SENSITIVE_ADDRESS_VIEWED","SENSITIVE_PHONE_VIEWED","DATA_EXPORTED","FEE_MODIFIED","MARKS_EDITED","LOGIN_FAILED"].includes(entry.action);
              return (
                <div key={entry.id} className={cn("flex items-start gap-2.5 p-2.5 rounded-lg", isSensitive ? "bg-amber-50 border border-amber-100" : "bg-muted/40")}>
                  <div className={cn("p-1.5 rounded-lg shrink-0", isSensitive ? "bg-amber-100" : "bg-muted")}>
                    <Icon className={cn("h-3 w-3", isSensitive ? "text-amber-700" : "text-muted-foreground")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold">{entry.userName}</span>
                      <Badge variant="secondary" className="text-[9px] px-1 py-0">{entry.userRole}</Badge>
                      {isSensitive && <Badge className="text-[9px] px-1 py-0 bg-amber-100 text-amber-700">⚠ Sensitive</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{entry.details}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={cn("h-1.5 w-1.5 rounded-full", severityDot[entry.severity])} />
                    <span className="text-[10px] text-muted-foreground">{entry.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTimelineOpen(false)} className="gap-1">
              <X className="h-4 w-4" /> Close
            </Button>
            <Link href="/audit">
              <Button className="gap-1">
                <Shield className="h-4 w-4" /> Full Audit Center
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
