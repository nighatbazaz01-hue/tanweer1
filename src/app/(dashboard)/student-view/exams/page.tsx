"use client";
import { Calendar, Clock, MapPin, BookOpen, ArrowLeft, Award, AlertCircle } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { upcomingExams } from "@/lib/mockData/student";
import { cn } from "@/lib/utils";

const pastExams = [
  { subject: "Mathematics", date: "Mar 15, 2024", type: "Mid-Term", score: 78, total: 100, grade: "B+", weight: "30%" },
  { subject: "English", date: "Mar 17, 2024", type: "Mid-Term", score: 85, total: 100, grade: "A-", weight: "30%" },
  { subject: "Physics", date: "Mar 20, 2024", type: "Mid-Term", score: 72, total: 100, grade: "B", weight: "30%" },
  { subject: "Chemistry", date: "Mar 22, 2024", type: "Mid-Term", score: 80, total: 100, grade: "B+", weight: "30%" },
  { subject: "Urdu",   date: "Jan 10, 2026", type: "Final", score: 92, total: 100, grade: "A", weight: "40%" },
  { subject: "Mathematics", date: "Jan 8, 2024", type: "Final", score: 76, total: 100, grade: "B+", weight: "40%" },
];

const typeColor: Record<string, string> = {
  "Mid-Term": "bg-blue-100 text-blue-700",
  "Final": "bg-purple-100 text-purple-700",
  "Quiz": "bg-amber-100 text-amber-700",
  "Practical": "bg-emerald-100 text-emerald-700",
};

const gradeColor = (g: string) =>
  g.startsWith("A") ? "bg-emerald-100 text-emerald-700" : g.startsWith("B") ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700";

const avg = Math.round(pastExams.reduce((s, e) => s + e.score, 0) / pastExams.length);
const highest = pastExams.reduce((a, b) => a.score > b.score ? a : b);

export default function StudentExamsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Exams"
        description="Upcoming exams and past results"
        breadcrumbs={[{ label: "Dashboard", href: "/student-view" }, { label: "Exams" }]}
        actions={
          <Link href="/student-view">
            <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Dashboard</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2"><AlertCircle className="h-4 w-4 text-blue-600" /></div>
          <div><p className="text-xs text-muted-foreground">Upcoming</p><p className="text-xl font-bold">{upcomingExams.length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-100 p-2"><Award className="h-4 w-4 text-emerald-600" /></div>
          <div><p className="text-xs text-muted-foreground">Average Score</p><p className="text-xl font-bold">{avg}%</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-2"><BookOpen className="h-4 w-4 text-purple-600" /></div>
          <div><p className="text-xs text-muted-foreground">Best Subject</p><p className="text-base font-bold">{highest.subject}</p><p className="text-xs text-muted-foreground">{highest.score}%</p></div>
        </CardContent></Card>
      </div>

      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2"><AlertCircle className="h-4 w-4 text-red-500" />Upcoming Exams</h2>
        <div className="grid gap-3">
          {upcomingExams.map((e) => (
            <Card key={e.subject} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{e.subject}</p>
                      <Badge className={cn("text-xs", typeColor[e.type] ?? "bg-slate-100 text-slate-600")}>{e.type}</Badge>
                      <Badge variant="outline" className="text-xs">Weight: {e.weight}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{e.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{e.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{e.room}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Syllabus: {e.syllabus}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2"><Award className="h-4 w-4 text-purple-500" />Past Results</h2>
        <div className="space-y-2">
          {pastExams.map((e, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{e.subject}</p>
                  <Badge className={cn("text-xs", typeColor[e.type] ?? "bg-slate-100")}>{e.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{e.date} · Weight: {e.weight}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold">{e.score}/{e.total}</span>
                <Badge className={cn("text-xs", gradeColor(e.grade))}>{e.grade}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
