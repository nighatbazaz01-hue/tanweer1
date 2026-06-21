"use client";
import { useState } from "react";
import { Eye, EyeOff, CheckCircle, Circle, Shield, User, Copy, Check, Lock } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRoleStore } from "@/store/useRoleStore";
import { cn } from "@/lib/utils";

interface Credential {
  role: string;
  label: string;
  email: string;
  password: string;
  pin?: string;
  targetRoute: string;
  color: string;
  demoHighlights: string[];
}

const CREDENTIALS: Credential[] = [
  {
    role: "admin",
    label: "School Admin",
    email: "admin@school.edu",
    password: "Admin123!",
    pin: "1234",
    targetRoute: "/admin",
    color: "bg-violet-100 text-violet-700 border-violet-200",
    demoHighlights: [
      "KPI dashboard — enrollment, attendance, fee collection",
      "Full student records with PIN-gated contact details",
      "Admission pipeline management",
      "AI Insights — at-risk predictions, trends",
      "Audit Center — PIN access log, security events",
      "Transport management — all routes & vehicles",
    ],
  },
  {
    role: "vp1",
    label: "VP Academic (Grades 10–12)",
    email: "vp1@school.edu",
    password: "VP1pass!",
    pin: "5678",
    targetRoute: "/vp",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    demoHighlights: [
      "VP dashboard — grade-specific attendance & performance",
      "Timetable management — add/edit/delete periods",
      "Grade 10–12 student directory",
      "PIN-gated parent contact in student profiles",
      "Attendance overview with section breakdown",
    ],
  },
  {
    role: "vp2",
    label: "VP Middle (Grades 6–9)",
    email: "vp2@school.edu",
    password: "VP2pass!",
    pin: "9012",
    targetRoute: "/vp",
    color: "bg-sky-100 text-sky-700 border-sky-200",
    demoHighlights: [
      "VP dashboard scoped to Grades 6–9",
      "Timetable management for middle school",
      "Grade-specific attendance reports",
    ],
  },
  {
    role: "vp3",
    label: "VP Primary (Grades 1–5)",
    email: "vp3@school.edu",
    password: "VP3pass!",
    pin: "3456",
    targetRoute: "/vp",
    color: "bg-teal-100 text-teal-700 border-teal-200",
    demoHighlights: [
      "VP dashboard scoped to Grades 1–5",
      "Timetable management for primary school",
    ],
  },
  {
    role: "teacher",
    label: "Teacher",
    email: "teacher@school.edu",
    password: "Teacher123!",
    targetRoute: "/teacher",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    demoHighlights: [
      "Teacher dashboard with Grade 10-A class",
      "Grade Entry dialog — mark per student, auto letter grade",
      "Attendance marking — Present / Absent / Late per student",
      "Homework assignment creation and tracking",
      "At-risk students panel with one-click parent contact",
    ],
  },
  {
    role: "parent",
    label: "Parent",
    email: "parent@school.edu",
    password: "Parent123!",
    targetRoute: "/parent",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    demoHighlights: [
      "Parent dashboard for Aarav Sharma (Grade 10-A)",
      "Transport tracking — bus route, live ETA",
      "Fee payment history and upcoming dues",
      "Messaging with teachers and school admin",
    ],
  },
  {
    role: "student",
    label: "Student",
    email: "student@school.edu",
    password: "Student123!",
    targetRoute: "/student-view",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    demoHighlights: [
      "Student home — schedule, homework, notifications",
      "Weekly timetable — full class schedule by day",
      "Attendance history and homework completion",
      "Fee records and payment history",
    ],
  },
];

const DEMO_FLOW = [
  { step: 1, role: "Admin", action: "Log in as admin@school.edu → show KPI dashboard with live stats", note: "PIN 1234 to view parent contacts in Students" },
  { step: 2, role: "Admin", action: "Navigate to Students → open a student profile → click 'View Parent Phone' → enter PIN 1234", note: "Demonstrates secondary security for sensitive data" },
  { step: 3, role: "Admin", action: "Navigate to AI Insights → show at-risk predictions and trend analysis", note: "Key selling point for board members" },
  { step: 4, role: "VP (vp1)", action: "Log in as vp1@school.edu → show VP Dashboard → navigate to Timetable → add a period", note: "Shows VP-scoped data and timetable management" },
  { step: 5, role: "Teacher", action: "Log in as teacher@school.edu → click Grade Entry → enter marks for students", note: "Auto letter grade calculation in real time" },
  { step: 6, role: "Teacher", action: "Navigate to Attendance → mark present/absent/late per student → Save", note: "Dedicated per-student attendance marking" },
  { step: 7, role: "Parent", action: "Log in as parent@school.edu → show transport tracking → fee history", note: "Parent portal shows complete picture of child" },
  { step: 8, role: "Student", action: "Log in as student@school.edu → view Timetable → full weekly schedule", note: "Student self-service for schedule and homework" },
];

