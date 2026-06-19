"use client";
import { useState, useMemo } from "react";
import { TrendingUp, Award, AlertTriangle, ArrowLeft, Save, CheckCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendArea, DonutChart } from "@/components/charts";
import { studentPerformance, gradeDistribution, classRiskStudents, classAttendanceToday } from "@/lib/mockData/teacher";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useDataStore } from "@/store/useDataStore";
import { DEMO_CHILD_ID, DEMO_CHILD_NAME, DEMO_TEACHER_NAME } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const gradeColor  = (s: number) => s >= 90 ? "text-emerald-600" : s >= 80 ? "text-blue-600" : s >= 70 ? "text-amber-600" : "text-red-600";
const gradeLetter = (s: number) => s >= 90 ? "A+" : s >= 85 ? "A" : s >= 80 ? "B+" : s >= 75 ? "B" : s >= 70 ? "C+" : s >= 65 ? "C" : s >= 60 ? "D" : "F";

const SUBJECTS = ["Mathematics", "English", "Physics", "Chemistry", "Arabic", "Computer Science"];

const DEMO_TEACHER_SUBJECT = "Mathematics";

const initialGrades = classAttendanceToday.map((s, i) => ({
  ...s,
  score: [82, 87, 45, 78, 91, 63, 71, 88][i] ?? 75,
}));

// Map classAttendanceToday student name → real store studentId
function resolveStudentId(name: string, fallbackId: string): string {
  if (name === DEMO_CHILD_NAME) return DEMO_CHILD_ID;
  return `CLASS-${fallbackId}`;
}

