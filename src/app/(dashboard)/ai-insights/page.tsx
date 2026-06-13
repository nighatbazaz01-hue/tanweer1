"use client";
import { Sparkles, AlertTriangle, TrendingDown, DollarSign, Brain } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/useUIStore";

const riskStudents = [
  { name: "Omar Al-Ghamdi", grade: "Grade 11", risk: "Academic + Financial", score: 87, color: "text-red-600" },
  { name: "Rayan Al-Barrak", grade: "Grade 8", risk: "Low Attendance", score: 72, color: "text-amber-600" },
  { name: "Sara Al-Qahtani", grade: "Grade 9", risk: "Academic Decline", score: 65, color: "text-amber-600" },
  { name: "Ali Al-Mansouri", grade: "Grade 12", risk: "Fee Default Risk", score: 58, color: "text-amber-600" },
];

const insights = [
  {
    title: "Fee Default Prediction",
    description: "AI predicts 15 students may default on Q2 fees based on payment history patterns.",
    action: "View List",
    icon: DollarSign,
    severity: "high",
  },
  {
    title: "Attendance Trend Alert",
    description: "Grade 8-C attendance dropped 8% this week compared to last month. Intervention recommended.",
    action: "Investigate",
    icon: TrendingDown,
    severity: "medium",
  },
  {
    title: "Academic Risk",
    description: "23 students showing signs of academic struggle in Mathematics and Physics.",
    action: "Review Students",
    icon: AlertTriangle,
    severity: "medium",
  },
  {
    title: "Positive Trend",
    description: "Admission conversion rate improved by 12% after introducing automated follow-up messages.",
    action: "See Report",
    icon: Sparkles,
    severity: "positive",
  },
];

const severityStyle: Record<string, string> = {
  high: "border-red-200 bg-red-50",
  medium: "border-amber-200 bg-amber-50",
  positive: "border-green-200 bg-green-50",
};

const severityBadge: Record<string, "destructive" | "warning" | "success"> = {
  high: "destructive",
  medium: "warning",
  positive: "success",
};

export default function AIInsightsPage() {
  const { toggleAiDrawer } = useUIStore();

  return (
    <div className="space-y-6">
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
          { label: "Insights Generated", value: "47", sub: "This month" },
          { label: "Students at Risk", value: "23", sub: "Need attention" },
          { label: "Predictions Accuracy", value: "91%", sub: "Model precision" },
          { label: "Actions Taken", value: "18", sub: "From recommendations" },
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
            Active Insights & Alerts
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
                    <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-xs">
                      {insight.action} →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4 text-violet-600" />
              Students at Risk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {riskStudents.map((student, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.grade} · {student.risk}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${student.color}`}>{student.score}%</p>
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full text-xs mt-2">
              View All 23 At-Risk Students
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
