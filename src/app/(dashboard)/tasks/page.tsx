"use client";
import { useState } from "react";
import {
  CheckSquare, AlertTriangle, Clock, Plus, ChevronRight,
  Calendar, Tag, CheckCircle, Circle,
  BarChart3, Link2,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useDataStore } from "@/store/useDataStore";
import { useRoleStore } from "@/store/useRoleStore";
import { useAuthStore } from "@/store/useAuthStore";
import { type Task, type TaskStatus, type TaskPriority } from "@/lib/mockData/tasks";
import { cn } from "@/lib/utils";

const statusStyle: Record<TaskStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  todo:        { label: "To Do",       color: "text-slate-600",   bg: "bg-slate-100",   icon: Circle },
  in_progress: { label: "In Progress", color: "text-blue-700",    bg: "bg-blue-100",    icon: Clock },
  done:        { label: "Done",        color: "text-emerald-700", bg: "bg-emerald-100", icon: CheckCircle },
  overdue:     { label: "Overdue",     color: "text-red-700",     bg: "bg-red-100",     icon: AlertTriangle },
  blocked:     { label: "Blocked",     color: "text-amber-700",   bg: "bg-amber-100",   icon: AlertTriangle },
};

const priorityStyle: Record<TaskPriority, { label: string; color: string }> = {
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700 border-red-200" },
  high:   { label: "High",   color: "bg-amber-100 text-amber-700 border-amber-200" },
  medium: { label: "Medium", color: "bg-blue-100 text-blue-700 border-blue-200" },
  low:    { label: "Low",    color: "bg-slate-100 text-slate-600 border-slate-200" },
};

const categoryColor: Record<string, string> = {
  attendance:     "bg-emerald-50 text-emerald-700",
  academic:       "bg-blue-50 text-blue-700",
  finance:        "bg-violet-50 text-violet-700",
  administrative: "bg-slate-50 text-slate-700",
  event:          "bg-amber-50 text-amber-700",
  wellbeing:      "bg-pink-50 text-pink-700",
};

const columns: { status: TaskStatus; label: string }[] = [
  { status: "overdue",     label: "⚠️ Overdue" },
  { status: "todo",        label: "📋 To Do" },
  { status: "in_progress", label: "🔄 In Progress" },
  { status: "done",        label: "✅ Done" },
];

