"use client";
import { useMemo } from "react";
import { Users, UserCheck, AlertTriangle, GraduationCap, Sparkles, TrendingUp, BookOpen, Calendar } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendArea, GroupedBar } from "@/components/charts";
import { useRoleStore } from "@/store/useRoleStore";
import { getVPProfile, getGradeGroupStats, getStudentsByGradeGroup, getTeachersByGradeGroup } from "@/lib/mockData/population";
import { useUIStore } from "@/store/useUIStore";
import { useDataStore } from "@/store/useDataStore";
import { cn } from "@/lib/utils";

function getStartGrade(role: string): 1 | 5 | 9 {
  if (role === "vp1") return 1;
  if (role === "vp2") return 5;
  return 9;
}

const attendanceTrendByGroup: Record<string, { month: string; present: number; absent: number }[]> = {
  vp1: [
    { month: "Jan", present: 97.1, absent: 2.9 },
    { month: "Feb", present: 96.4, absent: 3.6 },
    { month: "Mar", present: 97.8, absent: 2.2 },
    { month: "Apr", present: 95.9, absent: 4.1 },
    { month: "May", present: 96.7, absent: 3.3 },
    { month: "Jun", present: 96.2, absent: 3.8 },
  ],
  vp2: [
    { month: "Jan", present: 95.3, absent: 4.7 },
    { month: "Feb", present: 93.8, absent: 6.2 },
    { month: "Mar", present: 94.9, absent: 5.1 },
    { month: "Apr", present: 92.7, absent: 7.3 },
    { month: "May", present: 94.1, absent: 5.9 },
    { month: "Jun", present: 93.6, absent: 6.4 },
  ],
  vp3: [
    { month: "Jan", present: 93.2, absent: 6.8 },
    { month: "Feb", present: 91.7, absent: 8.3 },
    { month: "Mar", present: 92.5, absent: 7.5 },
    { month: "Apr", present: 90.8, absent: 9.2 },
    { month: "May", present: 93.0, absent: 7.0 },
    { month: "Jun", present: 92.4, absent: 7.6 },
  ],
};

const upcomingExams = [
  { subject: "Mathematics", date: "Jun 20", type: "Mid-Term", grades: "All" },
  { subject: "English", date: "Jun 22", type: "Quiz", grades: "All" },
  { subject: "Science", date: "Jun 25", type: "Mid-Term", grades: "All" },
];

const upcomingMeetings = [
  { title: "Parent-Teacher Conference", date: "Jun 22", time: "09:00", attendees: 24 },
  { title: "Grade Review Board", date: "Jun 25", time: "13:00", attendees: 8 },
  { title: "Staff Briefing", date: "Jun 29", time: "07:30", attendees: 12 },
];

