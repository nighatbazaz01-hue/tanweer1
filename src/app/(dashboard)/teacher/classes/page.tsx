"use client";
import { useMemo, useState } from "react";
import { Users, Clock, BookOpen, CheckCircle, XCircle, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { todaysClasses, teacherProfile } from "@/lib/mockData/teacher";
import { useDataStore } from "@/store/useDataStore";
import {
  filterStudentsForRole,
  filterAttendanceForRole,
  DEMO_TEACHER_GRADE,
  DEMO_TEACHER_SECTION,
} from "@/lib/permissions";

const statusStyle: Record<string, string> = {
  present: "bg-emerald-100 text-emerald-700",
  absent:  "bg-red-100 text-red-700",
  late:    "bg-amber-100 text-amber-700",
  excused: "bg-blue-100 text-blue-700",
};

const classStatusStyle: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ongoing:   "bg-blue-100 text-blue-700 border-blue-200",
  upcoming:  "bg-slate-100 text-slate-600 border-slate-200",
};

export default function TeacherClassesPage() {
  const { students: allStudents, attendanceRecords: allAttendance } = useDataStore();

  const [selected, setSelected] = useState<typeof todaysClasses[0] | null>(null);

  const classStudents = useMemo(() => {
    const roleStudents = filterStudentsForRole(allStudents, "teacher");
    const roleAttendance = filterAttendanceForRole(allAttendance, "teacher");
    const attendanceMap = new Map(roleAttendance.map((r) => [r.studentId, r.status]));

    return roleStudents.map((s) => ({
      id:     s.id,
      name:   s.name,
      avatar: s.avatar,
      status: (attendanceMap.get(s.id) ?? "present") as string,
    }));
  }, [allStudents, allAttendance]);

  const present = classStudents.filter((s) => s.status === "present").length;
  const absent  = classStudents.filter((s) => s.status === "absent").length;
  const late    = classStudents.filter((s) => s.status === "late").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Classes"
        description={`${teacherProfile.subject} · Grade ${DEMO_TEACHER_GRADE}-${DEMO_TEACHER_SECTION}`}
        breadcrumbs={[{ label: "Teacher", href: "/teacher" }, { label: "My Classes" }]}
        actions={
          <Link href="/teacher">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Classes Today",  value: todaysClasses.length,       icon: BookOpen,    color: "blue"   },
          { label: "Total Students", value: classStudents.length,        icon: Users,       color: "emerald"},
          { label: "Sections",       value: teacherProfile.sections.length, icon: CheckCircle, color: "purple" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-3">
              <div className={`rounded-lg bg-${color}-100 p-2`}>
                <Icon className={`h-5 w-5 text-${color}-600`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="font-semibold">Today&apos;s Schedule — click to view roster</h2>
          {todaysClasses.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelected(cls)}
              className={cn(
                "w-full text-left rounded-xl border p-4 transition-all hover:shadow-md",
                selected?.id === cls.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "bg-card hover:border-blue-300"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{cls.time}</span>
                    <Badge className={cn("text-xs border capitalize", classStatusStyle[cls.status])}>
                      {cls.status}
                    </Badge>
                  </div>
                  <p className="font-semibold truncate">{cls.subject}</p>
                  <p className="text-sm text-muted-foreground">{cls.grade} · {cls.room}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Topic: {cls.topic}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Users className="h-3.5 w-3.5" />{classStudents.length}
                  </div>
                  <p className="text-xs text-muted-foreground">students</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 ml-auto" />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div>
          {selected ? (
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Grade {DEMO_TEACHER_GRADE}-{DEMO_TEACHER_SECTION} — Student Roster
                </CardTitle>
                <div className="flex gap-4 text-sm">
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />{present} present
                  </span>
                  <span className="text-red-600 font-medium flex items-center gap-1">
                    <XCircle className="h-3.5 w-3.5" />{absent} absent
                  </span>
                  <span className="text-amber-600 font-medium flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />{late} late
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {classStudents.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-lg border px-3 py-2 bg-muted/20"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{s.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.id}</p>
                        </div>
                      </div>
                      <Badge className={cn("text-xs capitalize", statusStyle[s.status] ?? "bg-muted text-muted-foreground")}>
                        {s.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed text-muted-foreground">
              <BookOpen className="h-10 w-10 mb-3 opacity-40" />
              <p className="font-medium">Select a class to view roster</p>
              <p className="text-sm">Click any class card on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
