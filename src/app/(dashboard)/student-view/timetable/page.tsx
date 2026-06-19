"use client";
import { useState, useMemo } from "react";
import { Calendar, Clock, BookOpen, MapPin } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDataStore } from "@/store/useDataStore";
import { DEMO_TEACHER_GRADE, DEMO_TEACHER_SECTION } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const PERIODS = [
  { id: 1, time: "07:30 – 08:15", label: "P1", periodKey: "P1" },
  { id: 2, time: "08:15 – 09:00", label: "P2", periodKey: "P2" },
  { id: 3, time: "09:00 – 09:45", label: "P3", periodKey: "P3" },
  { id: 4, time: "09:45 – 10:00", label: "Break", periodKey: null },
  { id: 5, time: "10:00 – 10:45", label: "P4", periodKey: "P4" },
  { id: 6, time: "10:45 – 11:30", label: "P5", periodKey: "P5" },
  { id: 7, time: "11:30 – 12:15", label: "P6", periodKey: "P6" },
  { id: 8, time: "12:15 – 12:45", label: "Prayer / Lunch", periodKey: null },
  { id: 9, time: "12:45 – 13:30", label: "P7", periodKey: "P7" },
  { id: 10, time: "13:30 – 14:15", label: "P8", periodKey: "P8" },
];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics:  "bg-blue-100 text-blue-700 border-blue-200",
  Physics:      "bg-violet-100 text-violet-700 border-violet-200",
  Chemistry:    "bg-emerald-100 text-emerald-700 border-emerald-200",
  English:      "bg-amber-100 text-amber-700 border-amber-200",
  Arabic:       "bg-rose-100 text-rose-700 border-rose-200",
  "Computer Science": "bg-sky-100 text-sky-700 border-sky-200",
  "Islamic Studies":  "bg-teal-100 text-teal-700 border-teal-200",
  Islamic:      "bg-teal-100 text-teal-700 border-teal-200",
  PE:           "bg-orange-100 text-orange-700 border-orange-200",
  Biology:      "bg-green-100 text-green-700 border-green-200",
  History:      "bg-orange-50 text-orange-700 border-orange-200",
};

const dayAbbr: Record<string, string> = {
  Sunday: "Sun", Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu",
};

function getTodayName(): string | null {
  const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return DAYS.includes(day) ? day : null;
}

export default function TimetablePage() {
  const { timetableEntries } = useDataStore();
  const todayName = getTodayName();
  const [selectedDay, setSelectedDay] = useState(todayName ?? "Sunday");

  // Filter store entries to Grade 10-A — reactive to VP edits
  const classEntries = useMemo(
    () =>
      timetableEntries.filter(
        (e) => e.grade === String(DEMO_TEACHER_GRADE) && e.section === DEMO_TEACHER_SECTION
      ),
    [timetableEntries]
  );

  // Build lookup: day → periodKey → { subject, teacher, room }
  const scheduleByDay = useMemo(() => {
    const map: Record<string, Record<string, { subject: string; teacher: string; room: string }>> = {};
    for (const e of classEntries) {
      if (!map[e.day]) map[e.day] = {};
      map[e.day][e.period] = { subject: e.subject, teacher: e.teacher, room: e.room };
    }
    return map;
  }, [classEntries]);

  const daySchedule = scheduleByDay[selectedDay ?? "Sunday"] ?? {};
  const classCount = PERIODS.filter((p) => p.periodKey && daySchedule[p.periodKey]).length;
  const uniqueSubjects = new Set(
    PERIODS.filter((p) => p.periodKey && daySchedule[p.periodKey])
      .map((p) => daySchedule[p.periodKey!]?.subject)
  ).size;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Timetable"
        description="Grade 10-A weekly class schedule — live from school schedule"
        breadcrumbs={[{ label: "Dashboard", href: "/student-view" }, { label: "Timetable" }]}
      />

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-all",
              selectedDay === day
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{dayAbbr[day]}</span>
            {todayName && day === todayName && (
              <span className="ml-1.5 text-[10px] font-semibold opacity-70">Today</span>
            )}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{classCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{classCount * 45}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Minutes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{uniqueSubjects}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Subjects</p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" /> {selectedDay}&apos;s Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {PERIODS.map((period) => {
            const isBreak = period.periodKey === null;

            if (isBreak) {
              return (
                <div key={period.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/40">
                  <div className="w-16 text-xs text-muted-foreground text-right shrink-0">{period.time.split("–")[0].trim()}</div>
                  <div className="h-px flex-1 bg-muted-foreground/20" />
                  <p className="text-xs text-muted-foreground shrink-0">{period.label}</p>
                  <div className="h-px flex-1 bg-muted-foreground/20" />
                </div>
              );
            }

            const cell = daySchedule[period.periodKey!] ?? null;

            if (!cell) {
              return (
                <div key={period.id} className="flex items-center gap-3 py-2 px-3 rounded-lg opacity-40">
                  <div className="text-right shrink-0 w-16">
                    <p className="text-xs font-bold text-muted-foreground">{period.label}</p>
                    <p className="text-[10px] text-muted-foreground">{period.time.split("–")[0].trim()}</p>
                  </div>
                  <div className="w-1 self-stretch rounded-full bg-muted" />
                  <p className="text-xs text-muted-foreground italic">Free period</p>
                </div>
              );
            }

            const colorClass = SUBJECT_COLORS[cell.subject] || "bg-muted text-muted-foreground border-muted";

            return (
              <div key={period.id} className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:shadow-sm transition-shadow">
                <div className="text-right shrink-0 w-16">
                  <p className="text-xs font-bold text-muted-foreground">{period.label}</p>
                  <p className="text-[10px] text-muted-foreground">{period.time.split("–")[0].trim()}</p>
                </div>
                <div className={cn("w-1 self-stretch rounded-full", colorClass.split(" ")[0])} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{cell.subject}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{cell.teacher}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{cell.room}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{period.time}</span>
                  </div>
                </div>
                <Badge className={cn("text-xs shrink-0 border", colorClass)}>
                  {cell.room}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
