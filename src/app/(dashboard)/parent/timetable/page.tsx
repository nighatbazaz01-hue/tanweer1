"use client";
import { useState, useMemo } from "react";
import { Clock, MapPin, User, ArrowLeft, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { childProfile } from "@/lib/mockData/parent";
import { useDataStore } from "@/store/useDataStore";
import { DEMO_TEACHER_GRADE, DEMO_TEACHER_SECTION } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
type Day = typeof DAYS[number];

// Period ID → display time (matches VP timetable period definitions)
const PERIOD_TIMES: Record<string, string> = {
  P1: "07:30", P2: "08:15", P3: "09:00", P4: "10:00",
  P5: "10:45", P6: "11:30", P7: "12:45", P8: "13:30",
};

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics:        "bg-blue-100 text-blue-800 border-blue-200",
  English:            "bg-emerald-100 text-emerald-800 border-emerald-200",
  Physics:            "bg-purple-100 text-purple-800 border-purple-200",
  Chemistry:          "bg-orange-100 text-orange-800 border-orange-200",
  Urdu:               "bg-rose-100 text-rose-800 border-rose-200",
  "Computer Science": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "Islamic Studies":  "bg-amber-100 text-amber-800 border-amber-200",
  PE:                 "bg-lime-100 text-lime-800 border-lime-200",
  Biology:            "bg-teal-100 text-teal-800 border-teal-200",
  History:            "bg-orange-50 text-orange-700 border-orange-200",
};

function getTodayName(): Day | null {
  const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return (DAYS as readonly string[]).includes(day) ? (day as Day) : null;
}

export default function ParentTimetablePage() {
  const { timetableEntries } = useDataStore();
  const todayName = getTodayName();
  const [activeDay, setActiveDay] = useState<Day>(todayName ?? "Monday");

  // Filter store entries to this child's class (Grade 10-A) — reactive to VP edits
  const childEntries = useMemo(
    () =>
      timetableEntries.filter(
        (e) => e.grade === String(DEMO_TEACHER_GRADE) && e.section === DEMO_TEACHER_SECTION
      ),
    [timetableEntries]
  );

  // Group by day
  const byDay = useMemo(() => {
    const map: Partial<Record<Day, typeof childEntries>> = {};
    for (const day of DAYS) {
      map[day] = childEntries
        .filter((e) => e.day === day)
        .sort((a, b) => (PERIOD_TIMES[a.period] ?? "").localeCompare(PERIOD_TIMES[b.period] ?? ""));
    }
    return map;
  }, [childEntries]);

  const activePeriods = byDay[activeDay] ?? [];
  const todayPeriods  = todayName ? (byDay[todayName] ?? []) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Timetable"
        description={`${childProfile.name} · ${childProfile.grade} · Live from school schedule`}
        breadcrumbs={[{ label: "Parent", href: "/parent" }, { label: "Timetable" }]}
        actions={
          <Link href="/parent">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        }
      />

      {/* Today's classes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            Today&apos;s Schedule — {todayName ?? new Date().toLocaleDateString("en-US", { weekday: "long" })}
            {todayName
              ? <Badge variant="secondary" className="ml-auto text-xs">{todayPeriods.length} classes</Badge>
              : <Badge variant="outline" className="ml-auto text-xs text-muted-foreground">No school today</Badge>
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayPeriods.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No classes scheduled for today.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {todayPeriods.map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    "rounded-xl border p-3",
                    SUBJECT_COLORS[p.subject] ?? "bg-muted/40 border-muted"
                  )}
                >
                  <p className="text-xs font-medium mb-1">{PERIOD_TIMES[p.period] ?? p.period}</p>
                  <p className="font-bold text-sm">{p.subject}</p>
                  <p className="text-xs mt-1 opacity-80">{p.teacher}</p>
                  <p className="text-xs opacity-80">Room {p.room}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly view */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" /> Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-5 flex-wrap">
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
                  activeDay === d
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary hover:text-primary"
                )}
              >
                {d}
              </button>
            ))}
          </div>

          {activePeriods.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <BookOpen className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No classes scheduled for {activeDay}.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activePeriods.map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    "rounded-xl border p-4 flex items-start gap-4",
                    SUBJECT_COLORS[p.subject] ?? "bg-muted/40 border-muted"
                  )}
                >
                  <div className="shrink-0 text-center">
                    <p className="text-xs text-muted-foreground">Start</p>
                    <p className="font-bold text-sm">{PERIOD_TIMES[p.period] ?? p.period}</p>
                    <p className="text-xs text-muted-foreground">{p.period}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{p.subject}</p>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs opacity-80">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" />{p.teacher}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Room {p.room}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