export default function VPDashboard() {
  const { activeRole } = useRoleStore();
  const { toggleAiDrawer } = useUIStore();
  const { schoolConfig } = useDataStore();

  const vpRole = (["vp1", "vp2", "vp3"].includes(activeRole) ? activeRole : "vp3") as "vp1" | "vp2" | "vp3";
  const startGrade = getStartGrade(vpRole);
  const profile = getVPProfile(vpRole);
  const stats = useMemo(() => getGradeGroupStats(startGrade), [startGrade]);
  const atRiskStudents = useMemo(
    () => getStudentsByGradeGroup(startGrade).filter((s) => s.performanceTier === "at-risk").slice(0, 8),
    [startGrade]
  );
  const teachers = useMemo(() => getTeachersByGradeGroup(startGrade).slice(0, 6), [startGrade]);
  const trendData = attendanceTrendByGroup[vpRole];

  const gradeBarData = stats.gradeBreakdown.map((g) => ({
    grade: `G${g.grade}`,
    attendance: g.attendanceRate,
    students: g.count,
  }));

  const { color, bg } = {
    vp1: { color: "text-indigo-700", bg: "bg-indigo-100" },
    vp2: { color: "text-sky-700", bg: "bg-sky-100" },
    vp3: { color: "text-teal-700", bg: "bg-teal-100" },
  }[vpRole];

  const accentColor = {
    vp1: "#6366f1",
    vp2: "#0ea5e9",
    vp3: "#14b8a6",
  }[vpRole];

  const kpiCards = [
    {
      title: "Students",
      value: stats.studentCount,
      sub: profile.gradeGroupLabel,
      icon: Users,
      iconBg: "bg-blue-500",
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      sub: "Group average",
      icon: UserCheck,
      iconBg: "bg-emerald-500",
    },
    {
      title: "At-Risk Students",
      value: stats.atRiskCount,
      sub: "Need intervention",
      icon: AlertTriangle,
      iconBg: "bg-red-500",
    },
    {
      title: "Teachers",
      value: stats.teacherCount,
      sub: "Assigned to group",
      icon: GraduationCap,
      iconBg: "bg-violet-500",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`VP Dashboard — ${profile.gradeGroupLabel}`}
        description={`${profile.name} · ${schoolConfig.name}`}
        breadcrumbs={[{ label: "VP" }, { label: profile.gradeGroupLabel }]}
        actions={
          <Button onClick={toggleAiDrawer} size="sm" className="gap-2" style={{ background: accentColor }}>
            <Sparkles className="h-4 w-4" />
            AI Assistant
          </Button>
        }
      />

      <div className={cn("rounded-xl p-5 text-white")} style={{ background: `linear-gradient(135deg, ${accentColor}dd, ${accentColor}99)` }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">Division Overview</p>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-4xl font-bold">{stats.studentCount}</span>
              <span className="text-lg text-white/70 mb-1">students</span>
              <Badge className="mb-1.5 bg-white/20 text-white border-white/30 hover:bg-white/20">
                GPA avg {stats.avgGpa}
              </Badge>
            </div>
            <p className="text-white/70 text-sm mt-1">{profile.gradeGroupLabel} · {stats.topCount} top performers · {stats.atRiskCount} at-risk</p>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-2 text-center">
            {stats.gradeBreakdown.map((g) => (
              <div key={g.grade} className="bg-white/15 rounded-lg px-3 py-2">
                <p className="text-lg font-bold">{g.count}</p>
                <p className="text-xs text-white/70">Grade {g.grade}</p>
                <p className="text-xs text-white/60">{g.attendanceRate}% att.</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpiCards.map((k) => (
          <Card key={k.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{k.title}</p>
                  <p className="text-xl font-bold">{k.value}</p>
                  <p className="text-xs text-muted-foreground">{k.sub}</p>
                </div>
                <div className={cn("rounded-lg p-2 shrink-0", k.iconBg)}>
                  <k.icon className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Attendance Trend — 6 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendArea
              data={trendData}
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
            <CardTitle className="text-sm font-semibold">Attendance by Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupedBar
              data={gradeBarData}
              xKey="grade"
              bars={[{ key: "attendance", color: accentColor, label: "Attendance %" }]}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              At-Risk Students
            </CardTitle>
            <Badge variant="destructive" className="text-xs">{stats.atRiskCount} total</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {atRiskStudents.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs bg-red-100 text-red-700 font-semibold">{s.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">Grade {s.grade}-{s.section} · Att. {s.attendanceRate}%</p>
                </div>
                <Badge variant="destructive" className="text-xs shrink-0">At-Risk</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-violet-500" />
              Assigned Teachers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teachers.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs bg-violet-100 text-violet-700 font-semibold">{t.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{t.subject} · {t.yearsExperience}y exp.</p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {t.assignedGrades.length} grades
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              Upcoming Exams
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {upcomingExams.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{e.subject}</p>
                  <p className="text-xs text-muted-foreground">{e.type} · Grades {e.grades}</p>
                </div>
                <Badge variant="outline" className="text-xs">{e.date}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-500" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {upcomingMeetings.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.date} · {m.time} · {m.attendees} attendees</p>
                </div>
                <Badge variant="outline" className="text-xs">{m.time}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
