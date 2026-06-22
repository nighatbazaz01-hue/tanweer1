"use client";
import { useMemo } from "react";
import {
  Star, CheckCircle, AlertCircle, DollarSign,
  MessageSquare, Sparkles, Calendar, Clock,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendLine, TrendArea } from "@/components/charts";
import { useUIStore } from "@/store/useUIStore";
import { useRouter } from "next/navigation";
import {
  childProfile, childAttendanceTrend, childMarksTrend,
  subjectTeachers, teacherReviews, feeStatus,
} from "@/lib/mockData/parent";
import { useDataStore } from "@/store/useDataStore";
import {
  filterAttendanceForRole,
  filterFeesForRole,
  DEMO_TEACHER_GRADE,
  DEMO_TEACHER_SECTION,
} from "@/lib/permissions";
import { generateFeeRecords } from "@/lib/mockData/population";
import { cn } from "@/lib/utils";

const PERIOD_TIMES: Record<string, string> = {
  P1: "07:30", P2: "08:15", P3: "09:00", P4: "10:00",
  P5: "10:45", P6: "11:30", P7: "12:45", P8: "13:30",
};

const SUBJECT_COLORS_TODAY: Record<string, string> = {
  completed: "bg-emerald-50 border-emerald-200",
  ongoing:   "bg-blue-50 border-blue-200 ring-2 ring-blue-300",
  upcoming:  "bg-slate-50 border-slate-200",
};

function getTodayName(): string {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return days.includes(day) ? day : "Monday";
}

function getScheduleStatus(time: string): "completed" | "ongoing" | "upcoming" {
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const minutesEntry = h * 60 + m;
  if (minutesEntry + 45 < minutesNow) return "completed";
  if (minutesEntry <= minutesNow) return "ongoing";
  return "upcoming";
}

