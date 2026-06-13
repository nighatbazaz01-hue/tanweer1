"use client";
import { CheckCircle, XCircle, Clock, Shield } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockAttendance } from "@/lib/mockData";
import type { AttendanceRecord } from "@/types";

const statusConfig: Record<
  AttendanceRecord["status"],
  { label: string; variant: "success" | "destructive" | "warning" | "secondary"; icon: React.ElementType; color: string }
> = {
  present: { label: "Present", variant: "success", icon: CheckCircle, color: "text-green-600" },
  absent: { label: "Absent", variant: "destructive", icon: XCircle, color: "text-red-600" },
  late: { label: "Late", variant: "warning", icon: Clock, color: "text-amber-600" },
  excused: { label: "Excused", variant: "secondary", icon: Shield, color: "text-blue-600" },
};

export default function AttendancePage() {
  const presentCount = mockAttendance.filter((a) => a.status === "present").length;
  const absentCount = mockAttendance.filter((a) => a.status === "absent").length;
  const lateCount = mockAttendance.filter((a) => a.status === "late").length;
  const rate = Math.round((presentCount / mockAttendance.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Track and manage daily student attendance records"
        breadcrumbs={[{ label: "Home" }, { label: "Attendance" }]}
        actions={
          <Button size="sm">Mark Attendance</Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard title="Present" value={presentCount} subtitle={`${rate}% rate`} icon={CheckCircle} iconClassName="bg-green-500" />
        <StatsCard title="Absent" value={absentCount} subtitle="Today" icon={XCircle} iconClassName="bg-red-500" />
        <StatsCard title="Late" value={lateCount} subtitle="Today" icon={Clock} iconClassName="bg-amber-500" />
        <StatsCard title="Overall Rate" value={`${rate}%`} subtitle="Today" icon={Shield} iconClassName="bg-blue-500" />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Today&apos;s Attendance — June 13, 2024
        </h2>
        {mockAttendance.map((record) => {
          const status = statusConfig[record.status];
          const Icon = status.icon;
          return (
            <Card key={record.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <Icon className={`h-5 w-5 ${status.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{record.studentName}</p>
                  <p className="text-xs text-muted-foreground">{record.grade} · {record.date}</p>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
                <Button variant="ghost" size="sm" className="text-xs hidden sm:flex">
                  Edit
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
