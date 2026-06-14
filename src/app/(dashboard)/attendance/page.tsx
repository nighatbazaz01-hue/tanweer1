"use client";
import { useState, useMemo } from "react";
import { CheckCircle, XCircle, Clock, Shield, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { generateAttendanceRecords, type PopulationAttendanceRecord, type AttendanceStatus } from "@/lib/mockData/population";
import { useRoleStore } from "@/store/useRoleStore";
import { filterAttendanceForRole, getRoleScopeLabel } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const statusConfig: Record<AttendanceStatus, {
  label: string; variant: "success" | "destructive" | "warning" | "secondary"; icon: React.ElementType; color: string;
}> = {
  present: { label: "Present", variant: "success", icon: CheckCircle, color: "text-green-600" },
  absent:  { label: "Absent",  variant: "destructive", icon: XCircle,    color: "text-red-600" },
  late:    { label: "Late",    variant: "warning",     icon: Clock,       color: "text-amber-600" },
  excused: { label: "Excused", variant: "secondary",   icon: Shield,      color: "text-blue-600" },
};

const PAGE_SIZE = 30;

export default function AttendancePage() {
  const { activeRole } = useRoleStore();
  const baseRecords = useMemo(() => filterAttendanceForRole(generateAttendanceRecords(), activeRole), [activeRole]);
  const [records, setRecords] = useState<PopulationAttendanceRecord[]>(baseRecords);
  useEffect(() => { setRecords(baseRecords); setPage(1); }, [baseRecords]);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<PopulationAttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>("present");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<AttendanceStatus>("present");

  const todayLabel = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleBulkMark = () => {
    setRecords((prev) => prev.map((r) => ({ ...r, status: bulkStatus })));
    setBulkOpen(false);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter((r) => {
      const matchSearch = !q || r.studentName.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q);
      const matchGrade = gradeFilter === "all" || r.grade === gradeFilter;
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchGrade && matchStatus;
    });
  }, [records, search, gradeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount  = records.filter((r) => r.status === "absent").length;
  const lateCount    = records.filter((r) => r.status === "late").length;
  const rate = Math.round((presentCount / records.length) * 100);

  const openEdit = (rec: PopulationAttendanceRecord) => { setEditing(rec); setEditStatus(rec.status); };

  const saveEdit = () => {
    if (!editing) return;
    setRecords((prev) => prev.map((r) => r.id === editing.id ? { ...r, status: editStatus } : r));
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description={`Attendance records · ${getRoleScopeLabel(activeRole)}`}
        breadcrumbs={[{ label: "Home" }, { label: "Attendance" }]}
        actions={<Button size="sm" onClick={() => setBulkOpen(true)}>Mark Attendance</Button>}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard title="Present" value={presentCount} subtitle={`${rate}% rate`} icon={CheckCircle} iconClassName="bg-green-500" />
        <StatsCard title="Absent"  value={absentCount}  subtitle="Today"         icon={XCircle}      iconClassName="bg-red-500" />
        <StatsCard title="Late"    value={lateCount}    subtitle="Today"         icon={Clock}        iconClassName="bg-amber-500" />
        <StatsCard title="Overall Rate" value={`${rate}%`} subtitle={`${records.length} students`} icon={Shield} iconClassName="bg-blue-500" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground self-center">Grade:</span>
          {(["all", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map((g) => (
            <button key={g} onClick={() => { setGradeFilter(g); setPage(1); }}
              className={cn("px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                gradeFilter === g ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"
              )}>
              {g === "all" ? "All" : `G${g}`}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(["all", "present", "absent", "late", "excused"] as const).map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={cn("px-2.5 py-1 rounded-full text-xs font-medium border capitalize transition-all",
                statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"
              )}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground ml-auto whitespace-nowrap">{filtered.length} records</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Today&apos;s Attendance — {todayLabel}
        </h2>
        {paginated.map((record) => {
          const status = statusConfig[record.status];
          const Icon = status.icon;
          return (
            <Card key={record.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-3.5 flex items-center gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs bg-muted text-muted-foreground">{record.avatar}</AvatarFallback>
                </Avatar>
                <Icon className={`h-4 w-4 ${status.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{record.studentName}</p>
                  <p className="text-xs text-muted-foreground">Grade {record.grade}-{record.section} · {record.studentId}</p>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
                <Button variant="ghost" size="sm" className="text-xs hidden sm:flex" onClick={() => openEdit(record)}>
                  Edit
                </Button>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No records found.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages} · {paginated.length} of {filtered.length}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="gap-1">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Mark Dialog */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Set attendance status for all <span className="font-semibold text-foreground">{records.length}</span> students in the current view.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["present", "absent", "late", "excused"] as AttendanceStatus[]).map((s) => {
                const cfg = statusConfig[s];
                const Icon = cfg.icon;
                return (
                  <button key={s} onClick={() => setBulkStatus(s)}
                    className={cn("flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium capitalize transition-all",
                      bulkStatus === s ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"
                    )}>
                    <Icon className={cn("h-4 w-4", bulkStatus === s ? "text-primary" : cfg.color)} />
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkMark}>Apply to All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Attendance</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm bg-primary/10 text-primary">{editing.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{editing.studentName}</p>
                  <p className="text-xs text-muted-foreground">Grade {editing.grade}-{editing.section} · {editing.date}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(["present", "absent", "late", "excused"] as AttendanceStatus[]).map((s) => {
                  const cfg = statusConfig[s];
                  const Icon = cfg.icon;
                  return (
                    <button key={s} onClick={() => setEditStatus(s)}
                      className={cn("flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium capitalize transition-all",
                        editStatus === s ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"
                      )}>
                      <Icon className={cn("h-4 w-4", editStatus === s ? "text-primary" : cfg.color)} />
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