const FEATURE_CHECKLIST = [
  { category: "Security", items: ["OTP auto-fill on login (demo mode)", "PIN-gated sensitive fields (parent phone/email/address)", "3-failure lockout with security notification to admin", "Role-based data scoping (VP sees only their grade range)"] },
  { category: "Admin Portal", items: ["KPI dashboard with real-time counts", "600 students across 12 grades", "Student 360 profile with academic history", "AI risk prediction panel", "Transport management", "Audit Center"] },
  { category: "VP Portal", items: ["Grade-scoped dashboard (3 VPs, 3 grade ranges)", "Timetable management (add/edit/delete periods)", "Attendance overview", "Communication tools"] },
  { category: "Teacher Portal", items: ["Class dashboard with stats", "Grade Entry dialog with letter grade calculation", "Per-student attendance marking", "Homework assignment + tracking", "At-risk student alerts with parent messaging"] },
  { category: "Parent Portal", items: ["Child academic overview", "Transport route tracking with ETA", "Fee payment history", "Two-way messaging"] },
  { category: "Student Portal", items: ["Home dashboard with today's schedule", "Weekly timetable (full grid, Sun–Thu)", "Homework tracking", "Fee records"] },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="ml-1 opacity-50 hover:opacity-100 transition-opacity" title="Copy">
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

export default function DemoGuidePage() {
  const { activeRole } = useRoleStore();
  const [showPasswords, setShowPasswords] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (n: number) => setCompletedSteps((prev) => {
    const next = new Set(prev);
    if (next.has(n)) next.delete(n); else next.add(n);
    return next;
  });

  if (activeRole !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="rounded-full bg-muted p-6">
          <Lock className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <p className="text-lg font-semibold">Restricted Access</p>
          <p className="text-sm text-muted-foreground mt-1">This page is only accessible to the School Admin role.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Demo Readiness Guide"
        description="School board presentation — credentials, flow, and feature checklist"
        breadcrumbs={[{ label: "Admin" }, { label: "Demo Guide" }]}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowPasswords((v) => !v)}>
            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPasswords ? "Hide" : "Show"} Passwords
          </Button>
        }
      />

      {/* Alert */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-800">
        <Shield className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Demo Environment Only</p>
          <p className="text-xs mt-0.5 opacity-80">These credentials are for the board presentation only. All data is simulated. No real student information is stored.</p>
        </div>
      </div>

      {/* Credentials grid */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Login Credentials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {CREDENTIALS.map((cred) => (
            <Card key={cred.role} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" /> {cred.label}
                  </CardTitle>
                  <Badge className={cn("text-xs border", cred.color)}>{cred.role}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs space-y-1 font-mono bg-muted rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="flex items-center">{cred.email}<CopyButton text={cred.email} /></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Password</span>
                    <span className="flex items-center">
                      {showPasswords ? cred.password : "••••••••"}
                      <CopyButton text={cred.password} />
                    </span>
                  </div>
                  {cred.pin && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">PIN</span>
                      <span className="flex items-center font-bold text-primary">
                        {showPasswords ? cred.pin : "••••"}
                        <CopyButton text={cred.pin} />
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Route</span>
                    <span className="text-blue-600">{cred.targetRoute}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  {cred.demoHighlights.slice(0, 3).map((h, i) => (
                    <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary mt-0.5 shrink-0">•</span> {h}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Demo Flow */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recommended Demo Flow</h2>
        <Card>
          <CardContent className="pt-4 space-y-2">
            {DEMO_FLOW.map((step) => {
              const done = completedSteps.has(step.step);
              return (
                <div
                  key={step.step}
                  onClick={() => toggleStep(step.step)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                    done ? "bg-emerald-50 border-emerald-200 opacity-60" : "hover:bg-muted/50"
                  )}
                >
                  <div className="shrink-0 mt-0.5">
                    {done
                      ? <CheckCircle className="h-5 w-5 text-emerald-600" />
                      : <Circle className="h-5 w-5 text-muted-foreground" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-muted-foreground">Step {step.step}</span>
                      <Badge variant="secondary" className="text-[10px]">{step.role}</Badge>
                    </div>
                    <p className="text-sm font-medium mt-0.5">{step.action}</p>
                    {step.note && (
                      <p className="text-xs text-muted-foreground mt-0.5 italic">{step.note}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        {completedSteps.size > 0 && (
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {completedSteps.size} / {DEMO_FLOW.length} steps completed
          </p>
        )}
      </div>

      {/* Feature Checklist */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Feature Checklist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {FEATURE_CHECKLIST.map((cat) => (
            <Card key={cat.category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{cat.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {cat.items.map((item, i) => (
                  <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" /> {item}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
