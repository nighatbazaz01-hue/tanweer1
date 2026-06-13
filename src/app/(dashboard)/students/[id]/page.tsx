"use client";
import { useState } from "react";
import {
  User, BookOpen, ClipboardList, FileText, MessageSquare,
  DollarSign, Sparkles, Star, TrendingUp, TrendingDown,
  CheckCircle, Award, Brain, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendLine, TrendArea, SubjectRadar, DonutChart } from "@/components/charts";
import {
  student360, academicPerformance, attendanceHistory, homeworkCompletion,
  projects360, teacherRemarks, communicationHistory, feeHistory, aiSummary,
} from "@/lib/mockData/student360";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "academic", label: "Academic", icon: BookOpen },
  { id: "attendance", label: "Attendance", icon: ClipboardList },
  { id: "homework", label: "Homework & Projects", icon: FileText },
  { id: "remarks", label: "Teacher Remarks", icon: Star },
  { id: "communication", label: "Communication", icon: MessageSquare },
  { id: "fees", label: "Fee History", icon: DollarSign },
  { id: "ai", label: "AI Summary", icon: Brain },
];

const radarData = [
  { subject: "Math", score: 82 },
  { subject: "English", score: 87 },
  { subject: "Physics", score: 79 },
  { subject: "Chemistry", score: 84 },
  { subject: "Arabic", score: 91 },
  { subject: "CS", score: 88 },
];

