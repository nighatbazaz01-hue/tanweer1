"use client";
import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, ArrowLeft, Award, BookOpen, Star } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendLine } from "@/components/charts";
import { subjectMarks as staticSubjectMarks, studentProfile } from "@/lib/mockData/student";
import { childMarksTrend } from "@/lib/mockData/parent";
import { useDataStore } from "@/store/useDataStore";
import { DEMO_CHILD_ID } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const gradeColor = (g: string) =>
  g.startsWith("A") ? "bg-emerald-100 text-emerald-700" :
  g.startsWith("B") ? "bg-blue-100 text-blue-700" :
  "bg-amber-100 text-amber-700";

export default function StudentMarksPage() {
  const { gradeRecords } = useDataStore();

  // Overlay live store records on top of static subject marks
  const subjectMarks = useMemo(() => {
    const childGrades = gradeRecords.filter((r) => r.studentId === DEMO_CHILD_ID);
    return staticSubjectMarks.map((m) => {
      const live = childGrades.find((r) => r.subject === m.subject);
      return live
        ? { ...m, marks: live.marks, grade: live.grade, change: live.change, teacher: live.teacher, updatedAt: live.updatedAt, isLive: true }
        : { ...m, isLive: false };
    });
  }, [gradeRecords]);

  const avg     = Math.round(subjectMarks.reduce((s, m) => s + m.marks, 0) / subjectMarks.length);
  const highest = subjectMarks.reduce((a, b) => a.marks > b.marks ? a : b);
  const lowest  = subjectMarks.reduce((a, b) => a.marks < b.marks ? a : b);
  const improved = subjectMarks.filter((m) => m.change > 0).length;
  const liveCount = subjectMarks.filter((m) => m.isLive).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Marks"
        description={`${studentProfile.grade} · GPA ${studentProfile.gpa} · Rank #${studentProfile.rank} of ${studentProfile.totalStudents}`}
        breadcrumbs={[{ label: "Dashboard", href: "/student-view" }, { label: "My Marks" }]}
        actions={
          <Link href="/student-view">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />Dashboard
            </Button>
          </Link>
        }
      />

      {liveCount > 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 flex items-center gap-2">
          <Star className="h-4 w-4 shrink-0" />
          <span>{liveCount} subject{liveCount > 1 ? "s" : ""} recently graded by your teacher — scores are up to date.</span>
          <Badge variant="secondary" className="ml-auto text-xs">Teacher-Updated</Badge>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Average Score",     value: `${avg}%`,              sub: undefined,            icon: BookOpen,     color: "blue"    },
          { label: "Best Subject",      value: highest.subject,        sub: `${highest.marks}%`,  icon: Award,        color: "emerald" },
          { label: "Needs Focus",       value: lowest.subject,         sub: `${lowest.marks}%`,   icon: TrendingDown, color: "amber"   },
          { label: "Subjects Improved", value: `${improved}/${subjectMarks.length}`, sub: undefined, icon: TrendingUp, color: "purple"  },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`rounded-lg bg-${color}-100 p-2 shrink-0`}>
                <Icon className={`h-4 w-4 text-${color}-600`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-bold truncate">{value}</p>
                {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Subject Marks
            {liveCount > 0 && <Badge variant="secondary" className="text-xs ml-1">{liveCount} live</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectMarks.map((m) => (
              <div key={m.subject} className={cn(
                "rounded-lg border p-4 transition-colors",
                m.isLive && "border-emerald-200 bg-emerald-50/40"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{m.subject}</p>
                      {m.isLive && <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300 px-1.5 py-0">updated</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {m.teacher}
                      {m.isLive && "updatedAt" in m && <span className="ml-1">· {(m as { updatedAt: string }).updatedAt}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
                      m.change > 0 ? "text-emerald-600" : m.change < 0 ? "text-red-600" : "text-muted-foreground"
                    )}>
                      {m.change > 0 ? <TrendingUp className="h-3 w-3" /> : m.change < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                      {m.change > 0 ? "+" : ""}{m.change}
                    </span>
                    <span className="text-xl font-bold">{m.marks}%</span>
                    <Badge className={cn("text-xs min-w-[3rem] justify-center", gradeColor(m.grade))}>{m.grade}</Badge>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      m.marks >= 85 ? "bg-emerald-500" : m.marks >= 70 ? "bg-blue-500" : "bg-amber-500"
                    )}
                    style={{ width: `${m.marks}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />Marks Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TrendLine
            data={childMarksTrend}
            xKey="month"
            lines={[
              { key: "math",    label: "Mathematics", color: "#6366f1" },
              { key: "english", label: "English",     color: "#10b981" },
              { key: "science", label: "Science",     color: "#f59e0b" },
              { key: "arabic",  label: "Arabic",      color: "#ec4899" },
            ]}
            height={200}
          />
        </CardContent>
      </Card>
    </div>
  );
}
