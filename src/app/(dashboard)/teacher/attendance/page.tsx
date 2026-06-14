"use client";
import { useState } from "react";
import { CheckCircle, XCircle, Clock, Save, ArrowLeft, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useDataStore } from "@/store/useDataStore";
import { useAuthStore } from "@/store/useAuthStore";
import { classAttendanceToday, teacherProfile } from "@/lib/mockData/teacher";
import { cn } from "@/lib/utils";

type AttStatus = "present" | "absent" | "late";

const statusConfig: Record<AttStatus, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  present: { label: "Present", color: "text-emerald-600", icon: CheckCircle, bg: "bg-emerald-50 border-emerald-200 ring-emerald-400" },
  absent:  { label: "Absent",  color: "text-red-600",     icon: XCircle,     bg: "bg-red-50 border-red-200 ring-red-400" },
  late:    { label: "Late",    color: "text-amber-600",   icon: Clock,       bg: "bg-amber-50 border-amber-200 ring-amber-400" },
};

const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

export default function TeacherAttendancePage() {
  const { saveAttendance } = useDataStore();
  const { user } = useAuthStore();

  const [records, setRecords] = useState<{ id: string; name: string; grade: string; status: AttStatus }[]>(
    () => classAttendanceToday.map((s) => ({ ...s, status: s.status as AttStatus }))
  );
  const [saved, setSaved] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const setStatus = (id: string, status: AttStatus) => {
    setSaved(false);
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount  = records.filter((r) => r.status === "absent").length;
  const lateCount    = records.filter((r) => r.status === "late").length;

  const handleSave = () => {
    saveAttendance(teacherProfile.grade, presentCount, absentCount, lateCount, user?.name || "Teacher");
    setSaved(true);
    setToastMsg(`Attendance saved — ${presentCount} present, ${absentCount} absent, ${lateCount} late`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white rounded-xl px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2">
          <CheckCircle className="h-4 w-4 shrink-0" /> {toastMsg}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Link href="/teacher">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Button>
        </Link>
      </div>

      <PageHeader
        title="Attendance"
        description={`Mark attendance for ${teacherProfile.grade} — ${today}`}
        breadcrumbs={[{ label: "Teacher" }, { label: "Attendance" }]}
      />

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Present", count: presentCount, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Absent",  count: absentCount,  color: "text-red-600",     bg: "bg-red-50" },
          { label: "Late",    count: lateCount,    color: "text-amber-600",   bg: "bg-amber-50" },
        ].map(({ label, count, color, bg }) => (
          <Card key={label} className={bg}>
            <CardContent className="p-4 text-center">
              <p className={cn("text-3xl font-bold", color)}>{count}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-4 w-4" /> Grade {teacherProfile.grade} — Section A
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {records.map((student) => {
            const cfg = statusConfig[student.status];
            const Icon = cfg.icon;
            return (
              <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs bg-muted">
                    {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.id}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {(["present", "absent", "late"] as AttStatus[]).map((s) => {
                    const sc = statusConfig[s];
                    const SIcon = sc.icon;
                    const isActive = student.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setStatus(student.id, s)}
                        title={sc.label}
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center border transition-all",
                          isActive
                            ? cn(sc.bg, "ring-2 ring-offset-1", sc.color)
                            : "border-muted-foreground/20 text-muted-foreground/40 hover:border-muted-foreground/50 hover:text-muted-foreground"
                        )}
                      >
                        <SIcon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
                <Badge
                  className={cn("ml-2 text-xs capitalize shrink-0 min-w-[60px] justify-center", cfg.color, "bg-transparent border")}
                >
                  {cfg.label}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {saved && (
          <p className="text-sm text-emerald-600 flex items-center gap-1.5 my-auto">
            <CheckCircle className="h-4 w-4" /> Attendance saved
          </p>
        )}
        <Button onClick={handleSave} className="gap-2" disabled={saved}>
          <Save className="h-4 w-4" /> {saved ? "Saved" : "Save Attendance"}
        </Button>
      </div>
    </div>
  );
}
