"use client";
import { useState } from "react";
import { Folder, CheckCircle, Clock, Users, ArrowLeft, Award, TrendingUp } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/mockData/student";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; cls: string }> = {
  in_progress: { label: "In Progress", cls: "bg-blue-100 text-blue-700" },
  completed:   { label: "Completed",   cls: "bg-emerald-100 text-emerald-700" },
};

const subjectColor: Record<string, string> = {
  Physics:     "bg-purple-50 border-purple-200",
  Mathematics: "bg-blue-50 border-blue-200",
  Arabic:      "bg-rose-50 border-rose-200",
  English:     "bg-emerald-50 border-emerald-200",
};

const gradeColor = (g: string | null) =>
  !g ? "" : g.startsWith("A") ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700";

export default function StudentProjectsPage() {
  const [filter, setFilter] = useState<"all" | "in_progress" | "completed">("all");
  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);
  const active = projects.filter((p) => p.status === "in_progress").length;
  const done = projects.filter((p) => p.status === "completed").length;
  const avgProgress = Math.round(projects.filter((p) => p.status === "in_progress").reduce((s, p) => s + p.progress, 0) / (active || 1));

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Projects"
        description="Track individual and group project progress"
        breadcrumbs={[{ label: "Dashboard", href: "/student-view" }, { label: "Projects" }]}
        actions={
          <Link href="/student-view">
            <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Dashboard</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Projects", value: active, icon: Clock, color: "blue" },
          { label: "Completed", value: done, icon: CheckCircle, color: "emerald" },
          { label: "Avg Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "purple" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`rounded-lg bg-${color}-100 p-2`}><Icon className={`h-4 w-4 text-${color}-600`} /></div>
              <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-xl font-bold">{value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        {(["all", "in_progress", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn("px-4 py-1.5 rounded-full text-sm font-medium border transition-all", filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary")}
          >
            {f === "in_progress" ? "In Progress" : f === "all" ? "All" : "Completed"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((p) => (
          <Card key={p.id} className={cn("border", subjectColor[p.subject] ?? "")}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant="outline" className="text-xs">{p.subject}</Badge>
                    <Badge className={cn("text-xs", statusConfig[p.status].cls)}>{statusConfig[p.status].label}</Badge>
                    {p.grade && <Badge className={cn("text-xs", gradeColor(p.grade))}><Award className="h-3 w-3 mr-1" />{p.grade}</Badge>}
                  </div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />Due: {p.dueDate}
                    <span className="mx-1">·</span>
                    <Users className="h-3 w-3" />{p.members.join(", ")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold">{p.progress}%</p>
                  <p className="text-xs text-muted-foreground">complete</p>
                </div>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", p.status === "completed" ? "bg-emerald-500" : p.progress >= 60 ? "bg-blue-500" : "bg-amber-500")}
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
