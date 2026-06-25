"use client";
import { useState, useMemo, useCallback } from "react";
import {
  User, BookOpen, ClipboardList, FileText, MessageSquare,
  DollarSign, Sparkles, Star, TrendingUp, TrendingDown,
  CheckCircle, Award, Brain, ArrowLeft, Lock, Heart,
  AlertTriangle, Shield, Phone, Eye, Calendar, UserPlus,
  ChevronRight, Plus, Clock, CheckCircle2,
  Zap, MapPin, Droplets, Flag, GraduationCap, Users,
  ShieldAlert,
} from "lucide-react";
import { useRoleStore } from "@/store/useRoleStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useDataStore } from "@/store/useDataStore";
import { useUIStore } from "@/store/useUIStore";
import { PinGate } from "@/components/common/PinGate";
import { getPinForRole } from "@/lib/mockData/credentials";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendLine, TrendArea, SubjectRadar, DonutChart } from "@/components/charts";
import {
  student360, academicPerformance, attendanceHistory, homeworkCompletion,
  projects360, teacherRemarks, communicationHistory, feeHistory, aiSummary,
} from "@/lib/mockData/student360";
import type { InterventionType } from "@/lib/mockData/interventions";
import { cn } from "@/lib/utils";

// ─── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",       label: "Overview",         icon: User          },
  { id: "academic",       label: "Academic",          icon: BookOpen      },
  { id: "attendance",     label: "Attendance",        icon: ClipboardList },
  { id: "mbs",            label: "Mind·Body·Soul",    icon: Brain         },
  { id: "behaviour",      label: "Behaviour",         icon: Star          },
  { id: "interventions",  label: "Interventions",     icon: ShieldAlert   },
  { id: "communication",  label: "Parent & Comms",    icon: MessageSquare },
  { id: "ai",             label: "AI Insights",       icon: Sparkles      },
  { id: "fees",           label: "Fees",              icon: DollarSign    },
  { id: "homework",       label: "Homework",          icon: FileText      },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function scoreColor(s: number) {
  return s < 65 ? "text-red-600" : s < 78 ? "text-amber-600" : "text-emerald-600";
}
function scoreBg(s: number) {
  return s < 65 ? "bg-red-50" : s < 78 ? "bg-amber-50" : "bg-emerald-50";
}
function riskLabel(s: number) {
  return s < 65 ? "At Risk" : s < 78 ? "Monitor" : "Healthy";
}

