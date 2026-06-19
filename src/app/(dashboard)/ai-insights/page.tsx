"use client";
import { useState, useEffect, useMemo } from "react";
import { Sparkles, AlertTriangle, TrendingDown, DollarSign, Brain, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUIStore } from "@/store/useUIStore";
import { useRoleStore } from "@/store/useRoleStore";
import { useDataStore } from "@/store/useDataStore";
import { atRiskStudents } from "@/lib/mockData/admin";

const insights = [
  {
    title: "Fee Default Prediction",
    description: "AI predicts 15 students may default on Q2 fees based on payment history patterns.",
    action: "View List",
    dialogTitle: "Fee Default Risk — 15 Students",
    dialogBody: "Based on payment history patterns, the following students are at risk of defaulting on Q2 fees:\n\n• Omar Al-Ghamdi (Grade 11-B) — SAR 18,000 outstanding\n• Rayan Al-Khalidi (Grade 8-C) — SAR 14,500 outstanding\n• Sara Al-Qahtani (Grade 9-A) — SAR 12,000 outstanding\n• Ali Al-Mansouri (Grade 12-B) — SAR 11,200 outstanding\n• Nora Al-Dosari (Grade 7-A) — SAR 9,800 outstanding\n• + 10 more students\n\nTotal exposure: SAR 178,500\n\nRecommendation: Send automated payment reminders and offer an installment plan to the top 5 at-risk accounts.",
    icon: DollarSign,
    severity: "high",
  },
  {
    title: "Attendance Trend Alert",
    description: "Grade 8-C attendance dropped 8% this week compared to last month. Intervention recommended.",
    action: "Investigate",
    dialogTitle: "Attendance Alert — Grade 8-C",
    dialogBody: "Grade 8-C Attendance Analysis:\n\n• Current week average: 71.4%\n• Last month average: 79.2%\n• Drop: -7.8 percentage points\n\nStudents with 3+ consecutive absences this week:\n• Rayan Al-Barrak — 4 days absent ⚠️\n• Fatima Al-Hamad — 3 days absent\n• Khalid Al-Otaibi — 3 days absent\n\nRecommended actions:\n1. Contact parents of the 3 identified students immediately\n2. Check for class schedule conflicts\n3. Review classroom environment or teacher concerns\n4. Schedule Grade 8-C counselor check-in",
    icon: TrendingDown,
    severity: "medium",
  },
  {
    title: "Academic Risk",
    description: "23 students showing signs of academic struggle in Mathematics and Physics.",
    action: "Review Students",
    dialogTitle: "Academic Risk — 23 Students",
    dialogBody: "Students flagged for academic support (Grades 8–12):\n\nMathematics (14 students):\n• Omar Al-Ghamdi (G11) — Score: 38/100 ⚠️\n• Lina Al-Dosari (G8) — Score: 44/100\n• Ahmed Al-Farsi (G10) — Score: 47/100\n• Noura Al-Sayed (G9) — Score: 49/100\n• + 10 more\n\nPhysics (9 students):\n• Sara Al-Qahtani (G9) — Score: 41/100 ⚠️\n• Khalid Al-Barrak (G12) — Score: 45/100\n• + 7 more\n\nRecommendation: Schedule bi-weekly support sessions. Notify homeroom teachers and parents. Consider peer-tutoring program.",
    icon: AlertTriangle,
    severity: "medium",
  },
  {
    title: "Positive Trend",
    description: "Admission conversion rate improved by 12% after introducing automated follow-up messages.",
    action: "See Report",
    dialogTitle: "Admissions Performance Report",
    dialogBody: "Admission Conversion Analysis — Q2 2026:\n\n• Total leads this month: 34\n• Conversion rate: 67.6% (+12% vs last month)\n• Average time to enroll: 8.3 days (down from 12.1 days)\n\nImpact of automated follow-up:\n• Response rate within 24 hours: 89%\n• Parents who received 3+ follow-ups converted at 81%\n• Parents with no follow-up converted at 23%\n\nTop converting grade levels:\n• Grade 1: 9 enrollments\n• Grade 7: 6 enrollments\n• Grade 10: 5 enrollments\n\nRecommendation: Continue automated 3-touch follow-up sequence for all new leads.",
    icon: Sparkles,
    severity: "positive",
  },
];

