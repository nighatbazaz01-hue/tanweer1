"use client";
import {
  Clock, CheckCircle, XCircle, BookOpen, AlertTriangle,
  TrendingUp, Users, Sparkles, ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendArea, DonutChart, GroupedBar } from "@/components/charts";
import { useUIStore } from "@/store/useUIStore";
import {
  teacherProfile, todaysClasses, classAttendanceToday, homeworkAssignments,
  studentPerformance, gradeDistribution, classRiskStudents,
} from "@/lib/mockData/teacher";
import { cn } from "@/lib/utils";

const classStatusStyle: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ongoing: "bg-blue-100 text-blue-700 border-blue-200 ring-2 ring-blue-400 ring-offset-1",
  upcoming: "bg-slate-100 text-slate-600 border-slate-200",
};

const attendanceStatusStyle: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  present: { label: "Present", color: "text-emerald-600", icon: CheckCircle },
  absent: { label: "Absent", color: "text-red-600", icon: XCircle },
  late: { label: "Late", color: "text-amber-600", icon: Clock },
};

export default function TeacherDashboard() {
  const { toggleAiDrawer } = useUIStore();
  const presentCount = classAttendanceToday.filter((s) => s.status === "present").length;
  const absentCount = classAttendanceToday.filter((s) => s.status === "absent").length;
  const lateCount = classAttendanceToday.filter((s) => s.status === "late").length;
  const attendanceRate = Math.round((presentCount / classAttendanceToday.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good morning, ${teacherProfile.name.split(" ")[1]}!`}
        description={`${teacherProfile.subject} · ${teacherProfile.sections.join(", ")} · ${teacherProfile.totalStudents} students`}
        breadcrumbs={[{ label: "Teacher" }, { label: "Dashboard" }]}
        actions={
          <Button onClick={toggleAiDrawer} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />
            AI Teaching Assistant
          </Button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Classes Today", value: todaysClasses.length, sub: "2 remaining", icon: BookOpen, color: "bg-blue-500" },
          { label: "Present Today", value: `${attendanceRate}%`, sub: `${presentCount}/${classAttendanceToday.length} students`, icon: CheckCircle, color: "bg-emerald-500" },
          { label: "Homework Due", value: homeworkAssignments.filter((h) => h.status === "active").length, sub: "Active assignments", icon: BookOpen, color: "bg-amber-500" },
          { label: "At-Risk", value: classRiskStudents.length, sub: "Needs attention", icon: AlertTriangle, color: "bg-red-500" },
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
                  { key: "avg", color: "#6366f1", label: "Average" },
                  { key: "highest", color: "#34d399", label: "Highest" },
                  { key: "lowest", color: "#f87171", label: "Lowest" },
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
                    { name: "Absent", value: absentCount, color: "#f87171" },
                    { name: "Late", value: lateCount, color: "#f59e0b" },
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
              <Button size="sm" className="w-full mt-3 text-xs h-8">Save Attendance</Button>
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
            <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
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
                <Button variant="outline" size="sm" className="w-full text-xs h-7">
                  Contact Parent
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
