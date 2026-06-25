"use client";

import { useState, useMemo } from "react";
import { useRoleStore } from "@/store/useRoleStore";
import { useDataStore } from "@/store/useDataStore";
import { filterStudentsForRole, VP_GRADE_RANGES, DEMO_CHILD_ID } from "@/lib/permissions";
import { useUIStore } from "@/store/useUIStore";
import type { Student } from "@/lib/mockData/population";
import {
  Brain, Heart, Zap, Star, TrendingUp, TrendingDown,
  ChevronDown, Search, X, BarChart2, AlertTriangle,
  CheckCircle2, Eye, Sparkles, Users, BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function riskCategory(holistic: number): { label: "At Risk" | "Monitor" | "Healthy"; color: string; bg: string } {
  if (holistic < 65) return { label: "At Risk",  color: "text-red-700",    bg: "bg-red-50 border-red-200" };
  if (holistic < 78) return { label: "Monitor",  color: "text-amber-700",  bg: "bg-amber-50 border-amber-200" };
  return                   { label: "Healthy",   color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" };
}

function scoreColor(score: number) {
  if (score < 65) return "text-red-600";
  if (score < 78) return "text-amber-600";
  return "text-emerald-600";
}

function scoreBg(score: number) {
  if (score < 65) return "bg-red-100";
  if (score < 78) return "bg-amber-100";
  return "bg-emerald-100";
}

function avg(arr: number[]) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

// Distribution buckets for bar chart
function buildDistribution(scores: number[]) {
  const buckets = [
    { range: "50–59", count: 0 },
    { range: "60–69", count: 0 },
    { range: "70–79", count: 0 },
    { range: "80–89", count: 0 },
    { range: "90–100", count: 0 },
  ];
  for (const s of scores) {
    if (s < 60) buckets[0].count++;
    else if (s < 70) buckets[1].count++;
    else if (s < 80) buckets[2].count++;
    else if (s < 90) buckets[3].count++;
    else buckets[4].count++;
  }
  return buckets;
}

const CHART_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#10b981"];

// ─── Student Detail Panel ─────────────────────────────────────────────────────

function StudentDetailPanel({
  student,
  open,
  onClose,
  onAskAI,
}: {
  student: Student | null;
  open: boolean;
  onClose: () => void;
  onAskAI: (prompt: string, mode: MbsMode) => void;
}) {
  if (!student) return null;
  const risk = riskCategory(student.holisticScore);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
              {student.avatar}
            </div>
            <div>
              <p className="font-bold text-base">{student.name}</p>
              <p className="text-sm text-muted-foreground font-normal">
                Grade {student.grade} — Section {student.section} · {student.id}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Risk badge */}
        <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold border ${risk.bg} ${risk.color} w-fit`}>
          {risk.label === "At Risk" && <AlertTriangle className="h-3.5 w-3.5" />}
          {risk.label === "Monitor"  && <Eye className="h-3.5 w-3.5" />}
          {risk.label === "Healthy"  && <CheckCircle2 className="h-3.5 w-3.5" />}
          {risk.label}
        </div>

        {/* MBS Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Mind",     score: student.mindScore,     icon: Brain,  color: "text-blue-600",    bg: "bg-blue-50",    mode: "mind"     as MbsMode, prompt: `Analyze this student's Mind Score of ${student.mindScore}/100 for ${student.name} (Grade ${student.grade}-${student.section}). Cover academic patterns, strengths, weaknesses, and recommended interventions.` },
            { label: "Body",     score: student.bodyScore,     icon: Heart,  color: "text-rose-600",    bg: "bg-rose-50",    mode: "body"     as MbsMode, prompt: `Analyze ${student.name}'s Body Score of ${student.bodyScore}/100. Cover wellness indicators, participation trends, attendance rate of ${student.attendanceRate}%, and wellbeing recommendations.` },
            { label: "Soul",     score: student.soulScore,     icon: Star,   color: "text-violet-600",  bg: "bg-violet-50",  mode: "soul"     as MbsMode, prompt: `Analyze ${student.name}'s Soul Score of ${student.soulScore}/100. Cover character development, leadership potential, behaviour patterns, and recommended growth activities.` },
            { label: "Holistic", score: student.holisticScore, icon: Zap,    color: "text-amber-600",   bg: "bg-amber-50",   mode: "holistic" as MbsMode, prompt: `Provide a complete Mind•Body•Soul analysis for ${student.name} (Mind: ${student.mindScore}, Body: ${student.bodyScore}, Soul: ${student.soulScore}, Holistic: ${student.holisticScore}/100). Include intervention recommendations and parent engagement suggestions.` },
          ].map(({ label, score, icon: Icon, color, bg, mode, prompt }) => (
            <div key={label} className={`rounded-xl p-3 ${bg} border flex flex-col items-center gap-1`}>
              <Icon className={`h-5 w-5 ${color}`} />
              <p className="text-xs font-semibold text-muted-foreground">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{score}</p>
              <p className="text-[10px] text-muted-foreground">/100</p>
              <Button
                size="sm"
                variant="ghost"
                className={`h-6 text-[10px] px-2 gap-1 mt-1 ${color} hover:bg-white/60`}
                onClick={() => { onAskAI(prompt, mode); onClose(); }}
              >
                <Sparkles className="h-2.5 w-2.5" />
                Ask AI
              </Button>
            </div>
          ))}
        </div>

        {/* Additional context */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Academic & Wellbeing</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">GPA</span>
                <span className="font-semibold">{student.gpa.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attendance</span>
                <span className={`font-semibold ${student.attendanceRate < 85 ? "text-red-600" : "text-emerald-600"}`}>
                  {student.attendanceRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Performance</span>
                <Badge variant="outline" className={
                  student.performanceTier === "top" ? "border-emerald-400 text-emerald-700" :
                  student.performanceTier === "at-risk" ? "border-red-400 text-red-700" :
                  "border-amber-400 text-amber-700"
                }>
                  {student.performanceTier}
                </Badge>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Student Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Parent</span>
                <span className="font-medium text-right text-xs">{student.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Enrolled</span>
                <span className="font-medium">{student.enrolledYear}</span>
              </div>
              {student.medicalNote && (
                <div className="col-span-2 rounded-lg bg-amber-50 border border-amber-200 p-2 text-xs text-amber-800">
                  ⚕ {student.medicalNote}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interests */}
        {student.interests.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-2">Interests</p>
            <div className="flex flex-wrap gap-1.5">
              {student.interests.map((i) => (
                <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MindBodySoulPage() {
  const { activeRole } = useRoleStore();
  const { students } = useDataStore();
  const { setAIPromptWithMode } = useUIStore();

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<"all" | "At Risk" | "Monitor" | "Healthy">("all");
  const [sortBy, setSortBy] = useState<"holistic" | "mind" | "body" | "soul" | "name">("holistic");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeChart, setActiveChart] = useState<"mind" | "body" | "soul" | "holistic">("holistic");

  // Role-filtered students
  const scopedStudents = useMemo(
    () => filterStudentsForRole(students, activeRole),
    [students, activeRole]
  );

  // Available grades/sections based on scoped students
  const availableGrades = useMemo(() => {
    const grades = [...new Set(scopedStudents.map((s) => s.grade))].sort((a, b) => a - b);
    return grades;
  }, [scopedStudents]);

  const availableSections = useMemo(() => {
    const base = gradeFilter !== "all"
      ? scopedStudents.filter((s) => s.grade === Number(gradeFilter))
      : scopedStudents;
    return [...new Set(base.map((s) => s.section))].sort();
  }, [scopedStudents, gradeFilter]);

  // Filtered + sorted list
  const filteredStudents = useMemo(() => {
    let list = scopedStudents;

    if (gradeFilter !== "all") list = list.filter((s) => s.grade === Number(gradeFilter));
    if (sectionFilter !== "all") list = list.filter((s) => s.section === sectionFilter);
    if (riskFilter !== "all") list = list.filter((s) => riskCategory(s.holisticScore).label === riskFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    }

    return [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return b[`${sortBy}Score` as "mindScore" | "bodyScore" | "soulScore" | "holisticScore"] -
             a[`${sortBy}Score` as "mindScore" | "bodyScore" | "soulScore" | "holisticScore"];
    });
  }, [scopedStudents, gradeFilter, sectionFilter, riskFilter, search, sortBy]);

  // Aggregate stats
  const stats = useMemo(() => ({
    mind:     avg(scopedStudents.map((s) => s.mindScore)),
    body:     avg(scopedStudents.map((s) => s.bodyScore)),
    soul:     avg(scopedStudents.map((s) => s.soulScore)),
    holistic: avg(scopedStudents.map((s) => s.holisticScore)),
    atRisk:   scopedStudents.filter((s) => riskCategory(s.holisticScore).label === "At Risk").length,
    monitor:  scopedStudents.filter((s) => riskCategory(s.holisticScore).label === "Monitor").length,
    healthy:  scopedStudents.filter((s) => riskCategory(s.holisticScore).label === "Healthy").length,
    total:    scopedStudents.length,
  }), [scopedStudents]);

  const chartData = useMemo(() => {
    const scoreKey = `${activeChart}Score` as "mindScore" | "bodyScore" | "soulScore" | "holisticScore";
    return buildDistribution(scopedStudents.map((s) => s[scoreKey]));
  }, [scopedStudents, activeChart]);

  const handleAskAI = (prompt: string, mode: MbsMode = "holistic") => {
    setAIPromptWithMode(prompt, mode);
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setDetailOpen(true);
  };

  const roleLabel =
    activeRole === "admin"   ? "All Students"
    : activeRole === "vp1"   ? "Grades 1–4"
    : activeRole === "vp2"   ? "Grades 5–8"
    : activeRole === "vp3"   ? "Grades 9–12"
    : activeRole === "teacher" ? "Grade 10-A"
    : activeRole === "parent"  ? "My Child"
    : "My Wellbeing";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-6 w-6 text-violet-600" />
            <h1 className="text-2xl font-bold">Mind · Body · Soul</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Holistic student wellbeing dashboard — {roleLabel} · {stats.total} students
          </p>
        </div>
        <Button
          onClick={() => handleAskAI(`Provide a comprehensive Mind•Body•Soul overview for ${roleLabel}. Average scores — Mind: ${stats.mind}, Body: ${stats.body}, Soul: ${stats.soul}, Holistic: ${stats.holistic}. ${stats.atRisk} students are at risk. Recommend priority interventions and areas of strength.`, "holistic")}
          className="gap-2 bg-violet-600 hover:bg-violet-700"
        >
          <Sparkles className="h-4 w-4" />
          AI Analysis
        </Button>
      </div>

      {/* Score Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Mind Score",     score: stats.mind,     icon: Brain,  color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",  mode: "mind"     as MbsMode, prompt: `Analyze the overall Mind Score of ${stats.mind}/100 across ${roleLabel}. Identify academic risk patterns, top-performing groups, and prioritise intervention opportunities.` },
          { label: "Body Score",     score: stats.body,     icon: Heart,  color: "text-rose-600",   bg: "bg-rose-50",   border: "border-rose-200",   mode: "body"     as MbsMode, prompt: `Analyze the overall Body Score of ${stats.body}/100 across ${roleLabel}. Review wellness indicators, participation trends, attendance patterns, and provide wellbeing recommendations.` },
          { label: "Soul Score",     score: stats.soul,     icon: Star,   color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200",  mode: "soul"     as MbsMode, prompt: `Analyze the overall Soul Score of ${stats.soul}/100 across ${roleLabel}. Review character development indicators, leadership potential, behaviour patterns, and suggest growth activities.` },
          { label: "Holistic Score", score: stats.holistic, icon: Zap,    color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200",   mode: "holistic" as MbsMode, prompt: `Provide a complete holistic Mind•Body•Soul analysis for ${roleLabel} (Mind: ${stats.mind}, Body: ${stats.body}, Soul: ${stats.soul}, Holistic: ${stats.holistic}). Include ${stats.atRisk} at-risk students. Recommend interventions and parent engagement strategies.` },
        ].map(({ label, score, icon: Icon, color, bg, border, mode, prompt }) => (
          <Card key={label} className={`${bg} border ${border}`}>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{label}</p>
                  <p className={`text-3xl font-bold mt-1 ${color}`}>{score}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">School avg · /100</p>
                </div>
                <Icon className={`h-6 w-6 ${color} opacity-70`} />
              </div>
              <Button
                size="sm"
                variant="ghost"
                className={`h-7 text-xs gap-1 mt-3 w-full ${color} hover:bg-white/60`}
                onClick={() => handleAskAI(prompt, mode)}
              >
                <Sparkles className="h-3 w-3" />
                Ask AI about {label.split(" ")[0]}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Summary + Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Risk Overview</h3>
          {[
            {
              label: "At Risk",
              count: stats.atRisk,
              icon: AlertTriangle,
              color: "text-red-700",
              bg: "bg-red-50 border-red-200",
              desc: "Holistic score below 65",
            },
            {
              label: "Monitor",
              count: stats.monitor,
              icon: Eye,
              color: "text-amber-700",
              bg: "bg-amber-50 border-amber-200",
              desc: "Holistic score 65–77",
            },
            {
              label: "Healthy",
              count: stats.healthy,
              icon: CheckCircle2,
              color: "text-emerald-700",
              bg: "bg-emerald-50 border-emerald-200",
              desc: "Holistic score 78+",
            },
          ].map(({ label, count, icon: Icon, color, bg, desc }) => (
            <button
              key={label}
              onClick={() => setRiskFilter(riskFilter === label as "At Risk" | "Monitor" | "Healthy" ? "all" : label as "At Risk" | "Monitor" | "Healthy")}
              className={`w-full rounded-xl border p-3.5 flex items-center gap-3 ${bg} transition-all ${riskFilter === label ? "ring-2 ring-offset-1 ring-current" : "hover:shadow-sm"}`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${color}`} />
              <div className="text-left flex-1">
                <p className={`text-sm font-semibold ${color}`}>{count} {label}</p>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
              </div>
              <span className={`text-xs font-bold ${color}`}>
                {stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%
              </span>
            </button>
          ))}
        </div>

        {/* Distribution Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Score Distribution</CardTitle>
              <div className="flex gap-1">
                {(["holistic", "mind", "body", "soul"] as const).map((dim) => (
                  <button
                    key={dim}
                    onClick={() => setActiveChart(dim)}
                    className={`text-[11px] px-2.5 py-1 rounded-full font-medium capitalize transition-all ${
                      activeChart === dim
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {dim}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v} students`, "Count"]} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search students…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        {activeRole !== "parent" && activeRole !== "student" && (
          <>
            {availableGrades.length > 1 && (
              <Select value={gradeFilter} onValueChange={(v) => { setGradeFilter(v); setSectionFilter("all"); }}>
                <SelectTrigger className="w-32 h-8 text-sm">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {availableGrades.map((g) => (
                    <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {availableSections.length > 1 && (
              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger className="w-32 h-8 text-sm">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {availableSections.map((s) => (
                    <SelectItem key={s} value={s}>Section {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </>
        )}
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="holistic">Sort: Holistic</SelectItem>
            <SelectItem value="mind">Sort: Mind</SelectItem>
            <SelectItem value="body">Sort: Body</SelectItem>
            <SelectItem value="soul">Sort: Soul</SelectItem>
            <SelectItem value="name">Sort: Name</SelectItem>
          </SelectContent>
        </Select>
        {riskFilter !== "all" && (
          <Button variant="ghost" size="sm" onClick={() => setRiskFilter("all")} className="h-8 gap-1 text-xs">
            <X className="h-3 w-3" />
            Clear filter
          </Button>
        )}
        <span className="text-xs text-muted-foreground ml-auto">{filteredStudents.length} students</span>
      </div>

      {/* Student Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground">Student</th>
                {activeRole !== "student" && activeRole !== "parent" && (
                  <th className="text-left px-3 py-3 font-semibold text-xs text-muted-foreground">Grade</th>
                )}
                <th className="text-center px-3 py-3 font-semibold text-xs text-blue-600">Mind</th>
                <th className="text-center px-3 py-3 font-semibold text-xs text-rose-600">Body</th>
                <th className="text-center px-3 py-3 font-semibold text-xs text-violet-600">Soul</th>
                <th className="text-center px-3 py-3 font-semibold text-xs text-amber-600">Holistic</th>
                <th className="text-center px-3 py-3 font-semibold text-xs text-muted-foreground">Status</th>
                <th className="text-left px-3 py-3 font-semibold text-xs text-muted-foreground">Attendance</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-muted-foreground">
                    No students match the current filters.
                  </td>
                </tr>
              )}
              {filteredStudents.map((student) => {
                const risk = riskCategory(student.holisticScore);
                return (
                  <tr
                    key={student.id}
                    onClick={() => handleStudentClick(student)}
                    className="border-b hover:bg-muted/30 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {student.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-[11px] text-muted-foreground">{student.id}</p>
                        </div>
                      </div>
                    </td>
                    {activeRole !== "student" && activeRole !== "parent" && (
                      <td className="px-3 py-3 text-sm text-muted-foreground">
                        Gr.{student.grade}-{student.section}
                      </td>
                    )}
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-block w-10 rounded-md py-0.5 text-xs font-bold text-center ${scoreBg(student.mindScore)} ${scoreColor(student.mindScore)}`}>
                        {student.mindScore}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-block w-10 rounded-md py-0.5 text-xs font-bold text-center ${scoreBg(student.bodyScore)} ${scoreColor(student.bodyScore)}`}>
                        {student.bodyScore}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-block w-10 rounded-md py-0.5 text-xs font-bold text-center ${scoreBg(student.soulScore)} ${scoreColor(student.soulScore)}`}>
                        {student.soulScore}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-block w-10 rounded-md py-0.5 text-xs font-bold text-center ${scoreBg(student.holisticScore)} ${scoreColor(student.holisticScore)}`}>
                        {student.holisticScore}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${risk.bg} ${risk.color}`}>
                        {risk.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${student.attendanceRate < 85 ? "bg-red-400" : "bg-emerald-400"}`}
                            style={{ width: `${student.attendanceRate}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{student.attendanceRate}%</span>
                      </div>
                    </td>
                    <td className="px-2">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Student Detail Sheet */}
      <StudentDetailPanel
        student={selectedStudent}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onAskAI={handleAskAI}
      />
    </div>
  );
}
