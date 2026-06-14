"use client";
import { TrendingUp, TrendingDown, Minus, ArrowLeft, Award, BookOpen } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendLine } from "@/components/charts";
import { childMarksTrend, childProfile } from "@/lib/mockData/parent";
import { subjectMarks } from "@/lib/mockData/student";
import { cn } from "@/lib/utils";

const gradeColor = (g: string) =>
  g.startsWith("A") ? "bg-emerald-100 text-emerald-700" : g.startsWith("B") ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700";

const avg = Math.round(subjectMarks.reduce((s, m) => s + m.marks, 0) / subjectMarks.length);
const highest = subjectMarks.reduce((a, b) => a.marks > b.marks ? a : b);
const lowest = subjectMarks.reduce((a, b) => a.marks < b.marks ? a : b);

export default function ParentMarksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Marks & Grades"
        description={`${childProfile.name} · ${childProfile.grade}`}
        breadcrumbs={[{ label: "Parent", href: "/parent" }, { label: "Marks" }]}
        actions={
          <Link href="/parent">
            <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Back to Dashboard</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><BookOpen className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-sm text-muted-foreground">Overall Average</p><p className="text-2xl font-bold">{avg}%</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2"><TrendingUp className="h-5 w-5 text-emerald-600" /></div>
            <div><p className="text-sm text-muted-foreground">Best Subject</p><p className="text-lg font-bold">{highest.subject}</p><p className="text-xs text-muted-foreground">{highest.marks}%</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2"><Award className="h-5 w-5 text-amber-600" /></div>
            <div><p className="text-sm text-muted-foreground">GPA</p><p className="text-2xl font-bold">{childProfile.gpa}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Marks by Subject</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectMarks.map((m) => (
              <div key={m.subject} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{m.subject}</p>
                    <p className="text-xs text-muted-foreground">{m.teacher}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("flex items-center gap-0.5 text-xs font-medium", m.change > 0 ? "text-emerald-600" : m.change < 0 ? "text-red-600" : "text-muted-foreground")}>
                      {m.change > 0 ? <TrendingUp className="h-3 w-3" /> : m.change < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                      {m.change > 0 ? "+" : ""}{m.change}
                    </span>
                    <span className="text-lg font-bold">{m.marks}%</span>
                    <Badge className={cn("text-xs", gradeColor(m.grade))}>{m.grade}</Badge>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full", m.marks >= 85 ? "bg-emerald-500" : m.marks >= 70 ? "bg-blue-500" : "bg-amber-500")} style={{ width: `${m.marks}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Marks Trend Over Time</CardTitle></CardHeader>
        <CardContent>
          <TrendLine
            data={childMarksTrend}
            xKey="month"
            lines={[
              { key: "math", label: "Mathematics", color: "#6366f1" },
              { key: "english", label: "English", color: "#10b981" },
              { key: "science", label: "Science", color: "#f59e0b" },
              { key: "arabic", label: "Arabic", color: "#ec4899" },
            ]}
            height={220}
          />
        </CardContent>
      </Card>
    </div>
  );
}
