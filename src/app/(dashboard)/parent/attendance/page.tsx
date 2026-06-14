"use client";
import { CheckCircle, XCircle, Clock, ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendArea } from "@/components/charts";
import { childAttendanceTrend, childProfile } from "@/lib/mockData/parent";
import { cn } from "@/lib/utils";

const attendanceLog = [
  { date: "Jun 13, 2024", day: "Thursday", status: "present" },
  { date: "Jun 12, 2024", day: "Wednesday", status: "present" },
  { date: "Jun 11, 2024", day: "Tuesday", status: "present" },
  { date: "Jun 10, 2024", day: "Monday", status: "late" },
  { date: "Jun 9, 2024", day: "Sunday", status: "present" },
  { date: "Jun 6, 2024", day: "Thursday", status: "present" },
  { date: "Jun 5, 2024", day: "Wednesday", status: "present" },
  { date: "Jun 4, 2024", day: "Tuesday", status: "absent" },
  { date: "Jun 3, 2024", day: "Monday", status: "present" },
  { date: "Jun 2, 2024", day: "Sunday", status: "present" },
  { date: "May 30, 2024", day: "Thursday", status: "present" },
  { date: "May 29, 2024", day: "Wednesday", status: "absent" },
  { date: "May 28, 2024", day: "Tuesday", status: "present" },
  { date: "May 27, 2024", day: "Monday", status: "present" },
  { date: "May 26, 2024", day: "Sunday", status: "present" },
];

const statusConfig: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  present: { label: "Present", icon: CheckCircle, cls: "bg-emerald-100 text-emerald-700" },
  absent: { label: "Absent", icon: XCircle, cls: "bg-red-100 text-red-700" },
  late: { label: "Late", icon: Clock, cls: "bg-amber-100 text-amber-700" },
};

const present = attendanceLog.filter((r) => r.status === "present").length;
const absent = attendanceLog.filter((r) => r.status === "absent").length;
const late = attendanceLog.filter((r) => r.status === "late").length;
const rate = Math.round((present / attendanceLog.length) * 100);

export default function ParentAttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Record"
        description={`${childProfile.name} · ${childProfile.grade}`}
        breadcrumbs={[{ label: "Parent", href: "/parent" }, { label: "Attendance" }]}
        actions={
          <Link href="/parent">
            <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Back to Dashboard</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Attendance Rate", value: `${rate}%`, icon: TrendingUp, color: "emerald" },
          { label: "Days Present", value: present, icon: CheckCircle, color: "emerald" },
          { label: "Days Absent", value: absent, icon: XCircle, color: "red" },
          { label: "Late Arrivals", value: late, icon: Clock, color: "amber" },
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
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-500" />Monthly Attendance Trend</CardTitle></CardHeader>
        <CardContent>
          <TrendArea data={childAttendanceTrend} xKey="month" lines={[{ key: "rate", label: "Attendance %", color: "#10b981" }]} height={200} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4 text-purple-500" />Recent Attendance Log</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {attendanceLog.map((r) => {
              const cfg = statusConfig[r.status];
              const Icon = cfg.icon;
              return (
                <div key={r.date} className="flex items-center justify-between rounded-lg border px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", r.status === "present" ? "text-emerald-600" : r.status === "absent" ? "text-red-600" : "text-amber-600")} />
                    <div>
                      <p className="text-sm font-medium">{r.date}</p>
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