const severityStyle: Record<string, string> = {
  high:     "border-red-200 bg-red-50",
  medium:   "border-amber-200 bg-amber-50",
  positive: "border-green-200 bg-green-50",
};

const severityBadge: Record<string, "destructive" | "warning" | "success"> = {
  high:     "destructive",
  medium:   "warning",
  positive: "success",
};

export default function AIInsightsPage() {
  const { toggleAiDrawer } = useUIStore();
  const { activeRole } = useRoleStore();
  const { students } = useDataStore();
  const router = useRouter();
  const [activeInsight, setActiveInsight] = useState<typeof insights[0] | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const atRiskCount = useMemo(
    () => students.filter((s) => s.performanceTier === "at-risk").length,
    [students]
  );

  useEffect(() => {
    if (activeRole === "student") {
      router.replace("/student-view");
    }
  }, [activeRole, router]);

  if (activeRole === "student") return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white rounded-xl px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 shrink-0" />
          {toastMsg}
        </div>
      )}

      <PageHeader
        title="AI Insights"
        description="Predictive analytics and AI-powered recommendations for your school"
        breadcrumbs={[{ label: "Home" }, { label: "AI Insights" }]}
        actions={
          <Button onClick={toggleAiDrawer} className="gap-2 bg-violet-600 hover:bg-violet-700">
            <Sparkles className="h-4 w-4" />
            Open AI Assistant
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Insights Generated", value: insights.length * 10 + 7, sub: "This month" },
          { label: "Students at Risk",   value: atRiskCount || atRiskStudents.length, sub: "Need attention" },
          { label: "Predictions Accuracy", value: "91%", sub: "Model precision" },
          { label: "Actions Taken",      value: insights.length * 4 + 2, sub: "From recommendations" },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-1">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Active Insights &amp; Alerts
          </h2>
          {insights.map((insight, i) => (
            <Card key={i} className={`border ${severityStyle[insight.severity]}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <insight.icon className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{insight.title}</p>
                      <Badge variant={severityBadge[insight.severity]} className="text-xs">
                        {insight.severity === "positive" ? "Good" : insight.severity === "high" ? "High" : "Medium"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                    <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-xs"
                      onClick={() => setActiveInsight(insight)}>
                      {insight.action} →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* At-Risk Students — sourced from shared admin mock data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4 text-violet-600" />
              Students at Risk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {atRiskStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs bg-red-100 text-red-700 font-semibold">
                    {student.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{student.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{student.grade} · {student.risk}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-red-600">{student.score}%</p>
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full text-xs mt-2"
              onClick={() => showToast(`Full at-risk report exported — ${atRiskCount || atRiskStudents.length} students flagged`)}>
              View All {atRiskCount || atRiskStudents.length} At-Risk Students
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Insight Detail Dialog */}
      <Dialog open={!!activeInsight} onOpenChange={(o) => !o && setActiveInsight(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeInsight && <activeInsight.icon className="h-5 w-5 text-primary" />}
              {activeInsight?.dialogTitle}
            </DialogTitle>
          </DialogHeader>
          {activeInsight && (
            <div className="py-2">
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {activeInsight.dialogBody}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveInsight(null)} className="gap-1">
              <X className="h-4 w-4" /> Close
            </Button>
            <Button onClick={() => {
              if (activeInsight) showToast(`Action taken on: ${activeInsight.title}`);
              setActiveInsight(null);
            }} className="gap-1">
              <Check className="h-4 w-4" /> Take Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
