"use client";
import { useState } from "react";
import { Clock, MapPin, User, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { weeklyTimetable, childProfile, todayChildSchedule } from "@/lib/mockData/parent";
import { cn } from "@/lib/utils";

type DayKey = keyof typeof weeklyTimetable;
const DAYS: DayKey[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const subjectColors: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-800 border-blue-200",
  English: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Physics: "bg-purple-100 text-purple-800 border-purple-200",
  Chemistry: "bg-orange-100 text-orange-800 border-orange-200",
  Arabic: "bg-rose-100 text-rose-800 border-rose-200",
  "Computer Science": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "Islamic Studies": "bg-amber-100 text-amber-800 border-amber-200",
  PE: "bg-lime-100 text-lime-800 border-lime-200",
  Art: "bg-pink-100 text-pink-800 border-pink-200",
};

const todayStatus: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ongoing: "bg-blue-100 text-blue-700 border-blue-200 ring-2 ring-blue-300",
  upcoming: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function ParentTimetablePage() {
  const [activeDay, setActiveDay] = useState<DayKey>("Sunday");
  const periods = weeklyTimetable[activeDay] ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Timetable"
        description={`${childProfile.name} · ${childProfile.grade}`}
        breadcrumbs={[{ label: "Parent", href: "/parent" }, { label: "Timetable" }]}
        actions={
          <Link href="/parent">
            <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Back to Dashboard</Button>
          </Link>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-amber-500" />Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {todayChildSchedule.map((p) => (
              <div key={p.time} className={cn("rounded-xl border p-3", todayStatus[p.status])}>
                <p className="text-xs font-medium mb-1">{p.time}</p>
                <p className="font-bold text-sm">{p.subject}</p>
                <p className="text-xs mt-1 opacity-80">{p.teacher}</p>
                <p className="text-xs opacity-80">Room {p.room}</p>
                <Badge className={cn("mt-2 text-xs capitalize", todayStatus[p.status])}>{p.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500" />Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-5 flex-wrap">
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={cn("px-4 py-1.5 rounded-full text-sm font-medium border transition-all", activeDay === d ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary hover:text-primary")}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {periods.map((p) => (
              <div key={p.time} className={cn("rounded-xl border p-4 flex items-start gap-4", subjectColors[p.subject] ?? "bg-muted/40 border-muted")}>
                <div className="shrink-0 text-center">
                  <p className="text-xs text-muted-foreground">Start</p>
                  <p className="font-bold text-sm">{p.time}</p>
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
        </CardContent>
      </Card>
    </div>
  );
}
