"use client";
import { BookOpen, Calendar, FileText, Users } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockTeachers } from "@/lib/mockData";

const subjects = [
  { name: "Mathematics", teacher: "Dr. Sarah Al-Hamdan", grade: "Grade 10-12", students: 342 },
  { name: "Physics", teacher: "Mr. Khalid Al-Mutairi", grade: "Grade 10-12", students: 198 },
  { name: "English Language", teacher: "Ms. Reem Al-Harbi", grade: "All Grades", students: 890 },
  { name: "Arabic Language", teacher: "Mr. Hassan Al-Shehri", grade: "All Grades", students: 890 },
  { name: "Chemistry", teacher: "Dr. Layla Al-Anazi", grade: "Grade 11-12", students: 145 },
];

const upcomingExams = [
  { subject: "Mathematics", grade: "Grade 10", date: "Jun 20", type: "Mid-Term" },
  { subject: "Physics", grade: "Grade 11", date: "Jun 22", type: "Mid-Term" },
  { subject: "English", grade: "Grade 9", date: "Jun 24", type: "Quiz" },
  { subject: "Chemistry", grade: "Grade 12", date: "Jun 26", type: "Final" },
];

export default function AcademicsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Academics"
        description="Manage subjects, timetables, assignments, and examinations"
        breadcrumbs={[{ label: "Home" }, { label: "Academics" }]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard title="Subjects" value="12" subtitle="Active this semester" icon={BookOpen} iconClassName="bg-blue-500" />
        <StatsCard title="Teachers" value={mockTeachers.length} subtitle="Academic staff" icon={Users} iconClassName="bg-green-500" />
        <StatsCard title="Upcoming Exams" value="8" subtitle="This week" icon={FileText} iconClassName="bg-amber-500" />
        <StatsCard title="Classes" value="34" subtitle="Active sections" icon={Calendar} iconClassName="bg-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subjects & Teachers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subjects.map((subject, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{subject.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{subject.teacher}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium">{subject.students} students</p>
                  <p className="text-xs text-muted-foreground">{subject.grade}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingExams.map((exam, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="text-center w-12 shrink-0">
                  <p className="text-xs font-bold text-primary">{exam.date}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{exam.subject}</p>
                  <p className="text-xs text-muted-foreground">{exam.grade}</p>
                </div>
                <Badge variant="secondary">{exam.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
