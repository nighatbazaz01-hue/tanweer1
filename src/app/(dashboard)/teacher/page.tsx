"use client";
import {
  Clock, CheckCircle, XCircle, BookOpen, AlertTriangle,
  TrendingUp, Sparkles, ChevronRight, X, Check, Mail, GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendArea, DonutChart } from "@/components/charts";
import { useUIStore } from "@/store/useUIStore";
import { useDataStore } from "@/store/useDataStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  teacherProfile, todaysClasses, classAttendanceToday, homeworkAssignments,
  studentPerformance, gradeDistribution, classRiskStudents,
} from "@/lib/mockData/teacher";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const classStatusStyle: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ongoing: "bg-blue-100 text-blue-700 border-blue-200 ring-2 ring-blue-400 ring-offset-1",
  upcoming: "bg-slate-100 text-slate-600 border-slate-200",
};

const attendanceStatusStyle: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  present: { label: "Present", color: "text-emerald-600", icon: CheckCircle },
  absent:  { label: "Absent",  color: "text-red-600",     icon: XCircle },
  late:    { label: "Late",    color: "text-amber-600",   icon: Clock },
};

export default function TeacherDashboard() {
  const { toggleAiDrawer } = useUIStore();
  const { saveAttendance, addAssignment, createThread } = useDataStore();
  const { user } = useAuthStore();

  const presentCount  = classAttendanceToday.filter((s) => s.status === "present").length;
  const absentCount   = classAttendanceToday.filter((s) => s.status === "absent").length;
  const lateCount     = classAttendanceToday.filter((s) => s.status === "late").length;
  const attendanceRate = Math.round((presentCount / classAttendanceToday.length) * 100);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [hwOpen, setHwOpen] = useState(false);
  const [hwTitle, setHwTitle] = useState("");
  const [hwDue, setHwDue] = useState("");
  const [hwPoints, setHwPoints] = useState("20");
  const [contactStudent, setContactStudent] = useState<typeof classRiskStudents[0] | null>(null);
  const [composeBody, setComposeBody] = useState("");

  // Grade Entry
  const [gradeOpen, setGradeOpen] = useState(false);
  const [gradeAssessment, setGradeAssessment] = useState("Mid-Term Exam");
  const [gradeMarks, setGradeMarks] = useState<Record<string, string>>({});
  const getLetterGrade = (mark: number) =>
    mark >= 90 ? "A+" : mark >= 85 ? "A" : mark >= 80 ? "B+" : mark >= 75 ? "B" : mark >= 70 ? "C+" : mark >= 65 ? "C" : mark >= 60 ? "D" : "F";
  const handleSaveGrades = () => {
    const saved = Object.keys(gradeMarks).filter((id) => gradeMarks[id] !== "").length;
    setGradeOpen(false);
    setGradeMarks({});
    showToast(`Grades saved for ${saved} student${saved !== 1 ? "s" : ""} — ${gradeAssessment}`);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveAttendance = () => {
    saveAttendance("Grade 10-A", presentCount, absentCount, lateCount, user?.name || teacherProfile.name);
    showToast(`Attendance saved — ${presentCount} present, ${absentCount} absent, ${lateCount} late`);
  };

  const handleAddHw = () => {
    if (!hwTitle.trim()) return;
    const title = hwTitle.trim();
    const points = parseInt(hwPoints) || 20;
    addAssignment(title, "Grade 10-A", hwDue || "TBD", points, 32, user?.name || teacherProfile.name);
    setHwOpen(false);
    setHwTitle(""); setHwDue(""); setHwPoints("20");
    showToast(`"${title}" assigned to Grade 10-A`);
  };

  const handleSendContact = () => {
    if (!contactStudent || !composeBody.trim()) return;
    const from = {
      name:   user?.name || teacherProfile.name,
      role:   "Teacher",
      avatar: (user?.name || teacherProfile.name).split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
    };
    createThread(
      `Regarding ${contactStudent.name} — Academic Support`,
      `${contactStudent.name}'s Parent`,
      composeBody,
      "high",
      from
    );
    const name = contactStudent.name;
    setContactStudent(null);
    setComposeBody("");
    showToast(`Message sent to ${name}'s parent`);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white rounded-xl px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 shrink-0" />
          {toastMsg}
        </div>
      )}

      <PageHeader
        title={`Good morning, ${teacherProfile.name.split(" ")[1]}!`}
        description={`${teacherProfile.subject} · ${teacherProfile.sections.join(", ")} · ${teacherProfile.totalStudents} students`}
        breadcrumbs={[{ label: "Teacher" }, { label: "Dashboard" }]}
        actions={
          <div className="flex gap-2">
            <Button onClick={() => { setGradeOpen(true); setGradeMarks({}); }} size="sm" variant="outline" className="gap-1.5">
              <GraduationCap className="h-4 w-4" /> Grade Entry
            </Button>
            <Button onClick={toggleAiDrawer} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Sparkles className="h-4 w-4" /> AI Teaching Assistant
            </Button>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Classes Today",  value: todaysClasses.length,                                                       sub: "2 remaining",               icon: BookOpen,     color: "bg-blue-500" },
          { label: "Present Today",  value: `${attendanceRate}%`,                                                       sub: `${presentCount}/${classAttendanceToday.length} students`, icon: CheckCircle,  color: "bg-emerald-500" },
          { label: "Homework Due",   value: homeworkAssignments.filter((h) => h.status === "active").length,             sub: "Active assignments",          icon: BookOpen,     color: "bg-amber-500" },
          { label: "At-Risk",        value: classRiskStudents.length,                                                   sub: "Needs attention",            icon: AlertTriangle, color: "bg-red-500" },
        ].map((s) => (
          <Card key={s.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`rounded-lg p-2.5 shrink-0 ${s.color}`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Classes */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Today&apos;s Classes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysClasses.map((cls) => (
                <div key={cls.id} className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-shadow",
                  classStatusStyle[cls.status]
                )}>
                  <div className="text-center w-14 shrink-0">
                    <p className="text-xs font-bold">{cls.time}</p>
                    <p className="text-[10px] opacity-70">AM</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{cls.subject}</p>
                      <Badge className={cn("text-[10px]", classStatusStyle[cls.status])}>
                        {cls.status}
                      </Badge>
                    </div>
                    <p className="text-xs opacity-70">{cls.grade} · {cls.room} · {cls.students} students</p>
                    <p className="text-xs font-medium mt-0.5">Topic: {cls.topic}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs shrink-0 gap-1">
                    {cls.status === "upcoming" ? "Start" : "View"} <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Class Average Performance — 6 Months</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendArea
                data={studentPerformance}
                xKey="month"
                lines={[
                  { key: "avg",     color: "#6366f1", label: "Average" },
                  { key: "highest", color: "#34d399", label: "Highest" },
                  { key: "lowest",  color: "#f87171", label: "Lowest" },
                ]}
                legend
                height={200}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Attendance Widget */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Grade 10-A Attendance</CardTitle>
                <span className="text-xs text-muted-foreground">Today</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <DonutChart
                  data={[
                    { name: "Present", value: presentCount, color: "#34d399" },
                    { name: "Absent",  value: absentCount,  color: "#f87171" },
                    { name: "Late",    value: lateCount,    color: "#f59e0b" },
                  ]}
                  height={140}
                  innerRadius={40}
                />
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {classAttendanceToday.map((s) => {
                  const st = attendanceStatusStyle[s.status];
                  const Icon = st.icon;
                  return (
                    <div key={s.id} className="flex items-center gap-2 text-xs">
                      <Icon className={cn("h-3.5 w-3.5 shrink-0", st.color)} />
                      <span className="flex-1 truncate">{s.name}</span>
                      <span className={cn("font-medium", st.color)}>{st.label}</span>
                    </div>
                  );
                })}
              </div>
              <Button size="sm" className="w-full mt-3 text-xs h-8" onClick={handleSaveAttendance}>
                Save Attendance
              </Button>
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart
                data={gradeDistribution.map((d) => ({ name: d.grade, value: d.count, color: d.color }))}
                height={150}
                innerRadius={35}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Homework + At-Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">Homework Tracking</CardTitle>
            <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => setHwOpen(true)}>
              + New Assignment
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {homeworkAssignments.map((hw) => {
              const pct = Math.round((hw.submitted / hw.total) * 100);
              return (
                <div key={hw.id} className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{hw.title}</p>
                      <p className="text-xs text-muted-foreground">{hw.grade} · Due: {hw.dueDate}</p>
                    </div>
                    <Badge variant={hw.status === "completed" ? "success" : "secondary"} className="shrink-0 text-xs">
                      {hw.submitted}/{hw.total}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Class Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {classRiskStudents.map((s, i) => (
              <div key={i} className="p-3 rounded-xl border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs bg-red-100 text-red-700">
                        {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">Grade {s.grade}</p>
                    </div>
                  </div>
                  <Badge variant={s.risk === "High" ? "destructive" : "warning"} className="text-xs">
                    {s.risk} Risk
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between bg-muted/60 rounded px-2 py-1">
                    <span className="text-muted-foreground">Attendance</span>
                    <span className="font-semibold">{s.attendance}%</span>
                  </div>
                  <div className="flex justify-between bg-muted/60 rounded px-2 py-1">
                    <span className="text-muted-foreground">Last Score</span>
                    <span className="font-semibold">{s.lastScore}/100</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs h-7 gap-1"
                  onClick={() => {
                    setContactStudent(s);
                    setComposeBody(`Dear Parent,\n\nI am writing regarding ${s.name} who has been flagged as at-risk in my Mathematics class.\n\nAttendance: ${s.attendance}%\nLast assessment score: ${s.lastScore}/100\n\nI would appreciate scheduling a meeting to discuss a support plan.\n\nBest regards,\n${user?.name || teacherProfile.name}`);
                  }}>
                  <Mail className="h-3 w-3" /> Contact Parent
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* New Assignment Dialog */}
      <Dialog open={hwOpen} onOpenChange={setHwOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> New Assignment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Assignment Title *</label>
              <Input value={hwTitle} onChange={(e) => setHwTitle(e.target.value)} placeholder="e.g. Chapter 5 Exercises" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Due Date</label>
                <Input value={hwDue} onChange={(e) => setHwDue(e.target.value)} placeholder="e.g. Jun 20, 2026" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Points</label>
                <Input type="number" value={hwPoints} onChange={(e) => setHwPoints(e.target.value)} placeholder="20" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground bg-blue-50 border border-blue-100 rounded-lg p-2.5">
              This assignment will be posted to all Grade 10-A students and their parents.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHwOpen(false)} className="gap-1">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleAddHw} disabled={!hwTitle.trim()} className="gap-1">
              <Check className="h-4 w-4" /> Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grade Entry Dialog */}
      <Dialog open={gradeOpen} onOpenChange={(o) => { setGradeOpen(o); if (!o) setGradeMarks({}); }}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" /> Grade Entry
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 py-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Assessment</label>
              <select
                value={gradeAssessment}
                onChange={(e) => setGradeAssessment(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                {["Mid-Term Exam", "Final Exam", "Quiz 1", "Quiz 2", "Project Work", "Classwork", "Homework"].map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="text-xs text-muted-foreground bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              Enter marks out of 100. Letter grade calculated automatically.
            </div>
            <div className="space-y-2">
              {classAttendanceToday.map((s) => {
                const mark = parseInt(gradeMarks[s.id] ?? "");
                const letter = !isNaN(mark) && mark >= 0 && mark <= 100 ? getLetterGrade(mark) : null;
                const markColor = !letter ? "" : mark >= 80 ? "text-emerald-600" : mark >= 60 ? "text-amber-600" : "text-red-600";
                return (
                  <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg border bg-card">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.id}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={gradeMarks[s.id] ?? ""}
                        onChange={(e) => setGradeMarks((prev) => ({ ...prev, [s.id]: e.target.value }))}
                        placeholder="—"
                        className="w-16 h-8 text-center text-sm"
                      />
                      {letter && (
                        <span className={`text-sm font-bold w-8 text-center ${markColor}`}>{letter}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <DialogFooter className="pt-2 border-t mt-2">
            <Button variant="outline" onClick={() => setGradeOpen(false)} className="gap-1">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSaveGrades} className="gap-1">
              <Check className="h-4 w-4" /> Save Grades
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Parent Dialog */}
      <Dialog open={!!contactStudent} onOpenChange={(o) => !o && setContactStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> Contact Parent
            </DialogTitle>
          </DialogHeader>
          {contactStudent && (
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-red-100 text-red-700 text-xs font-semibold">
                    {contactStudent.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{contactStudent.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Grade {contactStudent.grade} · {contactStudent.risk} Risk · Attendance: {contactStudent.attendance}%
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Message to Parent</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none h-32"
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactStudent(null)} className="gap-1">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSendContact} disabled={!composeBody.trim()} className="gap-1">
              <Mail className="h-4 w-4" /> Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