export default function Student360Page() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-5">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Link href="/students">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Students
          </Button>
        </Link>
      </div>

      {/* Profile Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-6 text-white">
        <div className="flex items-center gap-5 flex-wrap">
          <Avatar className="h-20 w-20 ring-4 ring-white/20 shadow-xl">
            <AvatarFallback className="text-2xl font-bold bg-violet-600 text-white">AA</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{student360.name}</h1>
              <Badge className="bg-emerald-500 text-white border-0">Active</Badge>
            </div>
            <p className="text-slate-300 mt-1">{student360.studentId} · {student360.grade} · Roll #{student360.rollNumber ?? 7}</p>
            <div className="flex items-center gap-4 mt-3 flex-wrap text-sm">
              <span className="flex items-center gap-1.5 text-slate-300">
                <User className="h-3.5 w-3.5" /> {student360.gender} · Age {student360.age}
              </span>
              <span className="text-slate-300">DOB: {student360.dob}</span>
              <span className="text-slate-300">Blood: {student360.bloodGroup}</span>
              <span className="text-slate-300">Enrolled: {student360.enrollmentDate}</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { label: "GPA", value: student360.gpa, sub: "B+" },
              { label: "Rank", value: `${student360.rank}/${student360.totalStudents}`, sub: "Class" },
              { label: "Attendance", value: `${student360.attendanceRate}%`, sub: "Rate" },
              { label: "Status", value: "✅", sub: "Fees Clear" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl px-3 py-2">
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-slate-300">{s.label}</p>
                <p className="text-xs text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Row */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10 flex-wrap text-xs text-slate-300">
          <span>📧 {student360.email}</span>
          <span>📱 {student360.phone}</span>
          <span>🏠 {student360.address}</span>
          <span>👤 Parent: {student360.parentName} · {student360.parentPhone}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Academic Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendLine
                  data={academicPerformance}
                  xKey="term"
                  lines={[
                    { key: "math", color: "#6366f1", label: "Math" },
                    { key: "english", color: "#f59e0b", label: "English" },
                    { key: "arabic", color: "#f87171", label: "Arabic" },
                    { key: "avg", color: "#34d399", label: "Average" },
                  ]}
                  legend
                  height={200}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Attendance History</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendArea
                  data={attendanceHistory}
                  xKey="month"
                  lines={[{ key: "rate", color: "#34d399", label: "Attendance %" }]}
                  height={160}
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Subject Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <SubjectRadar data={radarData} height={220} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Attendance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={[
                    { name: "Present", value: 178, color: "#34d399" },
                    { name: "Absent", value: 8, color: "#f87171" },
                    { name: "Late", value: 3, color: "#f59e0b" },
                  ]}
                  height={150}
                  innerRadius={35}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── ACADEMIC ── */}
      {activeTab === "academic" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">5-Term Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendLine
                  data={academicPerformance}
                  xKey="term"
                  lines={[
                    { key: "math", color: "#6366f1", label: "Math" },
                    { key: "english", color: "#f59e0b", label: "English" },
                    { key: "physics", color: "#60a5fa", label: "Physics" },
                    { key: "chemistry", color: "#34d399", label: "Chemistry" },
                    { key: "arabic", color: "#f87171", label: "Arabic" },
                  ]}
                  legend
                  height={240}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Subject Radar — Current Term</CardTitle>
              </CardHeader>
              <CardContent>
                <SubjectRadar data={radarData} height={240} />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Current Term Subject Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { subject: "Arabic Language", score: 91, grade: "A", teacher: "Mr. Hassan Al-Shehri", change: 3 },
                  { subject: "Computer Science", score: 88, grade: "A-", teacher: "Mr. Tariq Al-Yami", change: 5 },
                  { subject: "English Language", score: 87, grade: "A-", teacher: "Ms. Reem Al-Harbi", change: 2 },
                  { subject: "Chemistry", score: 84, grade: "A-", teacher: "Dr. Layla Al-Anazi", change: 6 },
                  { subject: "Mathematics", score: 82, grade: "B+", teacher: "Dr. Sarah Al-Hamdan", change: 4 },
                  { subject: "Physics", score: 79, grade: "B+", teacher: "Mr. Khalid Al-Mutairi", change: -1 },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">{s.subject}</p>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-xs flex items-center gap-0.5",
                            s.change > 0 ? "text-emerald-600" : "text-red-500")}>
                            {s.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {Math.abs(s.change)}
                          </span>
                          <Badge variant="secondary" className="text-xs">{s.grade}</Badge>
                          <span className="text-sm font-bold">{s.score}/100</span>
                        </div>
                      </div>
                      <div className="bg-muted rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.teacher}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── ATTENDANCE ── */}
      {activeTab === "attendance" && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Overall Rate", value: `${student360.attendanceRate}%`, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Total Present", value: "178 days", color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Total Absent", value: "11 days", color: "text-red-600", bg: "bg-red-50" },
            ].map((s) => (
              <Card key={s.label} className={s.bg}>
                <CardContent className="p-4 text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Monthly Attendance Rate — 10 Months</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendArea
                data={attendanceHistory}
                xKey="month"
                lines={[{ key: "rate", color: "#34d399", label: "Attendance %" }]}
                height={220}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attendanceHistory.map((m, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 items-center text-xs py-1.5 border-b last:border-0">
                    <span className="font-medium">{m.month}</span>
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${m.rate}%` }} />
                      </div>
                      <span className="font-semibold text-emerald-700 w-8">{m.rate}%</span>
                    </div>
                    <span className="text-center text-emerald-600">{m.present}P</span>
                    <span className={cn("text-center", m.absent > 0 ? "text-red-500" : "text-muted-foreground")}>
                      {m.absent}A / {m.late}L
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── HOMEWORK & PROJECTS ── */}
      {activeTab === "homework" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Homework Completion Rate — 10 Months</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendArea
                  data={homeworkCompletion}
                  xKey="month"
                  lines={[{ key: "rate", color: "#6366f1", label: "Completion %" }]}
                  height={200}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Projects Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projects360.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border">
                    <div className={cn(
                      "p-1.5 rounded-lg shrink-0",
                      p.status === "completed" ? "bg-emerald-100" : "bg-amber-100"
                    )}>
                      {p.status === "completed"
                        ? <CheckCircle className="h-4 w-4 text-emerald-600" />
                        : <FileText className="h-4 w-4 text-amber-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.subject} · {p.term}</p>
                    </div>
                    {p.grade ? (
                      <div className="text-right shrink-0">
                        <Badge variant="success" className="text-xs">{p.grade}</Badge>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.score}/100</p>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="shrink-0 text-xs">In Progress</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── TEACHER REMARKS ── */}
      {activeTab === "remarks" && (
        <div className="space-y-4">
          {teacherRemarks.map((r, i) => (
            <Card key={i} className={cn(
              "border-l-4",
              r.sentiment === "positive" ? "border-l-emerald-500" :
              r.sentiment === "neutral" ? "border-l-amber-500" : "border-l-red-500"
            )}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-semibold">
                        {r.teacher.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{r.teacher}</p>
                      <p className="text-xs text-muted-foreground">{r.subject} · {r.date}</p>
                    </div>
                  </div>
                  <Badge
                    variant={r.sentiment === "positive" ? "success" : r.sentiment === "neutral" ? "warning" : "destructive"}
                    className="text-xs shrink-0"
                  >
                    {r.sentiment}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground italic border-l-2 border-muted pl-3">
                  &ldquo;{r.remark}&rdquo;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── COMMUNICATION ── */}
      {activeTab === "communication" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              New Message
            </Button>
          </div>
          {communicationHistory.map((msg, i) => (
            <Card key={i} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-start gap-4">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="text-xs bg-violet-100 text-violet-700">
                    {msg.from.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold">{msg.from}</p>
                    <Badge variant="secondary" className="text-xs">{msg.type}</Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{msg.date}</span>
                  </div>
                  <p className="text-sm font-medium mt-0.5">{msg.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{msg.preview}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs shrink-0">Open</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── FEES ── */}
      {activeTab === "fees" && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Paid (Lifetime)", value: "SAR 58,000", color: "text-emerald-600", icon: CheckCircle },
              { label: "Outstanding Balance", value: "SAR 0", color: "text-blue-600", icon: DollarSign },
              { label: "Next Due", value: "Oct 30, 2024", color: "text-amber-600", icon: Award },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <s.icon className={`h-8 w-8 ${s.color}`} />
                  <div>
                    <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Fee Payment History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {feeHistory.map((fee, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{fee.term}</p>
                    <p className="text-xs text-muted-foreground">Paid: {fee.paidDate} · {fee.method}</p>
                    <p className="text-xs text-muted-foreground">Receipt: {fee.receipt}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">SAR {fee.amount.toLocaleString()}</p>
                    <Badge variant="success" className="text-xs">Paid ✓</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── AI SUMMARY ── */}
      {activeTab === "ai" && (
        <div className="space-y-5">
          <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-violet-800">
                <Brain className="h-5 w-5 text-violet-600" />
                AI-Generated Student Summary
                <Badge className="bg-violet-600 text-white ml-2 text-xs">Powered by Tanweer AI</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                {aiSummary.split("\n\n").map((para, i) => (
                  <p key={i} className="mb-3 last:mb-0">{para}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" /> Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {["Arabic Language (91/100)", "Consistent improvement trajectory", "Strong attendance (94.3%)", "Team collaboration in projects"].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-xs text-emerald-800">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" /> {s}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4" /> Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {["Physics declining (-1 pts)", "English essay not started", "Time management under exam pressure", "CS Python project behind schedule"].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-xs text-amber-800">
                    <Award className="h-3.5 w-3.5 shrink-0" /> {s}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-blue-800 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {["Enroll in Math Olympiad team", "Parent meeting re: Physics decline", "Schedule 1-on-1 tutoring for Physics", "Advanced Arabic Literature elective"].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-xs text-blue-800">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" /> {s}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
