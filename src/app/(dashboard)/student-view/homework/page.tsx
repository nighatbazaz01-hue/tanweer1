"use client";
import { useState } from "react";
import { BookOpen, CheckCircle, Clock, AlertCircle, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/useUIStore";
import { homeworkStatus } from "@/lib/mockData/student";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  submitted:   { label: "Submitted",   icon: CheckCircle,  cls: "bg-emerald-100 text-emerald-700" },
  pending:     { label: "Pending",     icon: AlertCircle,  cls: "bg-red-100 text-red-700" },
  in_progress: { label: "In Progress", icon: Clock,        cls: "bg-amber-100 text-amber-700" },
};

const subjectColor: Record<string, string> = {
  Mathematics:       "border-l-blue-500",
  English:           "border-l-emerald-500",
  Physics:           "border-l-purple-500",
  Chemistry:         "border-l-orange-500",
  Arabic:            "border-l-rose-500",
  "Computer Science":"border-l-cyan-500",
};

export default function StudentHomeworkPage() {
  const { toggleAiDrawer } = useUIStore();
  const [filter, setFilter] = useState<"all" | "pending" | "submitted" | "in_progress">("all");

  const filtered = filter === "all" ? homeworkStatus : homeworkStatus.filter((h) => h.status === filter);
  const pending = homeworkStatus.filter((h) => h.status === "pending").length;
  const submitted = homeworkStatus.filter((h) => h.status === "submitted").length;
  const inProgress = homeworkStatus.filter((h) => h.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homework & Assignments"
        description="Track your assignments and submission status"
        breadcrumbs={[{ label: "Dashboard", href: "/student-view" }, { label: "Homework" }]}
        actions={
          <div className="flex gap-2">
            <Link href="/student-view"><Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Dashboard</Button></Link>
            <Button size="sm" className="gap-2 bg-violet-600 hover:bg-violet-700" onClick={toggleAiDrawer}>
              <Sparkles className="h-4 w-4" />AI Help
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: homeworkStatus.length, icon: BookOpen, color: "blue" },
          { label: "Submitted", value: submitted, icon: CheckCircle, color: "emerald" },
          { label: "In Progress", value: inProgress, icon: Clock, color: "amber" },
          { label: "Pending", value: pending, icon: AlertCircle, color: "red" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`rounded-lg bg-${color}-100 p-2`}><Icon className={`h-4 w-4 text-${color}-600`} /></div>
              <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-xl font-bold">{value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "in_progress", "submitted"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn("px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize", filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary")}
          >
            {f === "in_progress" ? "In Progress" : f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((hw) => {
          const cfg = statusConfig[hw.status];
          const Icon = cfg.icon;
          return (
            <Card key={hw.subject + hw.title} className={cn("border-l-4", subjectColor[hw.subject] ?? "border-l-slate-300")}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">{hw.subject}</Badge>
                      <Badge className={cn("text-xs", cfg.cls)}><Icon className="h-3 w-3 mr-1" />{cfg.label}</Badge>
                    </div>
                    <p className="font-semibold text-sm truncate">{hw.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Clock className="h-3 w-3" />Due: {hw.dueDate}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {hw.score !== null ? (
                      <div>
                        <p className="text-lg font-bold">{hw.score}/{hw.total}</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground">/{hw.total}</p>
                        <p className="text-xs text-muted-foreground">pts</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
