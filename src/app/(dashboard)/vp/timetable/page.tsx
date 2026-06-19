"use client";
import { useState, useMemo } from "react";
import { Calendar, Clock, Plus, Check, X, Edit2, Trash2, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRoleStore } from "@/store/useRoleStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useDataStore, type TimetableEntry } from "@/store/useDataStore";
import { VP_GRADE_RANGES } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const PERIODS = [
  { id: "P1",  time: "07:30",  label: "Period 1" },
  { id: "P2",  time: "08:15",  label: "Period 2" },
  { id: "P3",  time: "09:00",  label: "Period 3" },
  { id: "P4",  time: "10:00",  label: "Period 4" },
  { id: "P5",  time: "10:45",  label: "Period 5" },
  { id: "P6",  time: "11:30",  label: "Period 6" },
  { id: "P7",  time: "12:45",  label: "Period 7" },
  { id: "P8",  time: "13:30",  label: "Period 8" },
];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics:        "bg-blue-100 text-blue-700",
  Physics:            "bg-violet-100 text-violet-700",
  Chemistry:          "bg-emerald-100 text-emerald-700",
  English:            "bg-amber-100 text-amber-700",
  Arabic:             "bg-rose-100 text-rose-700",
  "Computer Science": "bg-sky-100 text-sky-700",
  Islamic:            "bg-teal-100 text-teal-700",
  Biology:            "bg-lime-100 text-lime-700",
  History:            "bg-orange-100 text-orange-700",
  PE:                 "bg-pink-100 text-pink-700",
};

const SUBJECTS = Object.keys(SUBJECT_COLORS);

const TEACHERS = [
  "Dr. Sarah Al-Hamdan", "Mr. Khalid Al-Mutairi", "Mr. Faris Al-Shammari",
  "Ms. Reem Al-Harbi", "Dr. Layla Al-Anazi", "Mr. Hassan Al-Shehri",
  "Sheikh Mohammed", "Coach Sami",
];

const SECTIONS = ["A", "B", "C", "D"];

export default function VPTimetablePage() {
  const { activeRole } = useRoleStore();
  const { user } = useAuthStore();
  const {
    timetableEntries,
    addTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry,
  } = useDataStore();

  const gradeRange = VP_GRADE_RANGES[activeRole as "vp1" | "vp2" | "vp3"] ?? [1, 12];
  const grades = Array.from(
    { length: gradeRange[1] - gradeRange[0] + 1 },
    (_, i) => String(gradeRange[0] + i)
  );

  const [selectedDay, setSelectedDay] = useState("Sunday");
  const [selectedGrade, setSelectedGrade] = useState(grades[grades.length - 1] ?? "10");
  const [selectedSection, setSelectedSection] = useState("A");
  const [addOpen, setAddOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<TimetableEntry | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [form, setForm] = useState({ period: "P1", subject: SUBJECTS[0], teacher: TEACHERS[0], room: "" });

  const actor = user?.name ?? activeRole;
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000); };

  const filtered = useMemo(() =>
    timetableEntries.filter(
      (e) =>
        e.day === selectedDay &&
        e.grade === selectedGrade &&
        e.section === selectedSection &&
        Number(e.grade) >= gradeRange[0] &&
        Number(e.grade) <= gradeRange[1]
    ),
    [timetableEntries, selectedDay, selectedGrade, selectedSection, gradeRange]
  );

  const handleAdd = () => {
    addTimetableEntry(
      { day: selectedDay, grade: selectedGrade, section: selectedSection, ...form },
      actor
    );
    setAddOpen(false);
    setForm({ period: "P1", subject: SUBJECTS[0], teacher: TEACHERS[0], room: "" });
    showToast(`Added ${form.subject} on ${selectedDay} ${form.period}`);
  };

  const handleEdit = () => {
    if (!editEntry) return;
    updateTimetableEntry(editEntry.id, form, actor);
    setEditEntry(null);
    showToast("Timetable entry updated");
  };

  const handleDelete = (id: string) => {
    deleteTimetableEntry(id, actor);
    showToast("Entry removed");
  };

  const openEdit = (e: TimetableEntry) => {
    setEditEntry(e);
    setForm({ period: e.period, subject: e.subject, teacher: e.teacher, room: e.room });
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white rounded-xl px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 shrink-0" /> {toastMsg}
        </div>
      )}

      <PageHeader
        title="Timetable Management"
        description={`Manage class schedules — Grades ${gradeRange[0]}–${gradeRange[1]}`}
        breadcrumbs={[{ label: "VP Dashboard" }, { label: "Timetable" }]}
        actions={
          <Button
            onClick={() => {
              setAddOpen(true);
              setForm({ period: "P1", subject: SUBJECTS[0], teacher: TEACHERS[0], room: "" });
            }}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add Period
          </Button>
        }
      />

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5 flex-wrap">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                selectedDay === day
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 ml-auto">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="h-8 px-2 rounded-md border text-sm bg-background"
          >
            {grades.map((g) => <option key={g} value={g}>Grade {g}</option>)}
          </select>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="h-8 px-2 rounded-md border text-sm bg-background"
          >
            {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
          </select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            {selectedDay} — Grade {selectedGrade}-{selectedSection}
            <Badge variant="secondary" className="ml-auto">
              {filtered.length} period{filtered.length !== 1 ? "s" : ""}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {PERIODS.map((period) => {
            const entry = filtered.find((e) => e.period === period.id);
            const colorClass = entry
              ? (SUBJECT_COLORS[entry.subject] || "bg-muted text-muted-foreground")
              : "";
            return (
              <div
                key={period.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all",
                  entry ? "bg-card hover:shadow-sm" : "bg-muted/30 border-dashed"
                )}
              >
                <div className="w-16 shrink-0 text-right">
                  <p className="text-xs font-bold text-muted-foreground">{period.label}</p>
                  <p className="text-[10px] text-muted-foreground">{period.time}</p>
                </div>
                {entry ? (
                  <>
                    <div className={cn("w-1 self-stretch rounded-full shrink-0", colorClass.split(" ")[0])} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{entry.subject}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{entry.teacher}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{entry.room}</span>
                      </div>
                    </div>
                    <Badge className={cn("text-xs shrink-0", colorClass)}>{entry.subject.slice(0, 4)}</Badge>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(entry)}>
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground flex-1 italic">No class scheduled</p>
                    <Button
                      variant="ghost" size="sm" className="text-xs gap-1 h-7"
                      onClick={() => {
                        setAddOpen(true);
                        setForm({ period: period.id, subject: SUBJECTS[0], teacher: TEACHERS[0], room: "" });
                      }}
                    >
                      <Plus className="h-3 w-3" /> Add
                    </Button>
                  </>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add Period
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Period</label>
              <select
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                {PERIODS.map((p) => <option key={p.id} value={p.id}>{p.label} — {p.time}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Teacher</label>
              <select
                value={form.teacher}
                onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                {TEACHERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Room</label>
              <Input
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                placeholder="e.g. R204, Lab1, Gym"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button onClick={handleAdd} disabled={!form.room.trim()}>
              <Check className="h-4 w-4 mr-1" /> Add Period
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editEntry} onOpenChange={(o) => !o && setEditEntry(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-primary" /> Edit Period
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Teacher</label>
              <select
                value={form.teacher}
                onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                {TEACHERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Room</label>
              <Input
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditEntry(null)}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button onClick={handleEdit}>
              <Check className="h-4 w-4 mr-1" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
