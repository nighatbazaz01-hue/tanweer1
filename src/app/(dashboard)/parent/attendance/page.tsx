"use client";
import { useMemo } from "react";
import { CheckCircle, XCircle, Clock, Shield, ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendArea } from "@/components/charts";
import { childAttendanceTrend, childProfile } from "@/lib/mockData/parent";
import { useDataStore } from "@/store/useDataStore";
import { filterAttendanceForRole } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const statusConfig = {
  present: { label: "Present", icon: CheckCircle, cls: "bg-emerald-100 text-emerald-700", iconCls: "text-emerald-600" },
  absent:  { label: "Absent",  icon: XCircle,     cls: "bg-red-100 text-red-700",         iconCls: "text-red-600"     },
  late:    { label: "Late",    icon: Clock,        cls: "bg-amber-100 text-amber-700",     iconCls: "text-amber-600"   },
  excused: { label: "Excused", icon: Shield,       cls: "bg-blue-100 text-blue-700",       iconCls: "text-blue-600"    },
} as const;

// Historical attendance log — static prior months, today row comes from store
const historicalLog = [
  { date: "Jun 12, 2026", day: "Wednesday", status: "present" as const },
  { date: "Jun 11, 2026", day: "Tuesday",   status: "present" as const },
  { date: "Jun 10, 2026", day: "Monday",    status: "late"    as const },
  { date: "Jun 9, 2026",  day: "Sunday",    status: "present" as const },
  { date: "Jun 5, 2026",  day: "Thursday",  status: "present" as const },
  { date: "Jun 4, 2026",  day: "Wednesday", status: "present" as const },
  { date: "Jun 3, 2026",  day: "Tuesday",   status: "absent"  as const },
  { date: "Jun 2, 2026",  day: "Monday",    status: "present" as const },
  { date: "Jun 1, 2026",  day: "Sunday",    status: "present" as const },
  { date: "May 29, 2026", day: "Thursday",  status: "present" as const },
  { date: "May 28, 2026", day: "Wednesday", status: "present" as const },
  { date: "May 27, 2026", day: "Tuesday",   status: "absent"  as const },
  { date: "May 26, 2026", day: "Monday",    status: "present" as const },
  { date: "May 25, 2026", day: "Sunday",    status: "present" as const },
];

export default function ParentAttendancePage() {
  const { attendanceRecords } = useDataStore();

  // Live record for the child (STU-0451) — reactive to teacher changes
  const childRecord = useMemo(
    () => filterAttendanceForRole(attendanceRecords, "parent")[0] ?? null,
    [attendanceRecords]
  );

  // Full log: today from store (live) + historical static entries
  const fullLog = useMemo(() => {
    const todayEntry = childRecord
      ? { date: childRecord.date, day: new Date().toLocaleDateString("en-US", { weekday: "long" }), status: childRecord.status }
      : null;
    return todayEntry ? [todayEntry, ...historicalLog] : historicalLog;
  }, [childRecord]);

  // Stats derived from combined log
  const present = fullLog.filter((r) => r.status === "present").length;
  const absent  = fullLog.filter((r) => r.status === "absent").length;
  const late    = fullLog.filter((r) => r.status === "late").length;
  const rate    = Math.round((present / fullLog.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Record"
        description={`${childProfile.name} · ${childProfile.grade}`}
        breadcrumbs={[{ label: "Parent", href: "/parent" }, { label: "Attendance" }]}
        actions={
          <Link href="/parent">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        }
      />

      {/* Today's live status banner */}
      {childRecord && (() => {
        const cfg = statusConfig[childRecord.status];
        const Icon = cfg.icon;
        return (
          <div className={cn("rounded-xl border-2 p-4 flex items-center gap-4", cfg.cls)}>
            <Icon className={cn("h-8 w-8 shrink-0", cfg.iconCls)} />
            <div>
              <p className="font-bold text-sm">Today — {childRecord.date}</p>
              <p className="text-xs opacity-80">Status: <span className="font-semibold capitalize">{childRecord.status}</span> · Updated live from teacher records</p>
            </div>
            <Badge className={cn("ml-auto text-sm px-3 py-1", cfg.cls)}>{cfg.label}</Badge>
          </div>
        );
      })()}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Attendance Rate", value: `${rate}%`,  icon: TrendingUp,  color: "emerald" },
          { label: "Days Present",    value: present,      icon: CheckCircle, color: "emerald" },
          { label: "Days Absent",     value: absent,       icon: XCircle,     color: "red"     },
          { label: "Late Arrivals",   value: late,         icon: Clock,       color: "amber"   },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`rounded-lg bg-${color}-100 p-2`}>
                <Icon className={`h-4 w-4 text-${color}-600`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" /> Monthly Attendance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TrendArea
            data={childAttendanceTrend}
            xKey="month"
            lines={[{ key: "rate", label: "Attendance %", color: "#10b981" }]}
            height={200}
          />
        </CardContent>
      </Card>

      {/* Attendance log — today row is live from store */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-500" /> Attendance Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {fullLog.map((r, idx) => {
              const cfg = statusConfig[r.status];
              const Icon = cfg.icon;
              const isToday = idx === 0 && !!childRecord;
              return (
                <div
                  key={r.date}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-4 py-2.5 transition-colors",
                    isToday && "border-primary/40 bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", cfg.iconCls)} />
                    <div>
                      <p className="text-sm font-medium">
                        {r.date}
                        {isToday && <span className="ml-2 text-xs text-primary font-normal">(live)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{r.day}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isToday && (
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px]">{childRecord?.avatar}</AvatarFallback>
                      </Avatar>
                    )}
                    <Badge className={cn("text-xs", cfg.cls)}>{cfg.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
