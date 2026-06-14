"use client";
import { useState } from "react";
import { Users, Clock, BookOpen, CheckCircle, XCircle, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { todaysClasses, teacherProfile } from "@/lib/mockData/teacher";

const rosterByClass: Record<number, { name: string; id: string; status: string }[]> = {
  1: [
    { name: "Ahmed Al-Rashidi", id: "STU-001", status: "present" },
    { name: "Fatima Al-Zahrani", id: "STU-002", status: "present" },
    { name: "Omar Al-Ghamdi", id: "STU-003", status: "absent" },
    { name: "Nora Al-Otaibi", id: "STU-004", status: "late" },
    { name: "Yusuf Al-Dosari", id: "STU-005", status: "present" },
    { name: "Lina Al-Shamri", id: "STU-006", status: "present" },
    { name: "Hassan Al-Barrak", id: "STU-007", status: "present" },
    { name: "Reem Al-Harbi", id: "STU-008", status: "present" },
    { name: "Khalid Al-Mutairi", id: "STU-009", status: "present" },
    { name: "Sara Al-Qahtani", id: "STU-010", status: "late" },
    { name: "Bilal Al-Farouk", id: "STU-011", status: "present" },
    { name: "Hind Al-Sayed", id: "STU-012", status: "present" },
  ],
  2: [
    { name: "Mazen Al-Harbi", id: "STU-051", status: "present" },
    { name: "Dina Al-Khatib", id: "STU-052", status: "present" },
    { name: "Turki Al-Saud", id: "STU-053", status: "present" },
    { name: "Asma Al-Rashidi", id: "STU-054", status: "absent" },
    { name: "Faisal Al-Dossari", id: "STU-055", status: "present" },
    { name: "Noura Al-Anazi", id: "STU-056", status: "present" },
    { name: "Saad Al-Zahrani", id: "STU-057", status: "late" },
    { name: "Wafa Al-Shammari", id: "STU-058", status: "present" },
    { name: "Rami Al-Otaibi", id: "STU-059", status: "present" },
    { name: "Amira Al-Ghamdi", id: "STU-060", status: "present" },
    { name: "Ziad Al-Barrak", id: "STU-061", status: "present" },
    { name: "Hana Al-Qahtani", id: "STU-062", status: "present" },
  ],
  3: [
    { name: "Fahad Al-Mutairi", id: "STU-101", status: "present" },
    { name: "Layla Al-Zahrani", id: "STU-102", status: "present" },
    { name: "Osama Al-Ghamdi", id: "STU-103", status: "present" },
    { name: "Rania Al-Sayed", id: "STU-104", status: "present" },
    { name: "Nawaf Al-Harbi", id: "STU-105", status: "absent" },
    { name: "Mona Al-Qahtani", id: "STU-106", status: "present" },
    { name: "Sami Al-Rashidi", id: "STU-107", status: "present" },
    { name: "Hessa Al-Shehri", id: "STU-108", status: "late" },
    { name: "Talal Al-Dosari", id: "STU-109", status: "present" },
    { name: "Amal Al-Farouk", id: "STU-110", status: "present" },
    { name: "Yazeed Al-Anazi", id: "STU-111", status: "present" },
    { name: "Nada Al-Khatib", id: "STU-112", status: "present" },
  ],
  4: [
    { name: "Abdullah Al-Zahrani", id: "STU-151", status: "present" },
    { name: "Roaa Al-Harbi", id: "STU-152", status: "present" },
    { name: "Hamad Al-Mutairi", id: "STU-153", status: "present" },
    { name: "Eman Al-Qahtani", id: "STU-154", status: "present" },
    { name: "Muneer Al-Ghamdi", id: "STU-155", status: "present" },
    { name: "Shahad Al-Rashidi", id: "STU-156", status: "present" },
    { name: "Adel Al-Barrak", id: "STU-157", status: "present" },
    { name: "Ghada Al-Sayed", id: "STU-158", status: "present" },
    { name: "Wael Al-Dosari", id: "STU-159", status: "present" },
    { name: "Rana Al-Shehri", id: "STU-160", status: "present" },
    { name: "Badr Al-Anazi", id: "STU-161", status: "absent" },
    { name: "Hala Al-Khatib", id: "STU-162", status: "present" },
    { name: "Tarek Al-Shamri", id: "STU-163", status: "present" },
    { name: "Lujain Al-Farouk", id: "STU-164", status: "present" },
  ],
};

const statusStyle: Record<string, string> = {
  present: "bg-emerald-100 text-emerald-700",
  absent: "bg-red-100 text-red-700",
  late: "bg-amber-100 text-amber-700",
};

const classStatusStyle: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ongoing: "bg-blue-100 text-blue-700 border-blue-200",
  upcoming: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function TeacherClassesPage() {
  const [selected, setSelected] = useState<typeof todaysClasses[0] | null>(null);
  const students = selected ? (rosterByClass[selected.id] ?? []) : [];
  const present = students.filter((s) => s.status === "present").length;
  const absent = students.filter((s) => s.status === "absent").length;
  const late = students.filter((s) => s.status === "late").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Classes"
        description={`${teacherProfile.subject} · Sections: ${teacherProfile.sections.join(", ")}`}
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
          { label: "Classes Today", value: todaysClasses.length, icon: BookOpen, color: "blue" },
          { label: "Total Students", value: teacherProfile.totalStudents, icon: Users, color: "emerald" },
          { label: "Sections", value: teacherProfile.sections.length, icon: CheckCircle, color: "purple" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-3">
              <div className={`rounded-lg bg-${color}-100 p-2`}><Icon className={`h-5 w-5 text-${color}-600`} /></div>
              <div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="font-semibold">Today's Schedule — click to view roster</h2>
          {todaysClasses.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelected(cls)}
              className={cn(
                "w-full text-left rounded-xl border p-4 transition-all hover:shadow-md",
                selected?.id === cls.id ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "bg-card hover:border-blue-300"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{cls.time}</span>
                    <Badge className={cn("text-xs border capitalize", classStatusStyle[cls.status])}>{cls.status}</Badge>
                  </div>
                  <p className="font-semibold truncate">{cls.subject}</p>
                  <p className="text-sm text-muted-foreground">{cls.grade} · {cls.room}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Topic: {cls.topic}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-sm font-semibold"><Users className="h-3.5 w-3.5" />{cls.students}</div>
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
                <CardTitle className="text-base">{selected.grade} — Student Roster</CardTitle>
                <div className="flex gap-4 text-sm">
                  <span className="text-emerald-600 font-medium flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" />{present} present</span>
                  <span className="text-red-600 font-medium flex items-center gap-1"><XCircle className="h-3.5 w-3.5" />{absent} absent</span>
                  <span className="text-amber-600 font-medium flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{late} late</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {students.map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-lg border px-3 py-2 bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.id}</p>
                        </div>
                      </div>
                      <Badge className={cn("text-xs capitalize", statusStyle[s.status])}>{s.status}</Badge>
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
