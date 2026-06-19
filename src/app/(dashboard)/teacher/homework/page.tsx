"use client";
import { useState } from "react";
import { BookOpen, Plus, CheckCircle, Clock, ArrowLeft, Users, X } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { homeworkAssignments } from "@/lib/mockData/teacher";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useDataStore } from "@/store/useDataStore";

type Assignment = {
  id: number;
  title: string;
  grade: string;
  dueDate: string;
  submitted: number;
  total: number;
  status: string;
};

export default function TeacherHomeworkPage() {
  const { addAssignment } = useDataStore();
  const [assignments, setAssignments] = useState<Assignment[]>(homeworkAssignments);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Mathematics");
  const [newGrade, setNewGrade] = useState("Grade 10-A");
  const [newDue, setNewDue] = useState("");
  const [newTotal, setNewTotal] = useState("20");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = () => {
    if (!newTitle.trim() || !newDue.trim()) return;
    const next: Assignment = {
      id: Date.now(),
      title: newTitle,
      grade: newGrade,
      dueDate: newDue,
      submitted: 0,
      total: parseInt(newTotal) || 20,
      status: "active",
    };
    setAssignments((prev) => [next, ...prev]);
    addAssignment(newTitle, newSubject, newGrade, newDue, 10, parseInt(newTotal) || 20, "Teacher");
    setNewTitle(""); setNewSubject("Mathematics"); setNewGrade("Grade 10-A"); setNewDue(""); setNewTotal("20");
    setCreateOpen(false);
    showToast("Assignment created successfully!");
  };

  const active = assignments.filter((a) => a.status === "active");
  const completed = assignments.filter((a) => a.status === "completed");
  const totalSubmitted = assignments.reduce((s, a) => s + a.submitted, 0);
  const totalStudents = assignments.reduce((s, a) => s + a.total, 0);

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />{toast}
        </div>
      )}

      <PageHeader
        title="Homework & Assignments"
        description="Manage and track student assignments across all sections"
        breadcrumbs={[{ label: "Teacher", href: "/teacher" }, { label: "Homework" }]}
        actions={
          <div className="flex gap-2">
            <Link href="/teacher"><Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Dashboard</Button></Link>
            <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />New Assignment
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Assignments", value: assignments.length, icon: BookOpen, color: "blue" },
          { label: "Active", value: active.length, icon: Clock, color: "amber" },
          { label: "Completed", value: completed.length, icon: CheckCircle, color: "emerald" },
          { label: "Submission Rate", value: `${totalStudents > 0 ? Math.round((totalSubmitted / totalStudents) * 100) : 0}%`, icon: Users, color: "purple" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`rounded-lg bg-${color}-100 p-2`}><Icon className={`h-4 w-4 text-${color}-600`} /></div>
              <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-xl font-bold">{value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-amber-500" />Active Assignments ({active.length})</h2>
        {active.map((a) => {
          const rate = Math.round((a.submitted / a.total) * 100);
          return (
            <Card key={a.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{a.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{a.grade}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Due {a.dueDate}</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Submissions</span>
                        <span>{a.submitted}/{a.total} ({rate}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", rate >= 80 ? "bg-emerald-500" : rate >= 50 ? "bg-amber-500" : "bg-red-400")} style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 shrink-0">Active</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {completed.length > 0 && (
          <>
            <h2 className="font-semibold flex items-center gap-2 mt-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Completed ({completed.length})</h2>
            {completed.map((a) => {
              const rate = Math.round((a.submitted / a.total) * 100);
              return (
                <Card key={a.id} className="opacity-80">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{a.title}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{a.grade}</Badge>
                          <span className="text-xs text-muted-foreground">Due {a.dueDate}</span>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Final Submissions</span><span>{a.submitted}/{a.total} ({rate}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${rate}%` }} />
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 shrink-0">Done</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Assignment</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input placeholder="e.g. Chapter 6 Exercises" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Subject</label>
              <select className="w-full rounded-md border px-3 py-2 text-sm bg-background" value={newSubject} onChange={(e) => setNewSubject(e.target.value)}>
                <option>Mathematics</option>
                <option>English</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Arabic</option>
                <option>Computer Science</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Section</label>
              <select className="w-full rounded-md border px-3 py-2 text-sm bg-background" value={newGrade} onChange={(e) => setNewGrade(e.target.value)}>
                <option>Grade 10-A</option>
                <option>Grade 10-B</option>
                <option>Grade 11-A</option>
                <option>Mixed</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Due Date</label>
                <Input placeholder="e.g. Jun 25" value={newDue} onChange={(e) => setNewDue(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Total Students</label>
                <Input type="number" value={newTotal} onChange={(e) => setNewTotal(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newTitle.trim() || !newDue.trim()}>Create Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