export default function TeacherPerformancePage() {
  const { gradeRecords, bulkSetGradeRecords } = useDataStore();
  const [gradeOpen, setGradeOpen] = useState(false);
  const [subject, setSubject]     = useState(DEMO_TEACHER_SUBJECT);
  const [grades, setGrades]       = useState(initialGrades);
  const [toast, setToast]         = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // Live score for Ahmed from the store (for the subject currently selected)
  const ahmedStoreMark = useMemo(() => {
    const rec = gradeRecords.find((r) => r.studentId === DEMO_CHILD_ID && r.subject === subject);
    return rec?.marks ?? null;
  }, [gradeRecords, subject]);

  const handleSave = () => {
    bulkSetGradeRecords(
      subject,
      grades.map((g) => ({
        studentId:   resolveStudentId(g.name, g.id),
        studentName: g.name,
        marks:       g.score,
      })),
      DEMO_TEACHER_NAME,
      DEMO_TEACHER_NAME
    );
    setGradeOpen(false);
    showToast(`Grades saved for ${subject} — visible to parent and student instantly.`);
  };

  const avgScore = Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length);
  const topPerformers = grades.filter((g) => g.score >= 85).length;
  const atRisk = grades.filter((g) => g.score < 65).length;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="h-4 w-4 shrink-0" />{toast}
        </div>
      )}

      <PageHeader
        title="Student Performance"
        description="Analytics, grade entry, and performance trends — Grade 10-A Mathematics"
        breadcrumbs={[{ label: "Teacher", href: "/teacher" }, { label: "Performance" }]}
        actions={
          <div className="flex gap-2">
            <Link href="/teacher">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />Dashboard
              </Button>
            </Link>
            <Button size="sm" className="gap-2" onClick={() => setGradeOpen(true)}>
              <Save className="h-4 w-4" />Grade Entry
            </Button>
          </div>
        }
      />

      {/* Ahmed's live store mark banner */}
      {ahmedStoreMark !== null && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex items-center gap-3 text-sm text-blue-800">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>
            Live store: <strong>{DEMO_CHILD_NAME}</strong>&apos;s {subject} score = <strong>{ahmedStoreMark}%</strong> ({gradeLetter(ahmedStoreMark)})
            — this is now visible to the parent and student portals.
          </span>
          <Badge variant="secondary" className="ml-auto text-xs">Live</Badge>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Class Average",  value: `${avgScore}%`, icon: TrendingUp,    color: "blue"    },
          { label: "Top Performers", value: topPerformers,  icon: Award,          color: "emerald" },
          { label: "At Risk",        value: atRisk,         icon: AlertTriangle,  color: "red"     },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-3">
              <div className={`rounded-lg bg-${color}-100 p-2`}>
                <Icon className={`h-5 w-5 text-${color}-600`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Performance Trend — Grade 10-A</CardTitle></CardHeader>
          <CardContent>
            <TrendArea
              data={studentPerformance}
              xKey="month"
              lines={[{ key: "avg", label: "Class Avg", color: "#6366f1" }]}
              height={200}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Grade Distribution</CardTitle></CardHeader>
          <CardContent>
            <DonutChart
              data={gradeDistribution.map((d) => ({ name: d.grade, value: d.count, color: d.color }))}
              height={200}
            />
          </CardContent>
        </Card>
      </div>

      {/* Student Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Student Scores — Grade 10-A
            <Badge variant="secondary" className="text-xs ml-1">Entry subject: {subject}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {grades.map((s) => {
              const realId = resolveStudentId(s.name, s.id);
              const storeMark = gradeRecords.find((r) => r.studentId === realId && r.subject === subject);
              const displayScore = storeMark?.marks ?? s.score;
              return (
                <div key={s.id} className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-2.5",
                  storeMark && "border-blue-200 bg-blue-50/50"
                )}>
                  <div className="w-40 truncate text-sm font-medium">{s.name}</div>
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          displayScore >= 85 ? "bg-emerald-500" : displayScore >= 70 ? "bg-blue-500" : displayScore >= 60 ? "bg-amber-500" : "bg-red-500"
                        )}
                        style={{ width: `${displayScore}%` }}
                      />
                    </div>
                  </div>
                  <span className={cn("w-12 text-right text-sm font-bold", gradeColor(displayScore))}>{displayScore}%</span>
                  <Badge className="w-10 justify-center text-xs">{gradeLetter(displayScore)}</Badge>
                  {storeMark && <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-300 px-1">saved</Badge>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* At-Risk Students */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />At-Risk Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {classRiskStudents.map((s) => (
              <div key={s.name} className="flex items-center justify-between rounded-lg border px-4 py-3">
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">Grade {s.grade} · Last Score: {s.lastScore}% · Attendance: {s.attendance}%</p>
                </div>
                <Badge className={s.risk === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}>
                  {s.risk} Risk
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade Entry Dialog */}
      <Dialog open={gradeOpen} onOpenChange={setGradeOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Grade Entry — Grade 10-A</DialogTitle>
          </DialogHeader>

          {/* Subject Selector */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Subject</p>
            <div className="relative">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}{s === DEMO_TEACHER_SUBJECT ? " (your subject)" : ""}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <p className="text-xs text-muted-foreground -mt-1">
            Saving will update <strong>{DEMO_CHILD_NAME}</strong>&apos;s grade in the parent and student portals instantly.
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto py-1 pr-1">
            {grades.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className={cn("flex-1 text-sm", s.name === DEMO_CHILD_NAME && "font-semibold text-blue-700")}>
                  {s.name}
                  {s.name === DEMO_CHILD_NAME && <span className="ml-1 text-[10px] bg-blue-100 text-blue-600 rounded px-1">demo child</span>}
                </span>
                <Input
                  type="number" min={0} max={100}
                  className="w-20 text-center"
                  value={s.score}
                  onChange={(e) => {
                    const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                    setGrades((prev) => prev.map((g, idx) => idx === i ? { ...g, score: val } : g));
                  }}
                />
                <span className={cn("w-8 text-sm font-bold", gradeColor(s.score))}>{gradeLetter(s.score)}</span>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGradeOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />Save {subject} Grades
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
