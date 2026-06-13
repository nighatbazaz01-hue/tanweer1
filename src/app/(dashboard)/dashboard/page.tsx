"use client";
import {
  Users, GraduationCap, TrendingUp, DollarSign,
  UserCheck, AlertCircle, Calendar, BookOpen,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockDashboardStats, mockStudents, mockAttendance, mockFeeRecords } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

const recentActivities = [
  { id: 1, type: "admission", text: "New admission inquiry from Hassan Al-Qahtani", time: "2 min ago", color: "bg-blue-500" },
  { id: 2, type: "fee", text: "Fee payment received from Ahmed Al-Rashidi", time: "15 min ago", color: "bg-green-500" },
  { id: 3, type: "attendance", text: "Attendance marked for Grade 10-A (48/50)", time: "1 hr ago", color: "bg-orange-500" },
  { id: 4, type: "alert", text: "3 students flagged for low attendance risk", time: "2 hrs ago", color: "bg-red-500" },
  { id: 5, type: "grade", text: "Exam results published for Grade 11 Mathematics", time: "3 hrs ago", color: "bg-purple-500" },
];

export default function DashboardPage() {
  const absentToday = mockAttendance.filter((a) => a.status === "absent").length;
  const overdueFeesCount = mockFeeRecords.filter((f) => f.status === "overdue").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening at Al-Noor Academy today."
        breadcrumbs={[{ label: "Home" }, { label: "Dashboard" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={mockDashboardStats.totalStudents.toLocaleString()}
          subtitle="Active enrollments"
          icon={Users}
          trend={{ value: 5.2, positive: true }}
          iconClassName="bg-blue-500"
        />
        <StatsCard
          title="Teachers"
          value={mockDashboardStats.totalTeachers}
          subtitle="Academic staff"
          icon={GraduationCap}
          trend={{ value: 2.1, positive: true }}
          iconClassName="bg-green-500"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${mockDashboardStats.attendanceRate}%`}
          subtitle={`${absentToday} absent today`}
          icon={UserCheck}
          trend={{ value: 1.3, positive: true }}
          iconClassName="bg-amber-500"
        />
        <StatsCard
          title="Fee Collection"
          value={`${mockDashboardStats.feeCollectionRate}%`}
          subtitle={`${overdueFeesCount} overdue accounts`}
          icon={DollarSign}
          trend={{ value: 3.1, positive: false }}
          iconClassName="bg-violet-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${activity.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">New Admissions</span>
                <Badge variant="info">{mockDashboardStats.newAdmissions}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pending Fees</span>
                <Badge variant="warning">{mockDashboardStats.pendingFees}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">At-Risk Students</span>
                <Badge variant="destructive">23</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Exams This Week</span>
                <Badge variant="secondary">8</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Today&apos;s Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { time: "08:00", label: "Morning Assembly", grade: "All Grades" },
                { time: "10:30", label: "Board Meeting", grade: "Admin" },
                { time: "14:00", label: "Parent Meeting", grade: "Grade 10" },
                { time: "15:30", label: "Staff Training", grade: "Teachers" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-xs text-muted-foreground w-10 shrink-0">{item.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.grade}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "AI Insights Ready", desc: "3 predictive alerts need attention", icon: AlertCircle, color: "text-amber-600 bg-amber-50 border-amber-200" },
          { title: "Upcoming Exams", desc: "Mid-term exams starting June 20", icon: BookOpen, color: "text-blue-600 bg-blue-50 border-blue-200" },
          { title: "Monthly Report", desc: "May 2024 report is ready to download", icon: Calendar, color: "text-green-600 bg-green-50 border-green-200" },
        ].map((item, i) => (
          <Card key={i} className={`border ${item.color.split(" ")[2]}`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.color.split(" ")[1]}`}>
                <item.icon className={`h-5 w-5 ${item.color.split(" ")[0]}`} />
              </div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
