"use client";

import { useState, useMemo } from "react";
import { useRoleStore } from "@/store/useRoleStore";
import { useDataStore } from "@/store/useDataStore";
import { filterStudentsForRole, VP_GRADE_RANGES, DEMO_CHILD_ID, DEMO_TEACHER_NAME } from "@/lib/permissions";
import type { Intervention, InterventionType, InterventionStatus, InterventionPriority } from "@/store/useDataStore";
import type { Student } from "@/lib/mockData/population";
import {
  ClipboardCheck, Plus, Search, Filter, X, ChevronDown,
  AlertTriangle, CheckCircle2, Clock, Users, TrendingUp,
  MessageSquare, Calendar, Eye, BarChart2, Sparkles,
  ArrowUpRight, RefreshCw, User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// ─── Constants ────────────────────────────────────────────────────────────────

const INTERVENTION_TYPES: InterventionType[] = [
  "Academic Support", "Attendance Concern", "Wellbeing Support",
  "Behaviour Support", "Parent Meeting", "Leadership Development",
  "Health Follow-Up", "Counselling",
];

const STATUSES: InterventionStatus[] = [
  "Open", "In Progress", "Pending Parent", "Completed", "Escalated",
];

const PRIORITIES: InterventionPriority[] = ["Low", "Medium", "High", "Critical"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusConfig(s: InterventionStatus) {
  switch (s) {
    case "Open":           return { color: "text-blue-700",    bg: "bg-blue-50 border-blue-200",    icon: Clock };
    case "In Progress":    return { color: "text-amber-700",   bg: "bg-amber-50 border-amber-200",   icon: RefreshCw };
    case "Pending Parent": return { color: "text-violet-700",  bg: "bg-violet-50 border-violet-200", icon: User };
    case "Completed":      return { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 };
    case "Escalated":      return { color: "text-red-700",     bg: "bg-red-50 border-red-200",       icon: AlertTriangle };
  }
}

function priorityBadge(p: InterventionPriority) {
  switch (p) {
    case "Critical": return "bg-red-100 text-red-700 border-red-300";
    case "High":     return "bg-orange-100 text-orange-700 border-orange-300";
    case "Medium":   return "bg-amber-100 text-amber-700 border-amber-300";
    case "Low":      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}

function typeIcon(t: InterventionType) {
  switch (t) {
    case "Academic Support":      return "📚";
    case "Attendance Concern":    return "📅";
    case "Wellbeing Support":     return "💚";
    case "Behaviour Support":     return "🔔";
    case "Parent Meeting":        return "👥";
    case "Leadership Development":return "⭐";
    case "Health Follow-Up":      return "🏥";
    case "Counselling":           return "🧠";
  }
}

// ─── Create Intervention Dialog ───────────────────────────────────────────────

function CreateInterventionDialog({
  open, onClose, allStudents, role,
}: {
  open: boolean;
  onClose: () => void;
  allStudents: Student[];
  role: string;
}) {
  const { createIntervention } = useDataStore();
  const [type, setType] = useState<InterventionType>("Academic Support");
  const [grade, setGrade] = useState<string>("all");
  const [section, setSection] = useState<string>("all");
  const [studentId, setStudentId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<InterventionPriority>("Medium");
  const [responsibleStaff, setResponsibleStaff] = useState(DEMO_TEACHER_NAME);
  const [dueDate, setDueDate] = useState("Jun 30, 2026");

  const availableGrades = useMemo(() => [...new Set(allStudents.map((s) => s.grade))].sort((a, b) => a - b), [allStudents]);
  const filteredByGrade = useMemo(() =>
    grade !== "all" ? allStudents.filter((s) => s.grade === Number(grade)) : allStudents,
    [allStudents, grade]);
  const availableSections = useMemo(() => [...new Set(filteredByGrade.map((s) => s.section))].sort(), [filteredByGrade]);
  const filteredStudents = useMemo(() =>
    section !== "all" ? filteredByGrade.filter((s) => s.section === section) : filteredByGrade,
    [filteredByGrade, section]);

  const selectedStudent = filteredStudents.find((s) => s.id === studentId);

  const handleSubmit = () => {
    if (!studentId || !title.trim()) return;
    const student = allStudents.find((s) => s.id === studentId);
    if (!student) return;
    createIntervention({
      studentId: student.id,
      studentName: student.name,
      studentGrade: student.grade,
      studentSection: student.section,
      type,
      title: title.trim(),
      description: description.trim(),
      priority,
      status: "Open",
      responsibleStaff,
      createdBy: DEMO_TEACHER_NAME,
      createdByRole: role,
      dueDate,
    }, DEMO_TEACHER_NAME);
    // Reset
    setStudentId(""); setTitle(""); setDescription(""); setType("Academic Support"); setPriority("Medium");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            Log New Intervention
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type */}
          <div className="space-y-1.5">
            <Label>Intervention Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as InterventionType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERVENTION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{typeIcon(t)} {t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student selector — cascading Grade → Section → Student */}
          <div className="grid grid-cols-3 gap-3">
            {availableGrades.length > 1 && (
              <div className="space-y-1.5">
                <Label>Grade</Label>
                <Select value={grade} onValueChange={(v) => { setGrade(v); setSection("all"); setStudentId(""); }}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {availableGrades.map((g) => (
                      <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {availableSections.length > 1 && (
              <div className="space-y-1.5">
                <Label>Section</Label>
                <Select value={section} onValueChange={(v) => { setSection(v); setStudentId(""); }}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {availableSections.map((s) => (
                      <SelectItem key={s} value={s}>Section {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5 col-span-2">
              <Label>Student *</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select student…" />
                </SelectTrigger>
                <SelectContent>
                  {filteredStudents.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} — Gr.{s.grade}{s.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label>Intervention Title *</Label>
            <Input
              placeholder="Brief title describing the intervention…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              placeholder="Detailed context and goals for this intervention…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Priority + Responsible + Due Date */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as InterventionPriority)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Responsible Staff</Label>
              <Input
                value={responsibleStaff}
                onChange={(e) => setResponsibleStaff(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Due Date</Label>
              <Input
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!studentId || !title.trim()}>
            Log Intervention
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Intervention Detail Dialog ────────────────────────────────────────────────

function InterventionDetailDialog({
  intervention,
  open,
  onClose,
  role,
  canEdit,
}: {
  intervention: Intervention | null;
  open: boolean;
  onClose: () => void;
  role: string;
  canEdit: boolean;
}) {
  const { updateInterventionStatus, addInterventionNote, acknowledgeIntervention, requestMeeting } = useDataStore();
  const [noteText, setNoteText] = useState("");
  const [ackComment, setAckComment] = useState("");
  const [showAck, setShowAck] = useState(false);

  if (!intervention) return null;
  const sc = statusConfig(intervention.status);
  const StatusIcon = sc.icon;

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const roleLabel = role === "teacher" ? "Teacher" : role.startsWith("vp") ? "VP" : role === "admin" ? "Admin" : "Staff";
    addInterventionNote(intervention.id, DEMO_TEACHER_NAME, roleLabel, noteText.trim(), DEMO_TEACHER_NAME);
    setNoteText("");
  };

  const handleAcknowledge = () => {
    acknowledgeIntervention(intervention.id, ackComment, "Parent");
    setShowAck(false);
    setAckComment("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">
            {typeIcon(intervention.type)} {intervention.title}
          </DialogTitle>
        </DialogHeader>

        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.color}`}>
            <StatusIcon className="h-3 w-3" />
            {intervention.status}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${priorityBadge(intervention.priority)}`}>
            {intervention.priority} Priority
          </span>
          <Badge variant="outline" className="text-xs">{intervention.type}</Badge>
        </div>

        {/* Student */}
        <div className="rounded-lg bg-muted/40 p-3 text-sm space-y-1">
          <p><span className="text-muted-foreground">Student:</span> <strong>{intervention.studentName}</strong> — Grade {intervention.studentGrade}-{intervention.studentSection}</p>
          <p><span className="text-muted-foreground">Responsible:</span> {intervention.responsibleStaff}</p>
          <p><span className="text-muted-foreground">Created:</span> {intervention.createdAt} by {intervention.createdBy}</p>
          <p><span className="text-muted-foreground">Due:</span> {intervention.dueDate}</p>
          {intervention.parentAcknowledged && (
            <p className="text-emerald-600 font-medium">✓ Parent acknowledged</p>
          )}
          {intervention.meetingRequested && (
            <p className="text-violet-600 font-medium">📅 Meeting requested</p>
          )}
        </div>

        {/* Description */}
        {intervention.description && (
          <div>
            <p className="text-sm font-semibold mb-1">Description</p>
            <p className="text-sm text-muted-foreground">{intervention.description}</p>
          </div>
        )}

        {/* Parent comment */}
        {intervention.parentComment && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-xs font-semibold text-blue-700 mb-1">Parent Response</p>
            <p className="text-sm text-blue-800">{intervention.parentComment}</p>
          </div>
        )}

        {/* Notes / Timeline */}
        <div>
          <p className="text-sm font-semibold mb-2">Timeline & Notes ({intervention.notes.length})</p>
          {intervention.notes.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No notes yet.</p>
          )}
          <div className="space-y-3">
            {intervention.notes.map((note) => (
              <div key={note.id} className="flex gap-2.5">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {note.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-semibold">{note.author}</span>
                    <Badge variant="outline" className="text-[10px] h-4 px-1">{note.authorRole}</Badge>
                    <span className="text-[11px] text-muted-foreground ml-auto">{note.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{note.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add note — staff only */}
        {canEdit && (
          <div className="space-y-2 border-t pt-3">
            <p className="text-sm font-semibold">Add Note</p>
            <Textarea
              placeholder="Add a progress update, observation, or follow-up note…"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={2}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddNote} disabled={!noteText.trim()}>Add Note</Button>
              {STATUSES.filter((s) => s !== intervention.status).map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => updateInterventionStatus(intervention.id, s, DEMO_TEACHER_NAME)}
                >
                  → {s}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Parent actions */}
        {role === "parent" && (
          <div className="border-t pt-3 space-y-2">
            {!intervention.parentAcknowledged && (
              <>
                {!showAck ? (
                  <Button size="sm" onClick={() => setShowAck(true)}>Acknowledge</Button>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Optional comment…"
                      value={ackComment}
                      onChange={(e) => setAckComment(e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAcknowledge}>Confirm Acknowledgement</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAck(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </>
            )}
            {!intervention.meetingRequested && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => requestMeeting(intervention.id, "Parent")}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Request Meeting
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InterventionsPage() {
  const { activeRole } = useRoleStore();
  const { students, interventions } = useDataStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | InterventionStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | InterventionType>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | InterventionPriority>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailIntervention, setDetailIntervention] = useState<Intervention | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const isAdmin   = activeRole === "admin";
  const isVP      = activeRole.startsWith("vp");
  const isTeacher = activeRole === "teacher";
  const isParent  = activeRole === "parent";
  const isStudent = activeRole === "student";

  const canCreate = isAdmin || isVP || isTeacher;
  const canEdit   = isAdmin || isVP || isTeacher;

  // Role-scoped students
  const scopedStudents = useMemo(
    () => filterStudentsForRole(students, activeRole),
    [students, activeRole]
  );
  const scopedStudentIds = useMemo(() => new Set(scopedStudents.map((s) => s.id)), [scopedStudents]);

  // Role-scoped interventions
  const scopedInterventions = useMemo(() => {
    if (isAdmin) return interventions;
    if (isParent || isStudent) return interventions.filter((i) => i.studentId === DEMO_CHILD_ID);
    // VP and teacher: only interventions for their students
    return interventions.filter((i) => scopedStudentIds.has(i.studentId));
  }, [interventions, isAdmin, isParent, isStudent, scopedStudentIds]);

  // Filtered list
  const filtered = useMemo(() => {
    let list = scopedInterventions;
    if (statusFilter !== "all") list = list.filter((i) => i.status === statusFilter);
    if (typeFilter !== "all")   list = list.filter((i) => i.type === typeFilter);
    if (priorityFilter !== "all") list = list.filter((i) => i.priority === priorityFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) =>
        i.studentName.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const pOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return pOrder[a.priority] - pOrder[b.priority];
    });
  }, [scopedInterventions, statusFilter, typeFilter, priorityFilter, search]);

  // Analytics
  const analytics = useMemo(() => ({
    open:        scopedInterventions.filter((i) => i.status === "Open").length,
    inProgress:  scopedInterventions.filter((i) => i.status === "In Progress").length,
    pendingParent: scopedInterventions.filter((i) => i.status === "Pending Parent").length,
    completed:   scopedInterventions.filter((i) => i.status === "Completed").length,
    escalated:   scopedInterventions.filter((i) => i.status === "Escalated").length,
    critical:    scopedInterventions.filter((i) => i.priority === "Critical").length,
    total:       scopedInterventions.length,
  }), [scopedInterventions]);

  const pageTitle =
    isAdmin   ? "Intervention Center — All School"
    : isVP    ? `Intervention Center — ${activeRole === "vp1" ? "Grades 1–4" : activeRole === "vp2" ? "Grades 5–8" : "Grades 9–12"}`
    : isTeacher ? "Intervention Center — My Class"
    : isParent  ? "My Child's Interventions"
    : "My Interventions";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Interventions</h1>
          </div>
          <p className="text-muted-foreground text-sm">{pageTitle} · {analytics.total} interventions</p>
        </div>
        {canCreate && (
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Log Intervention
          </Button>
        )}
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Open",           count: analytics.open,          color: "text-blue-700",    bg: "bg-blue-50" },
          { label: "In Progress",    count: analytics.inProgress,    color: "text-amber-700",   bg: "bg-amber-50" },
          { label: "Pending Parent", count: analytics.pendingParent, color: "text-violet-700",  bg: "bg-violet-50" },
          { label: "Completed",      count: analytics.completed,     color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Escalated",      count: analytics.escalated,     color: "text-red-700",     bg: "bg-red-50" },
          { label: "Critical",       count: analytics.critical,      color: "text-red-700",     bg: "bg-red-50" },
        ].map(({ label, count, color, bg }) => (
          <Card key={label} className={`${bg}`}>
            <CardContent className="pt-3 pb-3 px-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search student, title, type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
          <SelectTrigger className="w-44 h-8 text-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {INTERVENTION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as typeof priorityFilter)}>
          <SelectTrigger className="w-32 h-8 text-sm">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} results</span>
      </div>

      {/* Intervention List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <ClipboardCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground">No interventions match the current filters.</p>
              {canCreate && (
                <Button className="mt-4 gap-2" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Log First Intervention
                </Button>
              )}
            </CardContent>
          </Card>
        )}
        {filtered.map((intervention) => {
          const sc = statusConfig(intervention.status);
          const StatusIcon = sc.icon;
          return (
            <Card
              key={intervention.id}
              className="cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => { setDetailIntervention(intervention); setDetailOpen(true); }}
            >
              <CardContent className="py-4 px-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Left: type + title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-base">{typeIcon(intervention.type)}</span>
                      <p className="font-semibold text-sm truncate">{intervention.title}</p>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${priorityBadge(intervention.priority)}`}>
                        {intervention.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {intervention.studentName} — Gr.{intervention.studentGrade}{intervention.studentSection}
                      </span>
                      <span>{intervention.type}</span>
                      <span>Due: {intervention.dueDate}</span>
                      {intervention.notes.length > 0 && (
                        <span className="flex items-center gap-0.5">
                          <MessageSquare className="h-3 w-3" />
                          {intervention.notes.length}
                        </span>
                      )}
                      {intervention.parentAcknowledged && (
                        <span className="text-emerald-600 flex items-center gap-0.5">
                          <CheckCircle2 className="h-3 w-3" />
                          Parent ack.
                        </span>
                      )}
                      {intervention.meetingRequested && (
                        <span className="text-violet-600 flex items-center gap-0.5">
                          <Calendar className="h-3 w-3" />
                          Meeting req.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: status + arrow */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {intervention.status}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialogs */}
      <CreateInterventionDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        allStudents={scopedStudents}
        role={activeRole}
      />
      <InterventionDetailDialog
        intervention={detailIntervention}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        role={activeRole}
        canEdit={canEdit}
      />
    </div>
  );
}
