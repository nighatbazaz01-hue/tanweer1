"use client";
import { useMemo } from "react";
import { CheckCircle, XCircle, Clock, ArrowLeft, TrendingUp, Calendar, Flame, Shield } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendArea } from "@/components/charts";
import { studentAttendance } from "@/lib/mockData/student";
import { childAttendanceTrend } from "@/lib/mockData/parent";
import { useDataStore } from "@/store/useDataStore";
import { filterAttendanceForRole } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const historicalLog = [
  { date: "Jun 18, 2026", day: "Thursday",  status: "present" as const },
  { date: "Jun 17, 2026", day: "Wednesday", status: "present" as const },
  { date: "Jun 16, 2026", day: "Tuesday",   status: "late"    as const },
  { date: "Jun 15, 2026", day: "Monday",    status: "present" as const },
  { date: "Jun 12, 2026", day: "Friday",    status: "present" as const },
  { date: "Jun 11, 2026", day: "Thursday",  status: "present" as const },
  { date: "Jun 10, 2026", day: "Wednesday", status: "absent"  as const },
  { date: "Jun 9, 2026",  day: "Tuesday",   status: "present" as const },
  { date: "Jun 8, 2026",  day: "Monday",    status: "present" as const },
  { date: "Jun 5, 2026",  day: "Friday",    status: "present" as const },
  { date: "Jun 4, 2026",  day: "Thursday",  status: "absent"  as const },
  { date: "Jun 3, 2026",  day: "Wednesday", status: "present" as const },
  { date: "Jun 2, 2026",  day: "Tuesday",   status: "present" as const },
  { date: "Jun 1, 2026",  day: "Monday",    status: "present" as const },
];

const statusConfig: Record<string, { label: string; icon: React.ElementType; cls: string; dot: string; iconCls: string }> = {
  present: { label: "Present", icon: CheckCircle, cls: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", iconCls: "text-emerald-600" },
  absent:  { label: "Absent",  icon: XCircle,     cls: "bg-red-100 text-red-700",         dot: "bg-red-500",     iconCls: "text-red-600" },
  late:    { label: "Late",    icon: Clock,        cls: "bg-amber-100 text-amber-700",     dot: "bg-amber-500",   iconCls: "text-amber-600" },
  excused: { label: "Excused", icon: Shield,       cls: "bg-blue-100 text-blue-700",       dot: "bg-blue-400",    iconCls: "text-blue-600" },
};

export default function StudentAttendancePage() {
  const { attendanceRecords } = useDataStore();

  // Live record for this student — reactive to teacher's attendance marks
  const liveRecord = useMemo(
    () => filterAttendanceForRole(attendanceRecords, "student")[0] ?? null,
    [attendanceRecords]
  );

  // Full log: today from store (live) prepended to static historical entries
  const fullLog = useMemo(() => {
    const todayEntry = liveRecord
      ? {
          date:   liveRecord.date,
          day:    new Date().toLocaleDateString("en-US", { weekday: "long" }),
          status: liveRecord.status as "present" | "absent" | "late" | "excused",
        }
      : null;
    return todayEntry ? [todayEntry, ...historicalLog] : historicalLog;
  }, [liveRecord]);

  const present = fullLog.filter((r) => r.status === "present").length;
  const absent  = fullLog.filter((r) => r.status === "absent").length;
  const late    = fullLog.filter((r) => r.status === "late").length;
  const rate    = Math.round((present / fullLog.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Attendance"
        description="Grade 10-A · Ahmed Al-Rashidi"
        breadcrumbs={[{ label: "Dashboard", href: "/student-view" }, { label: "Attendance" }]}
        actions={
          <Link href="/student-view">
            <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Dashboard</Button>
          </Link>
        }
      />

      {/* Today's live status banner — updates instantly when teacher marks attendance */}
      {liveRecord && (() => {
        const cfg = statusConfig[liveRecord.status] ?? statusConfig.present;
        const Icon = cfg.icon;
        return (
          <div className={cn("rounded-xl border-2 p-4 flex items-center gap-4", cfg.cls)}>
            <Icon className={cn("h-8 w-8 shrink-0", cfg.iconCls)} />
            <div>
              <p className="font-bold text-sm">Today — {liveRecord.date}</p>
              <p className="text-xs opacity-80">
                Status: <span className="font-semibold capitalize">{liveRecord.status}</span> · Updated live from teacher records
              </p>
            </div>
            <Badge className={cn("ml-auto text-sm px-3 py-1", cfg.cls)}>{cfg.label}</Badge>
          </div>
        );
      })()}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Attendance Rate",  value: `${rate}%`,                  icon: TrendingUp,  color: "emerald" },
          { label: "Days Present",     value: present,                      icon: CheckCircle, color: "emerald" },
          { label: "Days Absent",      value: absent,                       icon: XCircle,     color: "red" },
          { label: "Current Streak",   value: `${studentAttendance.streak} days`, icon: Flame, color: "orange" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`rounded-lg bg-${color}-100 p-2`}><Icon className={`h-4 w-4 text-${color}-600`} /></div>
              <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-xl font-bold">{value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-500" />Monthly Trend</CardTitle></CardHeader>
        <CardContent>
          <TrendArea data={childAttendanceTrend} xKey="month" lines={[{ key: "rate", label: "Attendance %", color: "#10b981" }]} height={180} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />Recent Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {fullLog.map((r, idx) => {
              const cfg = statusConfig[r.status] ?? statusConfig.present;
              const Icon = cfg.icon;
              const isToday = idx === 0 && !!liveRecord;
              return (
                <div
                  key={r.date}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-4 py-2.5 transition-colors",
                    isToday && "border-primary/40 bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("h-2 w-2 rounded-full shrink-0", cfg.dot)} />
                    <Icon className={cn("h-4 w-4", cfg.iconCls)} />
                    <div>
                      <p className="text-sm font-medium">
                        {r.date}
                        {isToday && <span className="ml-2 text-xs text-primary font-normal">(live)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{r.day}</p>
                    </div>
                  </div>
                  <Badge className={cn("text-xs", cfg.cls)}>{cfg.label}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
