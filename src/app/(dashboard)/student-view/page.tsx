"use client";
import {
  CheckCircle, BookOpen, FileText, AlertCircle,
  Award, Calendar, Sparkles, TrendingUp, TrendingDown,
  Clock, Flame, ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendArea, DonutChart, GroupedBar } from "@/components/charts";
import { useUIStore } from "@/store/useUIStore";
import {
  studentProfile, studentAttendance, homeworkStatus,
  projects, upcomingExams, subjectMarks, weeklyTimetable, studyTips,
} from "@/lib/mockData/student";
import { cn } from "@/lib/utils";

const hwStatus: Record<string, { label: string; color: string }> = {
  submitted: { label: "Submitted ✓", color: "text-emerald-600" },
  pending: { label: "Not Started ⚠️", color: "text-red-600" },
  in_progress: { label: "In Progress", color: "text-amber-600" },
};

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export default function StudentDashboard() {
  const { toggleAiDrawer } = useUIStore();
  const completedHw = homeworkStatus.filter((h) => h.status === "submitted").length;
  const pendingHw = homeworkStatus.filter((h) => h.status === "pending" || h.status === "in_progress").length;

  const marksChartData = subjectMarks.map((m) => ({ subject: m.subject.substring(0, 4), marks: m.marks }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hey, ${studentProfile.name.split(" ")[0]}! 👋`}
        description={`${studentProfile.grade} · GPA ${studentProfile.gpa} · Rank ${studentProfile.rank}/${studentProfile.totalStudents}`}
        breadcrumbs={[{ label: "Student" }, { label: "My Dashboard" }]}
        actions={
          <Button onClick={toggleAiDrawer} size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600">
            <Sparkles className="h-4 w-4" />
            AI Study Assistant
          </Button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Attendance", value: `${studentAttendance.rate}%`, sub: `🔥 ${studentAttendance.streak}-day streak`, icon: CheckCircle, color: "bg-emerald-500" },
          { label: "Homework Done", value: `${completedHw}/${homeworkStatus.length}`, sub: `${pendingHw} pending`, icon: BookOpen, color: "bg-blue-500" },
          { label: "Active Projects", value: projects.filter((p) => p.status === "in_progress").length, sub: "In progress", icon: FileText, color: "bg-violet-500" },
          { label: "Upcoming Exams", value: upcomingExams.length, sub: `Next: ${upcomingExams[0]?.date}`, icon: AlertCircle, color: "bg-amber-500" },
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

      {/* AI Study Tips */}
      <div className="rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 p-4 text-white">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-sm mb-2">AI Study Tips for You</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {studyTips.map((tip, i) => (
                <p key={i} className="text-xs bg-white/20 rounded-lg px-3 py-2 leading-relaxed">
                  {tip}
                </p>
              ))}
            </div>
          </div>
          <Button onClick={toggleAiDrawer} size="sm" variant="outline" className="shrink-0 text-xs text-white border-white/50 hover:bg-white/20">
            Ask AI
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* My Marks */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">My Subject Marks</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupedBar
              data={marksChartData}
              xKey="subject"
              bars={[{ key: "marks", color: "#f59e0b", label: "Score / 100" }]}
              height={180}
            />
            <div className="mt-4 space-y-2">
              {subjectMarks.map((m) => (
                <div key={m.subject} className="flex items-center gap-3">
                  <span className="text-xs w-24 truncate text-muted-foreground">{m.subject}</span>
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${m.marks}%` }} />
                  </div>
                  <span className="text-xs font-bold w-8 text-right">{m.marks}</span>
                  <Badge variant="secondary" className="text-xs w-8 text-center">{m.grade}</Badge>
                  <span className={cn("text-xs w-8 flex items-center gap-0.5",
                    m.change > 0 ? "text-emerald-600" : m.change < 0 ? "text-red-500" : "text-muted-foreground")}>
                    {m.change > 0 ? <TrendingUp className="h-3 w-3" /> : m.change < 0 ? <TrendingDown className="h-3 w-3" /> : "—"}
                    {Math.abs(m.change)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance + Upcoming Exams */}
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">My Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart
                data={[
                  { name: "Present", value: studentAttendance.present, color: "#34d399" },
                  { name: "Absent", value: studentAttendance.absent, color: "#f87171" },
                  { name: "Late", value: studentAttendance.late, color: "#f59e0b" },
                ]}
                height={140}
                innerRadius={35}
              />
              <div className="grid grid-cols-3 gap-1.5 mt-3 text-center text-xs">
                <div className="bg-emerald-50 rounded-lg p-1.5">
                  <p className="font-bold text-emerald-700">{studentAttendance.present}</p>
                  <p className="text-muted-foreground">Present</p>
                </div>
                <div className="bg-red-50 rounded-lg p-1.5">
                  <p className="font-bold text-red-600">{studentAttendance.absent}</p>
                  <p className="text-muted-foreground">Absent</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-1.5">
                  <p className="font-bold text-amber-600">{studentAttendance.late}</p>
                  <p className="text-muted-foreground">Late</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 p-2 bg-orange-50 rounded-lg">
                <Flame className="h-4 w-4 text-orange-500 shrink-0" />
                <p className="text-xs text-orange-700 font-medium">{studentAttendance.streak}-day attendance streak! 🔥</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingExams.map((exam, i) => (
                <div key={i} className={cn(
                  "p-2.5 rounded-lg border text-xs space-y-0.5",
                  i === 0 ? "bg-amber-50 border-amber-200" : "bg-muted/40"
                )}>
                  <div className="flex justify-between items-start">
                    <p className="font-semibold">{exam.subject}</p>
                    <Badge variant="secondary" className="text-[10px]">{exam.type}</Badge>
                  </div>
                  <p className="text-muted-foreground">📅 {exam.date} · {exam.time}</p>
                  <p className="text-muted-foreground">🏛 {exam.room} · Weight: {exam.weight}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Homework + Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">My Homework</CardTitle>
            <Badge variant="warning">{pendingHw} pending</Badge>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {homeworkStatus.map((hw, i) => (
              <div key={i} className={cn(
                "flex items-start gap-3 p-3 rounded-xl border",
                hw.status === "pending" ? "bg-red-50 border-red-200" :
                hw.status === "in_progress" ? "bg-amber-50 border-amber-200" :
                "bg-emerald-50/50 border-emerald-100"
              )}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{hw.title}</p>
                  <p className="text-xs text-muted-foreground">{hw.subject} · Due: {hw.dueDate}</p>
                  <p className={cn("text-xs font-medium mt-0.5", hwStatus[hw.status].color)}>
                    {hwStatus[hw.status].label}
                    {hw.score !== null && ` (${hw.score}/${hw.total})`}
                  </p>
                </div>
                {hw.status !== "submitted" && (
                  <Button variant="outline" size="sm" className="text-xs h-7 shrink-0">Start</Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">My Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="p-3 rounded-xl border space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{proj.title}</p>
                    <p className="text-xs text-muted-foreground">{proj.subject} · Due: {proj.dueDate}</p>
                    <p className="text-xs text-muted-foreground">Team: {proj.members.join(", ")}</p>
                  </div>
                  {proj.grade ? (
                    <Badge variant="success" className="shrink-0">{proj.grade}</Badge>
                  ) : (
                    <Badge variant="secondary" className="shrink-0">{proj.status === "in_progress" ? "Active" : "Done"}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className={cn("h-2 rounded-full", proj.progress === 100 ? "bg-emerald-500" : "bg-amber-400")}
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-8 text-right">{proj.progress}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Timetable */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            My Weekly Timetable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-5 gap-2 min-w-[600px]">
              {days.map((day) => (
                <div key={day} className="space-y-2">
                  <p className="text-xs font-bold text-center py-1.5 rounded-lg bg-muted">{day.slice(0, 3)}</p>
                  {(weeklyTimetable[day as keyof typeof weeklyTimetable] || []).map((cls, i) => (
                    <div key={i} className="p-2 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 text-center">
                      <p className="text-[10px] text-muted-foreground">{cls.time}</p>
                      <p className="text-xs font-semibold truncate">{cls.subject}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{cls.room}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