export default function ParentDashboard() {
  const { toggleAiDrawer } = useUIStore();
  const router = useRouter();
  const { attendanceRecords, timetableEntries } = useDataStore();

  const todayName = getTodayName();

  // Live attendance record for this child — reactive to teacher changes
  const childAttendanceRecord = useMemo(
    () => filterAttendanceForRole(attendanceRecords, "parent")[0] ?? null,
    [attendanceRecords]
  );

  // Attendance rate — derived from live record + historical static log
  const attendanceRate = useMemo(() => {
    const todayStatus = childAttendanceRecord?.status;
    // Historical: 13 present + 1 late + 1 absent = 15 entries (from attendance page)
    const historicalPresent = 13;
    const histTotal = 15;
    const todayPresent = todayStatus === "present" ? 1 : 0;
    return Math.round(((historicalPresent + todayPresent) / (histTotal + 1)) * 100);
  }, [childAttendanceRecord]);

  // Today's schedule — from store timetableEntries, reactive to VP edits
  const todaySchedule = useMemo(() => {
    const entries = timetableEntries
      .filter(
        (e) => e.day === todayName && e.grade === String(DEMO_TEACHER_GRADE) && e.section === DEMO_TEACHER_SECTION
      )
      .sort((a, b) => (PERIOD_TIMES[a.period] ?? "").localeCompare(PERIOD_TIMES[b.period] ?? ""));
    return entries.map((e) => ({
      ...e,
      time: PERIOD_TIMES[e.period] ?? e.period,
      status: getScheduleStatus(PERIOD_TIMES[e.period] ?? "23:59"),
    }));
  }, [timetableEntries, todayName]);

  // Fee record — from generated population fee records for this child
  const childFeeRecord = useMemo(() => {
    const allFees = generateFeeRecords();
    return filterFeesForRole(allFees, "parent")[0] ?? null;
  }, []);

  const scheduleStatusStyle: Record<string, string> = {
    completed: "bg-emerald-50 border-emerald-200",
    ongoing:   "bg-blue-50 border-blue-200 ring-2 ring-blue-300",
    upcoming:  "bg-slate-50 border-slate-200",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Child's Dashboard"
        description={`Monitoring ${childProfile.name}'s academic journey`}
        breadcrumbs={[{ label: "Parent" }, { label: "Overview" }]}
        actions={
          <Button onClick={toggleAiDrawer} size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Sparkles className="h-4 w-4" />
            AI Parent Assistant
          </Button>
        }
      />

      {/* Child Overview Card */}
      <div className="rounded-xl border bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
            <AvatarFallback className="text-2xl font-bold bg-emerald-600 text-white">AA</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{childProfile.name}</h2>
            <p className="text-sm text-muted-foreground">{childProfile.studentId} · {childProfile.grade} · Roll #{childProfile.rollNumber}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <Badge className="bg-emerald-600 text-white">GPA: {childProfile.gpa}</Badge>
              <Badge variant="secondary">{childProfile.overallGrade}</Badge>
              <Badge variant="secondary">Class Rank: 7/32</Badge>
              <Badge variant="outline">Age: {childProfile.age}</Badge>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-2 text-center">
            {[
              { label: "Attendance", value: `${attendanceRate}%`, live: true },
              { label: "Overall Grade", value: "B+",   live: false },
              { label: "GPA",          value: "3.4",   live: false },
              { label: "Rank",         value: "7/32",  live: false },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-lg px-3 py-2 shadow-sm">
                <p className="text-base font-bold text-emerald-700">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                {s.live && <p className="text-[10px] text-primary">live</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live today attendance banner */}
      {childAttendanceRecord && (
        <div className={cn(
          "rounded-xl border px-4 py-3 flex items-center gap-3 text-sm",
          childAttendanceRecord.status === "present" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
          childAttendanceRecord.status === "absent"  ? "bg-red-50 border-red-200 text-red-800" :
          childAttendanceRecord.status === "late"    ? "bg-amber-50 border-amber-200 text-amber-800" :
          "bg-blue-50 border-blue-200 text-blue-800"
        )}>
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Today&apos;s attendance ({childAttendanceRecord.date}): <span className="font-semibold capitalize">{childAttendanceRecord.status}</span></span>
          <Badge variant="secondary" className="ml-auto text-xs">Live</Badge>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Attendance Rate", value: `${attendanceRate}%`, sub: "Based on live records", icon: CheckCircle, color: "bg-emerald-500" },
          { label: "Current GPA",     value: "3.4",               sub: "Grade B+ overall",      icon: Star,        color: "bg-blue-500"    },
          { label: "Fee Status",      value: childFeeRecord ? (childFeeRecord.status === "paid" ? "Paid ✅" : childFeeRecord.status === "partial" ? "Partial" : "Overdue ⚠️") : "—", sub: childFeeRecord ? `Due: ${childFeeRecord.dueDate}` : "", icon: DollarSign, color: "bg-violet-500" },
          { label: "Exams Coming",    value: "4",                 sub: "Next: Jun 20, 2026",    icon: AlertCircle, color: "bg-amber-500"   },
        ].map((s) => (
          <Card key={s.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`rounded-lg p-2.5 shrink-0 ${s.color}`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Attendance Trend — 10 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendArea
              data={childAttendanceTrend}
              xKey="month"
              lines={[{ key: "rate", color: "#10b981", label: "Attendance %" }]}
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Marks Trend by Subject — 6 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLine
              data={childMarksTrend}
              xKey="month"
              lines={[
                { key: "math",    color: "#6366f1", label: "Math"    },
                { key: "english", color: "#f59e0b", label: "English" },
                { key: "science", color: "#34d399", label: "Science" },
                { key: "urdu",    color: "#f87171", label: "Urdu"    },
              ]}
              legend
              height={200}
            />
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule + Fee Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today&apos;s Schedule — {todayName}
              <Badge variant="secondary" className="ml-auto text-xs">{todaySchedule.length} classes · live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {todaySchedule.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No classes scheduled today.</p>
            ) : (
              todaySchedule.map((cls) => (
                <div
                  key={cls.id}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl border transition-all",
                    scheduleStatusStyle[cls.status]
                  )}
                >
                  <div className="text-center w-12 shrink-0">
                    <p className="text-xs font-bold">{cls.time}</p>
                    <p className="text-[10px] text-muted-foreground">{cls.period}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{cls.subject}</p>
                    <p className="text-xs text-muted-foreground">{cls.teacher} · Room {cls.room}</p>
                  </div>
                  <Badge className={cn(
                    "text-xs shrink-0",
                    cls.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                    cls.status === "ongoing"   ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-600"
                  )}>
                    {cls.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Fee Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {childFeeRecord ? (
              <>
                <div className={cn(
                  "text-center p-4 rounded-xl border",
                  childFeeRecord.status === "paid"    ? "bg-emerald-50 border-emerald-200" :
                  childFeeRecord.status === "partial" ? "bg-amber-50 border-amber-200" :
                  "bg-red-50 border-red-200"
                )}>
                  <CheckCircle className={cn(
                    "h-8 w-8 mx-auto mb-1",
                    childFeeRecord.status === "paid"    ? "text-emerald-600" :
                    childFeeRecord.status === "partial" ? "text-amber-600" :
                    "text-red-600"
                  )} />
                  <p className="font-bold capitalize">{childFeeRecord.status === "paid" ? "All Clear!" : childFeeRecord.status}</p>
                  <p className="text-xs text-muted-foreground">{childFeeRecord.feeType}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 text-xs space-y-1.5">
                  <div className="flex justify-between"><span>Total</span><span className="font-semibold">₹{childFeeRecord.amount.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Paid</span><span className="font-semibold text-emerald-700">₹{childFeeRecord.paidAmount.toLocaleString()}</span></div>
                  {childFeeRecord.paidAmount < childFeeRecord.amount && (
                    <div className="flex justify-between"><span>Balance</span><span className="font-semibold text-red-600">₹{(childFeeRecord.amount - childFeeRecord.paidAmount).toLocaleString()}</span></div>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <p className="font-semibold text-amber-800">Due: {childFeeRecord.dueDate}</p>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                {feeStatus.history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{h.type}</p>
                      <p className="text-muted-foreground">{h.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{h.amount.toLocaleString()}</p>
                      <Badge variant="success" className="text-[10px]">Paid</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subject Teachers */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-semibold">Subject Teachers Directory</CardTitle>
          <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => router.push("/messages")}>
            <MessageSquare className="h-3 w-3 mr-1" /> Message All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {subjectTeachers.map((t) => (
              <div key={t.name} className="flex items-center gap-3 p-3 rounded-xl border hover:shadow-sm transition-shadow">
                <Avatar className="h-11 w-11 shrink-0">
                  <AvatarFallback className="text-xs font-semibold bg-blue-100 text-blue-700">{t.photo}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.subject}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-3 w-3", i < Math.floor(t.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-0.5">{t.rating}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => router.push("/messages")}>
                  <MessageSquare className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Teacher Reviews */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">My Monthly Teacher Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {teacherReviews.map((r) => (
            <div key={r.id} className="p-4 rounded-xl border space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                      {r.teacher.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{r.teacher}</p>
                    <p className="text-xs text-muted-foreground">{r.subject} · {r.month}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic">&ldquo;{r.review}&rdquo;</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