const radarData = [
  { subject: "Math",      score: 82 },
  { subject: "English",   score: 87 },
  { subject: "Physics",   score: 79 },
  { subject: "Chemistry", score: 84 },
  { subject: "Urdu",      score: 91 },
  { subject: "CS",        score: 88 },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Student360Page() {
  const params    = useParams();
  const studentId = Array.isArray(params.id) ? params.id[0] : (params.id ?? "");

  const { activeRole }                    = useRoleStore();
  const { user }                          = useAuthStore();
  const { students, interventions, createIntervention, feeRecords } = useDataStore();
  const { setAIPromptWithMode }           = useUIStore();
  const correctPin                        = getPinForRole(activeRole as Parameters<typeof getPinForRole>[0]) ?? "";

  const [activeTab,    setActiveTab]    = useState("overview");
  const [actionToast,  setActionToast]  = useState<string | null>(null);

  // ── Resolve student ──────────────────────────────────────────────────────────
  const storeStudent = useMemo(
    () => students.find((s) => s.id === studentId) ?? null,
    [students, studentId]
  );

  // Effective display values — use store data where available, fall back to demo
  const S = useMemo(() => ({
    name:           storeStudent?.name            ?? student360.name,
    id:             storeStudent?.id              ?? student360.studentId,
    grade:          storeStudent ? `Grade ${storeStudent.grade}-${storeStudent.section}` : student360.grade,
    gradeNum:       storeStudent?.grade           ?? 10,
    section:        storeStudent?.section         ?? ("A" as "A" | "B" | "C" | "D"),
    avatar:         storeStudent
      ? storeStudent.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
      : "AA",
    gpa:            storeStudent?.gpa             ?? student360.gpa,
    attendance:     storeStudent?.attendanceRate  ?? student360.attendanceRate,
    perf:           storeStudent?.performanceTier ?? "average",
    parentName:     storeStudent?.parentName      ?? student360.parentName,
    parentPhone:    storeStudent?.parentPhone     ?? student360.parentPhone,
    parentEmail:    storeStudent?.parentEmail     ?? student360.parentEmail,
    address:        storeStudent?.address         ?? student360.address,
    phone:          storeStudent?.phone           ?? student360.phone,
    email:          storeStudent?.email           ?? student360.email,
    bloodType:      storeStudent?.bloodType       ?? student360.bloodGroup,
    nationality:    storeStudent?.nationality     ?? "Indian",
    interests:      storeStudent?.interests       ?? ["Chess", "Coding", "Reading"],
    enrolledYear:   storeStudent?.enrolledYear    ?? 2022,
    medicalNote:    storeStudent?.medicalNote,
    mindScore:      storeStudent?.mindScore       ?? 82,
    bodyScore:      storeStudent?.bodyScore       ?? 78,
    soulScore:      storeStudent?.soulScore       ?? 85,
    holisticScore:  storeStudent?.holisticScore   ?? 82,
  }), [storeStudent]);

  // ── Risk determination ───────────────────────────────────────────────────────
  const riskLevel = useMemo(() => {
    const h = S.holisticScore, a = S.attendance, p = S.perf;
    if (h < 60 || (a < 75 && p === "at-risk")) return "critical" as const;
    if (h < 65 || a < 85 || p === "at-risk")   return "at-risk"  as const;
    if (h < 78 || a < 90)                       return "monitor"  as const;
    return null;
  }, [S.holisticScore, S.attendance, S.perf]);

  const riskReasons = useMemo(() => {
    const r: string[] = [];
    if (S.holisticScore < 65)  r.push(`Holistic wellbeing score: ${S.holisticScore}/100 (below 65 threshold)`);
    if (S.attendance < 85)     r.push(`Attendance: ${S.attendance}% (below 85% minimum threshold)`);
    if (S.perf === "at-risk")  r.push("Academic performance tier: At Risk");
    return r;
  }, [S.holisticScore, S.attendance, S.perf]);

  // ── Student interventions ────────────────────────────────────────────────────
  const studentInterventions = useMemo(
    () => interventions.filter((i) => i.studentId === studentId),
    [interventions, studentId]
  );

  // ── Fee summary ──────────────────────────────────────────────────────────────
  const feeSummary = useMemo(() => {
    const recs = feeRecords.filter((r) => r.studentId === studentId);
    if (recs.length > 0) {
      const totalPaid   = recs.reduce((s, r) => s + r.paidAmount, 0);
      const outstanding = Math.max(0, recs.reduce((s, r) => s + r.amount, 0) - totalPaid);
      const unpaid      = recs.find((r) => r.status !== "paid");
      return { totalPaid, outstanding, nextDue: unpaid?.dueDate ?? "Oct 30, 2026" };
    }
    const totalPaid = feeHistory.reduce((s, f) => s + f.amount, 0);
    return { totalPaid, outstanding: 0, nextDue: "Oct 30, 2026" };
  }, [feeRecords, studentId]);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  }, []);

  const handleAIAction = useCallback((type: InterventionType, title: string) => {
    createIntervention({
      studentId:        studentId && studentId !== "1" ? studentId : "STU-DEMO-001",
      studentName:      S.name,
      studentGrade:     S.gradeNum,
      studentSection:   S.section,
      type,
      title,
      description:      `AI-recommended: ${title} for ${S.name}`,
      priority:         "High",
      status:           "Open",
      responsibleStaff: "Class Teacher",
      createdBy:        user?.name ?? "AI System",
      createdByRole:    activeRole,
      dueDate:          "Jul 30, 2026",
      parentAcknowledged:  false,
      meetingRequested:    type === "Parent Meeting",
    }, user?.name ?? activeRole);
    showToast(`✅ "${title}" created and assigned`);
    setActiveTab("interventions");
  }, [createIntervention, studentId, S, user, activeRole, showToast]);

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 pb-10">

      {/* Back */}
      <div>
        <Link href="/students">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Students
          </Button>
        </Link>
      </div>

      {/* ── Risk Banner ─────────────────────────────────────────────────────── */}
      {riskLevel && (
        <div className={cn(
          "rounded-2xl border p-5 flex items-start gap-4",
          riskLevel === "critical" ? "bg-red-50 border-red-300"
            : riskLevel === "at-risk" ? "bg-orange-50 border-orange-300"
              : "bg-amber-50 border-amber-300"
        )}>
          <AlertTriangle className={cn(
            "h-6 w-6 mt-0.5 shrink-0",
            riskLevel === "critical" ? "text-red-600"
              : riskLevel === "at-risk" ? "text-orange-600" : "text-amber-600"
          )} />
          <div className="flex-1 min-w-0">
            <p className={cn(
              "font-bold text-sm",
              riskLevel === "critical" ? "text-red-800"
                : riskLevel === "at-risk" ? "text-orange-800" : "text-amber-800"
            )}>
              {riskLevel === "critical"
                ? "🔴 Critical Alert — Immediate Action Required"
                : riskLevel === "at-risk"
                  ? "⚠️ Student Risk Alert — Intervention Recommended"
                  : "🟡 Student Monitoring Alert — Watch Closely"}
            </p>
            <div className="mt-1.5 space-y-0.5">
              {riskReasons.map((r, i) => (
                <p key={i} className={cn(
                  "text-xs",
                  riskLevel === "critical" ? "text-red-700"
                    : riskLevel === "at-risk" ? "text-orange-700" : "text-amber-700"
                )}>• {r}</p>
              ))}
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Button size="sm" variant="destructive" className="h-7 text-xs gap-1.5"
                onClick={() => handleAIAction("Parent Meeting", "Urgent Parent Meeting — Risk Alert")}>
                <Phone className="h-3 w-3" /> Contact Parent
              </Button>
              <Button size="sm" variant="outline"
                className="h-7 text-xs gap-1.5 border-amber-400 text-amber-800 hover:bg-amber-50"
                onClick={() => handleAIAction("Wellbeing Support", "Wellbeing Check-In — Risk Alert")}>
                <Heart className="h-3 w-3" /> Wellbeing Check-In
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5"
                onClick={() => setActiveTab("interventions")}>
                <Eye className="h-3 w-3" /> View Interventions
              </Button>
            </div>
          </div>
          {studentInterventions.filter((i) => i.status === "Open" || i.status === "In Progress").length > 0 && (
            <Badge variant="destructive" className="shrink-0 text-xs">
              {studentInterventions.filter((i) => i.status === "Open" || i.status === "In Progress").length} Active
            </Badge>
          )}
        </div>
      )}

      {/* ── Profile Banner ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-6 text-white">
        <div className="flex items-start gap-5 flex-wrap">
          <Avatar className="h-20 w-20 ring-4 ring-white/20 shadow-xl shrink-0">
            <AvatarFallback className="text-2xl font-bold bg-violet-600 text-white">{S.avatar}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{S.name}</h1>
              <Badge className={cn(
                "border-0 text-white text-xs",
                riskLevel === "critical" ? "bg-red-500"
                  : riskLevel === "at-risk" ? "bg-orange-500"
                    : riskLevel === "monitor" ? "bg-amber-500"
                      : "bg-emerald-500"
              )}>
                {riskLevel === "critical" ? "Critical"
                  : riskLevel === "at-risk" ? "At Risk"
                    : riskLevel === "monitor" ? "Monitor"
                      : "Active"}
              </Badge>
              {S.perf === "top" && <Badge className="bg-violet-500 border-0 text-white text-xs">Top Performer</Badge>}
            </div>
            <p className="text-slate-300 mt-1 text-sm">{S.id} · {S.grade}</p>
            <div className="flex items-center gap-4 mt-3 flex-wrap text-xs text-slate-300">
              <span className="flex items-center gap-1.5"><Droplets className="h-3.5 w-3.5" /> {S.bloodType}</span>
              <span className="flex items-center gap-1.5"><Flag className="h-3.5 w-3.5" /> {S.nationality}</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> Enrolled {S.enrolledYear}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { label: "GPA",        value: S.gpa.toFixed(1),     sub: S.gpa >= 3.5 ? "A" : S.gpa >= 3.0 ? "B+" : "B" },
              { label: "Rank",       value: "7 / 32",              sub: "Class"  },
              { label: "Attendance", value: `${S.attendance}%`,    sub: "Rate"   },
              { label: "MBS Score",  value: `${S.holisticScore}`,  sub: "/100"   },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl px-3 py-2.5">
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-[11px] text-slate-300">{stat.label}</p>
                <p className="text-[11px] text-slate-400">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact row */}
        <div className="flex items-center gap-5 mt-4 pt-4 border-t border-white/10 flex-wrap text-xs text-slate-300">
          <PinGate correctPin={correctPin} role={activeRole} actor={user?.name || activeRole} field="Student Email" inline>
            <span>📧 {S.email}</span>
          </PinGate>
          <PinGate correctPin={correctPin} role={activeRole} actor={user?.name || activeRole} field="Student Phone" inline>
            <span>📱 {S.phone}</span>
          </PinGate>
          <PinGate correctPin={correctPin} role={activeRole} actor={user?.name || activeRole} field="Home Address" inline>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{S.address}</span>
          </PinGate>
          <span>👤 Parent: {S.parentName} ·{" "}
            <PinGate correctPin={correctPin} role={activeRole} actor={user?.name || activeRole} field="Parent Phone" inline>
              <span>{S.parentPhone}</span>
            </PinGate>
          </span>
        </div>

        {/* Interests */}
        {S.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/10">
            {S.interests.map((interest) => (
              <span key={interest} className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                {interest}
              </span>
            ))}
          </div>
        )}
        {S.medicalNote && (
          <p className="text-xs text-amber-300 mt-3 pt-3 border-t border-white/10">⚕ Medical: {S.medicalNote}</p>
        )}
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.id === "interventions" && studentInterventions.filter((i) => i.status !== "Completed").length > 0 && (
                <span className="ml-0.5 bg-red-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full leading-none">
                  {studentInterventions.filter((i) => i.status !== "Completed").length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          OVERVIEW TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {/* Quick stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Overall GPA", value: S.gpa.toFixed(2), sub: S.gpa >= 3.5 ? "Grade A" : "Grade B+",
                color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200",
              },
              {
                label: "Attendance", value: `${S.attendance}%`, sub: "This term",
                color: S.attendance < 85 ? "text-red-600" : "text-emerald-600",
                bg: S.attendance < 85 ? "bg-red-50" : "bg-emerald-50",
                border: S.attendance < 85 ? "border-red-200" : "border-emerald-200",
              },
              {
                label: "Holistic Score", value: String(S.holisticScore), sub: riskLabel(S.holisticScore),
                color: scoreColor(S.holisticScore), bg: scoreBg(S.holisticScore), border: "border-amber-200",
              },
              {
                label: "Class Rank", value: "7 / 32", sub: "Grade 10-A",
                color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200",
              },
            ].map((s) => (
              <Card key={s.label} className={cn("border", s.bg, s.border)}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                  <p className={cn("text-3xl font-bold mt-1", s.color)}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Academic Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrendLine
                    data={academicPerformance}
                    xKey="term"
                    lines={[
                      { key: "math",    color: "#6366f1", label: "Math"    },
                      { key: "english", color: "#f59e0b", label: "English" },
                      { key: "urdu",    color: "#f87171", label: "Urdu"    },
                      { key: "avg",     color: "#34d399", label: "Average" },
                    ]}
                    legend
                    height={200}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Monthly Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrendArea
                    data={attendanceHistory}
                    xKey="month"
                    lines={[{ key: "rate", color: "#34d399", label: "Attendance %" }]}
                    height={160}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-5">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Subject Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <SubjectRadar data={radarData} height={220} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Attendance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <DonutChart
                    data={[
                      { name: "Present", value: 178, color: "#34d399" },
                      { name: "Absent",  value: 8,   color: "#f87171" },
                      { name: "Late",    value: 3,   color: "#f59e0b" },
                    ]}
                    height={150}
                    innerRadius={35}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* MBS snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Mind",     score: S.mindScore,     icon: Brain, color: "text-blue-600",   bg: "bg-blue-50 border-blue-200"   },
              { label: "Body",     score: S.bodyScore,     icon: Heart, color: "text-rose-600",   bg: "bg-rose-50 border-rose-200"   },
              { label: "Soul",     score: S.soulScore,     icon: Star,  color: "text-violet-600", bg: "bg-violet-50 border-violet-200"},
              { label: "Holistic", score: S.holisticScore, icon: Zap,   color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" },
            ].map(({ label, score, icon: Icon, color, bg }) => (
              <button
                key={label}
                onClick={() => setActiveTab("mbs")}
                className={cn("rounded-xl border p-4 flex items-center gap-3 hover:shadow-md transition-all text-left", bg)}
              >
                <Icon className={cn("h-8 w-8 shrink-0", color)} />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className={cn("text-2xl font-bold", color)}>{score}</p>
                  <p className="text-[10px] text-muted-foreground">/100</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ACADEMIC TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "academic" && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Overall Average", value: "85.2%",  color: "text-violet-600", bg: "bg-violet-50" },
              { label: "Class Rank",      value: "7 / 32", color: "text-blue-600",   bg: "bg-blue-50"   },
              { label: "Improvement",     value: "+3.1%",  color: "text-emerald-600",bg: "bg-emerald-50" },
            ].map((s) => (
              <Card key={s.label} className={s.bg}>
                <CardContent className="p-4 text-center">
                  <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">5-Term Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendLine
                  data={academicPerformance}
                  xKey="term"
                  lines={[
                    { key: "math",      color: "#6366f1", label: "Math"      },
                    { key: "english",   color: "#f59e0b", label: "English"   },
                    { key: "physics",   color: "#60a5fa", label: "Physics"   },
                    { key: "chemistry", color: "#34d399", label: "Chemistry" },
                    { key: "urdu",      color: "#f87171", label: "Urdu"      },
                  ]}
                  legend
                  height={240}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Subject Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <SubjectRadar data={radarData} height={240} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Current Term Subject Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { subject: "Urdu Language",    score: 91, grade: "A",  teacher: "Mr. Aaqib Wani",  change: 3  },
                  { subject: "Computer Science", score: 88, grade: "A-", teacher: "Mr. Ravi Sharma",  change: 5  },
                  { subject: "English Language", score: 87, grade: "A-", teacher: "Ms. Neha Gupta",   change: 2  },
                  { subject: "Chemistry",        score: 84, grade: "A-", teacher: "Dr. Sunita Rao",   change: 6  },
                  { subject: "Mathematics",      score: 82, grade: "B+", teacher: "Dr. Priya Sharma", change: 4  },
                  { subject: "Physics",          score: 79, grade: "B+", teacher: "Mr. Imran Khan",   change: -1 },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium">{s.subject}</p>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-xs flex items-center gap-0.5", s.change > 0 ? "text-emerald-600" : "text-red-500")}>
                            {s.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {Math.abs(s.change)}
                          </span>
                          <Badge variant="secondary" className="text-xs">{s.grade}</Badge>
                          <span className="text-sm font-bold">{s.score}/100</span>
                        </div>
                      </div>
                      <div className="bg-muted rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.teacher}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="gap-2 text-violet-700 border-violet-300 hover:bg-violet-50"
              onClick={() => setAIPromptWithMode(
                `Provide a detailed academic analysis for ${S.name} (${S.grade}). GPA: ${S.gpa}, Attendance: ${S.attendance}%, Strongest: Urdu 91, Needs attention: Physics 79 (declining). Include subject-level recommendations and study strategies.`,
                "mind"
              )}>
              <Brain className="h-4 w-4" />
              AI Academic Analysis
            </Button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ATTENDANCE TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "attendance" && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Overall Rate",  value: `${S.attendance}%`,
                color: S.attendance < 85 ? "text-red-600" : "text-emerald-600",
                bg: S.attendance < 85 ? "bg-red-50" : "bg-emerald-50",
              },
              { label: "Total Present", value: "178 days", color: "text-blue-600",  bg: "bg-blue-50"  },
              { label: "Total Absent",  value: "11 days",  color: "text-red-600",   bg: "bg-red-50"   },
            ].map((s) => (
              <Card key={s.label} className={s.bg}>
                <CardContent className="p-4 text-center">
                  <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {S.attendance < 85 && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800">Attendance Risk Alert</p>
                <p className="text-xs text-red-700 mt-0.5">Below the 85% minimum threshold. Parent engagement and attendance plan required.</p>
              </div>
              <Button size="sm" variant="destructive" className="h-7 text-xs gap-1 shrink-0"
                onClick={() => handleAIAction("Attendance Concern", "Attendance Improvement Plan")}>
                <Plus className="h-3 w-3" /> Create Plan
              </Button>
            </div>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Monthly Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendArea
                data={attendanceHistory}
                xKey="month"
                lines={[{ key: "rate", color: "#34d399", label: "Attendance %" }]}
                height={220}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Month-by-Month Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attendanceHistory.map((m, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 items-center text-xs py-1.5 border-b last:border-0">
                    <span className="font-medium">{m.month}</span>
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${m.rate}%` }} />
                      </div>
                      <span className="font-semibold text-emerald-700 w-8">{m.rate}%</span>
                    </div>
                    <span className="text-center text-emerald-600">{m.present}P</span>
                    <span className={cn("text-center", m.absent > 0 ? "text-red-500" : "text-muted-foreground")}>
                      {m.absent}A / {m.late}L
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="gap-2 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
              onClick={() => setAIPromptWithMode(
                `Analyse ${S.name}'s attendance record of ${S.attendance}% for ${S.grade}. Identify risk patterns and recommend an attendance improvement plan including parent engagement strategies.`,
                "body"
              )}>
              <Heart className="h-4 w-4" />
              AI Attendance Analysis
            </Button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MIND · BODY · SOUL TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "mbs" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Mind Score",     score: S.mindScore,     icon: Brain, color: "text-blue-600",   bg: "bg-blue-50 border-blue-200",    mode: "mind"     as const, desc: "Academic & cognitive"     },
              { label: "Body Score",     score: S.bodyScore,     icon: Heart, color: "text-rose-600",   bg: "bg-rose-50 border-rose-200",    mode: "body"     as const, desc: "Wellness & attendance"    },
              { label: "Soul Score",     score: S.soulScore,     icon: Star,  color: "text-violet-600", bg: "bg-violet-50 border-violet-200", mode: "soul"     as const, desc: "Character & values"       },
              { label: "Holistic Score", score: S.holisticScore, icon: Zap,   color: "text-amber-600",  bg: "bg-amber-50 border-amber-200",  mode: "holistic" as const, desc: "Overall wellbeing"        },
            ].map(({ label, score, icon: Icon, color, bg, mode, desc }) => (
              <Card key={label} className={cn("border", bg)}>
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={cn("h-5 w-5", color)} />
                    <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                  </div>
                  <p className={cn("text-4xl font-bold", color)}>{score}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{desc}</p>
                  <div className="mt-2 bg-muted rounded-full h-1.5">
                    <div
                      className={cn("h-1.5 rounded-full", score < 65 ? "bg-red-400" : score < 78 ? "bg-amber-400" : "bg-emerald-400")}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className={cn(
                      "text-[10px]",
                      score < 65 ? "border-red-400 text-red-700"
                        : score < 78 ? "border-amber-400 text-amber-700"
                          : "border-emerald-400 text-emerald-700"
                    )}>
                      {riskLabel(score)}
                    </Badge>
                    <Button size="sm" variant="ghost" className={cn("h-6 text-[10px] px-2 gap-1", color)}
                      onClick={() => setAIPromptWithMode(
                        `Analyse ${S.name}&apos;s ${label} of ${score}/100${mode === "holistic" ? `. Mind: ${S.mindScore}, Body: ${S.bodyScore}, Soul: ${S.soulScore}` : ""}. Provide insights, strengths, risk areas, and recommendations.`,
                        mode
                      )}>
                      <Sparkles className="h-2.5 w-2.5" /> Analyse
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className={cn(
            "border",
            S.holisticScore < 65 ? "bg-red-50 border-red-200"
              : S.holisticScore < 78 ? "bg-amber-50 border-amber-200"
                : "bg-emerald-50 border-emerald-200"
          )}>
            <CardContent className="p-4 flex items-center gap-4">
              {S.holisticScore < 65
                ? <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
                : S.holisticScore < 78
                  ? <Eye className="h-6 w-6 text-amber-600 shrink-0" />
                  : <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              }
              <div className="flex-1">
                <p className={cn("font-semibold text-sm",
                  S.holisticScore < 65 ? "text-red-800" : S.holisticScore < 78 ? "text-amber-800" : "text-emerald-800")}>
                  Holistic Status: {riskLabel(S.holisticScore)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {S.holisticScore < 65
                    ? "Student requires immediate multi-dimensional intervention across Mind, Body, and Soul pillars."
                    : S.holisticScore < 78
                      ? "Student shows moderate risk. Regular monitoring and targeted support recommended."
                      : "Student is developing well across all three dimensions. Continue current support."}
                </p>
              </div>
              <Button size="sm" variant="outline" className="ml-auto shrink-0 gap-1.5"
                onClick={() => setAIPromptWithMode(
                  `Complete holistic Mind·Body·Soul analysis for ${S.name}: Mind ${S.mindScore}, Body ${S.bodyScore}, Soul ${S.soulScore}, Holistic ${S.holisticScore}/100. Attendance ${S.attendance}%. Provide a full wellbeing report with teacher, parent and counsellor actions.`,
                  "holistic"
                )}>
                <Sparkles className="h-4 w-4" /> Full Analysis
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              {
                label: "Mind — Academic",    icon: Brain, color: "text-blue-800",   bg: "border-blue-200 bg-blue-50",
                points: ["Urdu Language: 91/100 — exceptional", "Chemistry improving: +6 this term", "Physics declining: 79 (−1 point)", "Homework completion: 93% average"],
              },
              {
                label: "Body — Wellness",    icon: Heart, color: "text-rose-800",   bg: "border-rose-200 bg-rose-50",
                points: [`Attendance: ${S.attendance}% ${S.attendance >= 90 ? "— excellent" : S.attendance >= 85 ? "— satisfactory" : "— below threshold ⚠️"}`, "Current streak: 12 consecutive days", "Physical engagement: active", "No health concerns on file"],
              },
              {
                label: "Soul — Character",   icon: Star,  color: "text-violet-800", bg: "border-violet-200 bg-violet-50",
                points: ["Well integrated socially in class", "Positive peer relationships noted", "Leadership potential identified", "Participates in group activities"],
              },
            ].map(({ label, icon: Icon, color, bg, points }) => (
              <Card key={label} className={cn("border", bg)}>
                <CardHeader className="pb-2">
                  <CardTitle className={cn("text-xs font-semibold flex items-center gap-1.5", color)}>
                    <Icon className="h-4 w-4" /> {label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {points.map((p) => <p key={p} className={cn("text-xs", color)}>• {p}</p>)}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          BEHAVIOUR TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "behaviour" && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Behaviour Record", value: "Positive",    color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Leadership Roles", value: "1 Active",    color: "text-blue-600",    bg: "bg-blue-50"    },
              { label: "Achievements",     value: "3 This Term", color: "text-violet-600",  bg: "bg-violet-50"  },
            ].map((s) => (
              <Card key={s.label} className={s.bg}>
                <CardContent className="p-4 text-center">
                  <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Character Growth Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "Jun 8",  title: "Math Olympiad Nomination",        desc: "Nominated by Dr. Priya Sharma for Regional Math Olympiad",  icon: Award,   color: "text-amber-600",  bg: "bg-amber-50"   },
                  { date: "May 20", title: "Class Group Leader",              desc: "Volunteered and led the Chemistry group project",           icon: Users,   color: "text-blue-600",   bg: "bg-blue-50"    },
                  { date: "Apr 15", title: "Community Service",              desc: "Participated in school's community clean-up drive",          icon: Heart,   color: "text-rose-600",   bg: "bg-rose-50"    },
                  { date: "Mar 10", title: "Peer Tutoring",                  desc: "Helped 2 classmates catch up on missed Urdu content",       icon: BookOpen,color: "text-violet-600", bg: "bg-violet-50"  },
                ].map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-lg shrink-0", e.bg)}>
                      <e.icon className={cn("h-4 w-4", e.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{e.desc}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{e.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide pt-2">Teacher Remarks</h3>
          <div className="space-y-4">
            {teacherRemarks.map((r, i) => (
              <Card key={i} className={cn(
                "border-l-4",
                r.sentiment === "positive" ? "border-l-emerald-500"
                  : r.sentiment === "neutral" ? "border-l-amber-500" : "border-l-red-500"
              )}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-semibold">
                          {r.teacher.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{r.teacher}</p>
                        <p className="text-xs text-muted-foreground">{r.subject} · {r.date}</p>
                      </div>
                    </div>
                    <Badge
                      variant={r.sentiment === "positive" ? "success" : r.sentiment === "neutral" ? "warning" : "destructive"}
                      className="text-xs shrink-0"
                    >
                      {r.sentiment}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground italic border-l-2 border-muted pl-3">
                    &ldquo;{r.remark}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="gap-2 text-violet-700 border-violet-300 hover:bg-violet-50"
              onClick={() => setAIPromptWithMode(
                `Analyse ${S.name}'s Soul Score of ${S.soulScore}/100 and character development. Positive teacher remarks, leadership participation, peer integration. Provide character growth recommendations.`,
                "soul"
              )}>
              <Star className="h-4 w-4" />
              AI Character Analysis
            </Button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          INTERVENTIONS TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "interventions" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Open",        count: studentInterventions.filter((i) => i.status === "Open").length,        color: "text-red-600",    bg: "bg-red-50"    },
              { label: "In Progress", count: studentInterventions.filter((i) => i.status === "In Progress").length, color: "text-amber-600",  bg: "bg-amber-50"  },
              { label: "Completed",   count: studentInterventions.filter((i) => i.status === "Completed").length,   color: "text-emerald-600",bg: "bg-emerald-50"},
              { label: "Total",       count: studentInterventions.length,                                            color: "text-blue-600",   bg: "bg-blue-50"   },
            ].map((s) => (
              <Card key={s.label} className={s.bg}>
                <CardContent className="p-4 text-center">
                  <p className={cn("text-3xl font-bold", s.color)}>{s.count}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-dashed border-2">
            <CardContent className="p-4">
              <p className="text-sm font-semibold mb-3">Create New Intervention</p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { label: "Academic Support",   type: "Academic Support"   as InterventionType, cls: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"     },
                    { label: "Attendance Concern", type: "Attendance Concern" as InterventionType, cls: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
                    { label: "Wellbeing Support",  type: "Wellbeing Support"  as InterventionType, cls: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"     },
                    { label: "Behaviour Support",  type: "Behaviour Support"  as InterventionType, cls: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100" },
                    { label: "Parent Meeting",     type: "Parent Meeting"     as InterventionType, cls: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100" },
                    { label: "Counselling",        type: "Counselling"        as InterventionType, cls: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100" },
                  ]
                ).map(({ label, type, cls }) => (
                  <button
                    key={label}
                    onClick={() => handleAIAction(type, label)}
                    className={cn("flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all hover:shadow-sm active:scale-95", cls)}
                  >
                    <Plus className="h-3 w-3" />{label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {studentInterventions.length === 0 ? (
            <Card>
              <CardContent className="py-12 flex flex-col items-center text-center gap-3">
                <Shield className="h-10 w-10 text-muted-foreground/40" />
                <div>
                  <p className="font-semibold">No interventions recorded for this student</p>
                  <p className="text-sm text-muted-foreground mt-1">Use the buttons above to create one.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {studentInterventions.map((intv) => {
                const statusCls =
                  intv.status === "Open"         ? "bg-red-100 text-red-700"
                  : intv.status === "In Progress" ? "bg-amber-100 text-amber-700"
                  : intv.status === "Completed"   ? "bg-emerald-100 text-emerald-700"
                  : intv.status === "Escalated"   ? "bg-red-200 text-red-800"
                  : "bg-slate-100 text-slate-700";
                const priVariant = intv.priority === "Critical" ? "destructive" : intv.priority === "High" ? "warning" : "secondary";
                return (
                  <Card key={intv.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-semibold text-sm">{intv.title}</p>
                          <p className="text-xs text-muted-foreground">{intv.type} · Created {intv.createdAt}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={priVariant as "destructive" | "warning" | "secondary"} className="text-xs">{intv.priority}</Badge>
                          <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", statusCls)}>{intv.status}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{intv.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{intv.responsibleStaff}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Due: {intv.dueDate}</span>
                        {intv.parentAcknowledged && <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-3 w-3" />Parent Acknowledged</span>}
                        {intv.notes.length > 0 && <span>{intv.notes.length} note{intv.notes.length !== 1 ? "s" : ""}</span>}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          PARENT & COMMS TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "communication" && (
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Parent / Guardian Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Parent Name</p>
                  <p className="text-sm font-semibold mt-0.5">{S.parentName}</p>
                </div>
                <PinGate correctPin={correctPin} role={activeRole} actor={user?.name || activeRole} field="Parent Phone" inline>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-semibold mt-0.5">{S.parentPhone}</p>
                  </div>
                </PinGate>
                <PinGate correctPin={correctPin} role={activeRole} actor={user?.name || activeRole} field="Parent Email" inline>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-semibold mt-0.5">{S.parentEmail}</p>
                  </div>
                </PinGate>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t text-center">
                {[
                  { label: "Meetings This Term", value: "2", icon: Calendar     },
                  { label: "Messages Exchanged", value: "8", icon: MessageSquare},
                  { label: "Open Interventions", value: String(studentInterventions.filter((i) => i.status !== "Completed").length), icon: Shield },
                ].map((s) => (
                  <div key={s.label}>
                    <s.icon className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 flex-wrap">
            <Button size="sm" className="gap-2"
              onClick={() => handleAIAction("Parent Meeting", "Parent Engagement Meeting")}>
              <Calendar className="h-4 w-4" /> Schedule Meeting
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" /> Send Message
            </Button>
          </div>

          <div className="space-y-3">
            {communicationHistory.map((msg, i) => (
              <Card key={i} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-start gap-4">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs bg-violet-100 text-violet-700">
                      {msg.from.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{msg.from}</p>
                      <Badge variant="secondary" className="text-xs">{msg.type}</Badge>
                      <span className="text-xs text-muted-foreground ml-auto">{msg.date}</span>
                    </div>
                    <p className="text-sm font-medium mt-0.5">{msg.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{msg.preview}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs shrink-0">Open</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          AI INSIGHTS TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "ai" && (
        <div className="space-y-5">
          {/* Risk dimension cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Academic Risk",
                level: S.perf === "at-risk" ? "High" : S.perf === "top" ? "Low" : "Medium",
                icon: BookOpen,
                cls: S.perf === "at-risk" ? "text-red-600 bg-red-50 border-red-200" : S.perf === "top" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-amber-600 bg-amber-50 border-amber-200",
              },
              {
                label: "Attendance Risk",
                level: S.attendance < 85 ? "High" : S.attendance < 90 ? "Medium" : "Low",
                icon: ClipboardList,
                cls: S.attendance < 85 ? "text-red-600 bg-red-50 border-red-200" : S.attendance < 90 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-emerald-600 bg-emerald-50 border-emerald-200",
              },
              {
                label: "Wellbeing Risk",
                level: S.holisticScore < 65 ? "High" : S.holisticScore < 78 ? "Medium" : "Low",
                icon: Heart,
                cls: S.holisticScore < 65 ? "text-red-600 bg-red-50 border-red-200" : S.holisticScore < 78 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-emerald-600 bg-emerald-50 border-emerald-200",
              },
              { label: "Behaviour Risk", level: "Low", icon: Shield, cls: "text-emerald-600 bg-emerald-50 border-emerald-200" },
            ].map(({ label, level, icon: Icon, cls }) => {
              const parts = cls.split(" ");
              return (
                <Card key={label} className={cn("border", ...parts.slice(1))}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={cn("h-4 w-4", parts[0])} />
                      <p className="text-xs font-medium text-muted-foreground">{label}</p>
                    </div>
                    <p className={cn("text-lg font-bold", parts[0])}>{level}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Risk Level</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* AI Summary */}
          <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-violet-800">
                <Brain className="h-5 w-5 text-violet-600" />
                AI-Generated Student Summary
                <Badge className="bg-violet-600 text-white ml-2 text-xs">Tanweer AI</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-700 leading-relaxed space-y-2">
                {aiSummary.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-violet-200">
                {(["mind", "body", "soul", "holistic"] as const).map((mode) => (
                  <Button key={mode} size="sm" variant="outline"
                    className="h-7 text-xs gap-1 capitalize border-violet-300 text-violet-700 hover:bg-violet-100"
                    onClick={() => setAIPromptWithMode(
                      mode === "holistic"
                        ? `Complete holistic analysis for ${S.name}: Mind ${S.mindScore}, Body ${S.bodyScore}, Soul ${S.soulScore}, Holistic ${S.holisticScore}/100. Attendance ${S.attendance}%, GPA ${S.gpa}.`
                        : mode === "mind"
                          ? `Academic Mind analysis for ${S.name}: GPA ${S.gpa}, attendance ${S.attendance}%, strongest Urdu 91, Physics declining 79. Provide academic growth recommendations.`
                          : mode === "body"
                            ? `Body wellness analysis for ${S.name}: Attendance ${S.attendance}%, Body Score ${S.bodyScore}/100. Wellbeing recommendations.`
                            : `Soul character analysis for ${S.name}: Soul Score ${S.soulScore}/100. Leadership potential noted. Character development recommendations.`,
                      mode
                    )}>
                    <Sparkles className="h-3 w-3" />
                    {mode === "mind" ? "Mind" : mode === "body" ? "Body" : mode === "soul" ? "Soul" : "Holistic"}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Clickable AI Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                AI-Recommended Actions
                <Badge variant="secondary" className="text-xs ml-1">Click to execute</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    { label: "Schedule Parent Meeting", type: "Parent Meeting"          as InterventionType, icon: Calendar,     color: "bg-violet-50 border-violet-200 hover:bg-violet-100", text: "text-violet-700",  desc: "Discuss academic progress and Physics decline" },
                    { label: "Assign Academic Mentor",  type: "Academic Support"        as InterventionType, icon: UserPlus,    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",       text: "text-blue-700",    desc: "1-on-1 Physics tutoring and study plan" },
                    { label: "Attendance Follow-Up",    type: "Attendance Concern"      as InterventionType, icon: ClipboardList,color: "bg-amber-50 border-amber-200 hover:bg-amber-100",  text: "text-amber-700",   desc: "Monitor and improve attendance consistency" },
                    { label: "Wellbeing Check-In",      type: "Wellbeing Support"       as InterventionType, icon: Heart,       color: "bg-rose-50 border-rose-200 hover:bg-rose-100",       text: "text-rose-700",    desc: "Holistic wellbeing and exam stress check" },
                    { label: "Leadership Opportunity",  type: "Leadership Development"  as InterventionType, icon: Star,        color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",text: "text-emerald-700",desc: "Nominate for Math Olympiad team" },
                    { label: "Behaviour Support",       type: "Behaviour Support"       as InterventionType, icon: Shield,      color: "bg-slate-50 border-slate-200 hover:bg-slate-100",     text: "text-slate-700",   desc: "Preventive character development activity" },
                  ]
                ).map(({ label, type, icon: Icon, color, text, desc }) => (
                  <button
                    key={label}
                    onClick={() => handleAIAction(type, label)}
                    className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all group text-left", color)}
                  >
                    <div className={cn("p-2 rounded-lg bg-white/60 shrink-0 group-hover:scale-110 transition-transform", text)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-semibold", text)}>{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths / Improvements / Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" /> Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {["Urdu Language (91/100)", "Consistent improvement trajectory", `Strong attendance (${S.attendance}%)`, "Team collaboration in projects"].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-xs text-emerald-800">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" /> {s}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4" /> Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {["Physics declining (−1 pts)", "English essay overdue", "Time management under pressure", "CS Python project behind schedule"].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-xs text-amber-800">
                    <Award className="h-3.5 w-3.5 shrink-0" /> {s}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-blue-800 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {["Enroll in Math Olympiad team", "Parent meeting re: Physics decline", "1-on-1 Physics tutoring sessions", "Advanced Urdu Literature elective"].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-xs text-blue-800">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" /> {s}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          FEES TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "fees" && (
        ["admin", "vp1", "vp2", "vp3"].includes(activeRole) ? (
          <PinGate correctPin={correctPin} role={activeRole} actor={user?.name || activeRole} field="Fee History">
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total Paid",       value: `₹${feeSummary.totalPaid.toLocaleString()}`,   color: "text-emerald-600", icon: CheckCircle },
                  { label: "Outstanding",      value: `₹${feeSummary.outstanding.toLocaleString()}`, color: "text-blue-600",    icon: DollarSign  },
                  { label: "Next Due",         value: feeSummary.nextDue,                             color: "text-amber-600",   icon: Calendar    },
                ].map((s) => (
                  <Card key={s.label}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <s.icon className={cn("h-8 w-8 shrink-0", s.color)} />
                      <div>
                        <p className={cn("text-base font-bold", s.color)}>{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Payment History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {feeHistory.map((fee, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl border">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{fee.term}</p>
                        <p className="text-xs text-muted-foreground">Paid: {fee.paidDate} · {fee.method}</p>
                        <p className="text-xs text-muted-foreground">Receipt: {fee.receipt}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{fee.amount.toLocaleString()}</p>
                        <Badge variant="success" className="text-xs">Paid ✓</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </PinGate>
        ) : (
          <Card>
            <CardContent className="py-12 flex flex-col items-center text-center gap-3">
              <Lock className="h-10 w-10 text-muted-foreground/40" />
              <div>
                <p className="font-semibold">Fee records require administrative access</p>
                <p className="text-sm text-muted-foreground mt-1">Contact your school administrator to review fee history.</p>
              </div>
            </CardContent>
          </Card>
        )
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          HOMEWORK TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "homework" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Homework Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendArea
                  data={homeworkCompletion}
                  xKey="month"
                  lines={[{ key: "rate", color: "#6366f1", label: "Completion %" }]}
                  height={200}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projects360.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border">
                    <div className={cn("p-1.5 rounded-lg shrink-0", p.status === "completed" ? "bg-emerald-100" : "bg-amber-100")}>
                      {p.status === "completed"
                        ? <CheckCircle className="h-4 w-4 text-emerald-600" />
                        : <FileText className="h-4 w-4 text-amber-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.subject} · {p.term}</p>
                    </div>
                    {p.grade ? (
                      <div className="text-right shrink-0">
                        <Badge variant="success" className="text-xs">{p.grade}</Badge>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.score}/100</p>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="shrink-0 text-xs">In Progress</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-2 max-w-xs">
          {actionToast}
        </div>
      )}
    </div>
  );
}