export default function TasksPage() {
  const { activeRole } = useRoleStore();
  const { user } = useAuthStore();
  const { tasks, addTask, updateTaskStatus } = useDataStore();

  const roleTasks = tasks.filter((t) => {
    if (activeRole === "admin") return true;
    const teacherNames = ["Dr. Sarah Al-Hamdan", "Mr. Khalid Al-Mutairi", "Mr. Faris Al-Shammari", "Mr. Hassan Al-Shehri"];
    if (activeRole === "teacher") return teacherNames.includes(t.assignedTo.name) || teacherNames.includes(t.assignedBy.name);
    return true;
  });

  const [view, setView] = useState<"board" | "list">("list");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", priority: "medium" as TaskPriority,
    category: "administrative", dueDate: "",
  });

  const filtered = roleTasks.filter((t) => {
    const matchStatus   = statusFilter === "all" || t.status === statusFilter;
    const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  const counts = {
    total:      roleTasks.length,
    overdue:    roleTasks.filter((t) => t.status === "overdue").length,
    inProgress: roleTasks.filter((t) => t.status === "in_progress").length,
    done:       roleTasks.filter((t) => t.status === "done").length,
  };

  const handleCreateTask = () => {
    if (!form.title.trim()) return;
    const myName = user?.name || "Admin";
    addTask({
      title: form.title,
      description: form.description,
      assignedBy: { name: myName, role: activeRole, avatar: myName.slice(0, 2).toUpperCase() },
      assignedTo:  { name: myName, role: activeRole, avatar: myName.slice(0, 2).toUpperCase() },
      dueDate: form.dueDate || "Jun 30, 2026",
      status: "todo",
      priority: form.priority,
      category: form.category,
      progress: 0,
    });
    setCreating(false);
    setForm({ title: "", description: "", priority: "medium", category: "administrative", dueDate: "" });
  };

  const handleMarkDone = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    updateTaskStatus(task.id, "done", 100);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tasks & Follow-Ups"
        description={`${counts.total} tasks · ${counts.overdue} overdue · ${counts.inProgress} in progress`}
        breadcrumbs={[{ label: "Collaboration" }, { label: "Tasks" }]}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg overflow-hidden">
              <button onClick={() => setView("list")} className={cn("px-3 py-1.5 text-xs font-medium", view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground")}>List</button>
              <button onClick={() => setView("board")} className={cn("px-3 py-1.5 text-xs font-medium", view === "board" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground")}>Board</button>
            </div>
            <Button size="sm" className="gap-2" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" /> New Task
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total",       value: counts.total,      color: "bg-slate-50 text-slate-700",   icon: CheckSquare },
          { label: "Overdue",     value: counts.overdue,    color: "bg-red-50 text-red-700",       icon: AlertTriangle },
          { label: "In Progress", value: counts.inProgress, color: "bg-blue-50 text-blue-700",     icon: Clock },
          { label: "Completed",   value: counts.done,       color: "bg-emerald-50 text-emerald-700", icon: CheckCircle },
        ].map((s) => (
          <Card key={s.label} className={s.color}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className="h-6 w-6" />
              <div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs font-medium">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1.5">
          <span className="text-xs text-muted-foreground self-center">Status:</span>
          {(["all", "overdue", "todo", "in_progress", "done"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("px-3 py-1 rounded-full text-xs font-medium border capitalize transition-all whitespace-nowrap",
                statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"
              )}>
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <span className="text-xs text-muted-foreground self-center">Priority:</span>
          {(["all", "urgent", "high", "medium", "low"] as const).map((p) => (
            <button key={p} onClick={() => setPriorityFilter(p)}
              className={cn("px-3 py-1 rounded-full text-xs font-medium border capitalize transition-all",
                priorityFilter === p ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"
              )}>
              {p === "all" ? "All" : p}
            </button>
          ))}
        </div>
      </div>

      {view === "list" && (
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <CheckSquare className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p>No tasks found</p>
            </div>
          ) : (
            filtered.map((task) => <TaskCard key={task.id} task={task} onMarkDone={handleMarkDone} />)
          )}
        </div>
      )}

      {view === "board" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto">
          {columns.map((col) => {
            const colTasks = roleTasks.filter((t) => t.status === col.status);
            return (
              <div key={col.status} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{col.label}</p>
                  <Badge variant="secondary" className="text-xs">{colTasks.length}</Badge>
                </div>
                <div className="space-y-2">
                  {colTasks.map((task) => <TaskCardCompact key={task.id} task={task} onMarkDone={(e) => { handleMarkDone(task, e); }} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Task Dialog */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Task Title</label>
              <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="What needs to be done?" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Description</label>
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Provide details about this task..."
                rows={3}
                className="w-full text-sm bg-muted/30 rounded-xl p-3 resize-none border border-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Priority</label>
                <div className="flex flex-col gap-1.5">
                  {(["urgent", "high", "medium", "low"] as TaskPriority[]).map((p) => (
                    <button key={p} onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all text-left",
                        form.priority === p ? priorityStyle[p].color + " border-current" : "border-border hover:bg-muted text-muted-foreground"
                      )}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Due Date</label>
                  <Input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Category</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {Object.keys(categoryColor).map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
            <Button onClick={handleCreateTask} disabled={!form.title.trim()} className="gap-2">
              <CheckSquare className="h-4 w-4" /> Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaskCard({ task, onMarkDone }: { task: Task; onMarkDone: (task: Task, e: React.MouseEvent) => void }) {
  const st = statusStyle[task.status];
  const pr = priorityStyle[task.priority];
  const StIcon = st.icon;
  const catColor = categoryColor[task.category] || "bg-slate-50 text-slate-600";

  return (
    <Card className={cn("hover:shadow-md transition-all",
      task.status === "overdue" && "border-red-200 bg-red-50/20",
      task.status === "done" && "opacity-70"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("p-1.5 rounded-lg shrink-0", st.bg)}>
            <StIcon className={cn("h-4 w-4", st.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className={cn("font-semibold text-sm", task.status === "done" && "line-through text-muted-foreground")}>
                {task.title}
              </p>
              <Badge className={cn("text-xs border capitalize shrink-0", pr.color)}>{pr.label}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
            {task.notes && (
              <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mt-1.5 border border-amber-100">
                📌 {task.notes}
              </p>
            )}
            {task.progress > 0 && task.status !== "done" && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 bg-muted rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${task.progress}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{task.progress}%</span>
              </div>
            )}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Avatar className="h-5 w-5"><AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">{task.assignedTo.avatar}</AvatarFallback></Avatar>
                <span className="truncate max-w-28">{task.assignedTo.name}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span className={cn(task.status === "overdue" && "text-red-600 font-medium")}>Due: {task.dueDate}</span>
              </div>
              <Badge className={cn("text-[10px] capitalize ml-auto", catColor)}>{task.category}</Badge>
              {task.linkedTo && (
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Link2 className="h-3 w-3" />
                  <span className="truncate max-w-24">{task.linkedTo.label}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>By:</span>
                <Avatar className="h-4 w-4"><AvatarFallback className="text-[9px] bg-violet-100 text-violet-700">{task.assignedBy.avatar}</AvatarFallback></Avatar>
                <span>{task.assignedBy.name}</span>
              </div>
              <div className="ml-auto flex gap-1.5">
                {task.status !== "done" && (
                  <Button variant="outline" size="sm" className="text-xs h-6 px-2 gap-1" onClick={(e) => onMarkDone(task, e)}>
                    <CheckCircle className="h-3 w-3 text-emerald-600" /> Done
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskCardCompact({ task, onMarkDone }: { task: Task; onMarkDone: (e: React.MouseEvent) => void }) {
  const pr = priorityStyle[task.priority];
  return (
    <Card className={cn("hover:shadow-sm transition-all cursor-pointer",
      task.status === "overdue" && "border-red-200 bg-red-50/20"
    )}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-1.5">
          <p className="text-xs font-semibold line-clamp-2">{task.title}</p>
          <Badge className={cn("text-[10px] border shrink-0", pr.color)}>{pr.label}</Badge>
        </div>
        <p className="text-[11px] text-muted-foreground line-clamp-1">{task.assignedTo.name}</p>
        {task.progress > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex-1 bg-muted rounded-full h-1">
              <div className="bg-blue-400 h-1 rounded-full" style={{ width: `${task.progress}%` }} />
            </div>
            <span className="text-[10px] text-muted-foreground">{task.progress}%</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className={cn("text-[10px]", task.status === "overdue" ? "text-red-600 font-medium" : "text-muted-foreground")}>
            Due: {task.dueDate}
          </p>
          {task.status !== "done" && (
            <Button variant="ghost" size="sm" className="text-[10px] h-5 px-1.5 gap-0.5" onClick={onMarkDone}>
              <CheckCircle className="h-3 w-3 text-emerald-600" /> Done
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
