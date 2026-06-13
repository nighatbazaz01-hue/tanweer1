"use client";
import { useState, useRef, useEffect } from "react";
import {
  Sparkles, X, Send, Bot, Zap, Mail, ClipboardList,
  Users, FileText, Calendar, CheckSquare, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store/useUIStore";
import { useRoleStore, roleConfig } from "@/store/useRoleStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AIMessage } from "@/types";

const roleGreetings: Record<string, string> = {
  admin: "Hello, Dr. Khalid! I'm your AI Executive Assistant. I can provide real-time analytics, risk alerts, take actions like sending messages or generating reports. What would you like to do?",
  vp1: "Hello! I'm your AI Assistant for Grades 1–4 (Lower Primary). I can surface at-risk students, attendance summaries, and teacher updates scoped to your division. What would you like to know?",
  vp2: "Hello! I'm your AI Assistant for Grades 5–8 (Upper Primary). Ask me about attendance trends, student performance, or at-risk alerts — all scoped to your division.",
  vp3: "Hello! I'm your AI Assistant for Grades 9–12 (Secondary). I can show you at-risk students, exam readiness, and attendance data for your division. What do you need?",
  teacher: "Hello, Dr. Sarah! I'm your AI Teaching Assistant. I can message parents, assign homework, find absent students, generate class summaries, and more. What do you need?",
  parent: "Hello! I'm the Tanweer Parent Assistant. I can tell you about Ahmed's attendance, marks, contact his teachers, check upcoming exams, and more. How can I help?",
  student: "Hey Ahmed! 👋 I'm your AI Study Assistant. I can help you prepare for exams, track homework, generate study plans, and give you tips. What do you need help with?",
};

const roleSuggestions: Record<string, string[]> = {
  admin: [
    "Show school health summary",
    "Which students are at highest risk?",
    "Generate school performance report",
    "Send attendance alert to all parents",
  ],
  vp1: [
    "Who are the at-risk students in Grades 1–4?",
    "Show attendance summary for my division",
    "Which Grade 1–4 teachers need attention?",
    "Generate Lower Primary performance report",
  ],
  vp2: [
    "Who are the at-risk students in Grades 5–8?",
    "Show attendance summary for my division",
    "Which Grade 5–8 sections have low attendance?",
    "Generate Upper Primary performance report",
  ],
  vp3: [
    "Who are the at-risk students in Grades 9–12?",
    "Show attendance summary for my division",
    "Which students need exam intervention?",
    "Generate Secondary division performance report",
  ],
  teacher: [
    "Message Ahmed's parents about Physics",
    "Find students absent today",
    "Generate Grade 10-A class summary",
    "Assign revision homework",
  ],
  parent: [
    "How is Ahmed doing this term?",
    "Contact Dr. Sarah about Math exam",
    "Show upcoming exams this month",
    "Check all pending homework",
  ],
  student: [
    "Create study plan for Math exam",
    "What homework is due this week?",
    "How are my grades looking?",
    "Help me with Physics problems",
  ],
};

type ActionType = "message_sent" | "report_generated" | "alert_sent" | "homework_assigned" | "meeting_scheduled" | "task_created";

interface AIAction {
  type: ActionType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const actionConfigs: Record<ActionType, AIAction> = {
  message_sent: { type: "message_sent", label: "Message Sent", description: "via Tanweer Messaging", icon: Mail, color: "bg-blue-100 text-blue-700" },
  report_generated: { type: "report_generated", label: "Report Generated", description: "Available in downloads", icon: BarChart3, color: "bg-violet-100 text-violet-700" },
  alert_sent: { type: "alert_sent", label: "Alert Dispatched", description: "Notified all recipients", icon: Zap, color: "bg-amber-100 text-amber-700" },
  homework_assigned: { type: "homework_assigned", label: "Homework Assigned", description: "Students notified", icon: FileText, color: "bg-emerald-100 text-emerald-700" },
  meeting_scheduled: { type: "meeting_scheduled", label: "Meeting Scheduled", description: "Invites sent to attendees", icon: Calendar, color: "bg-indigo-100 text-indigo-700" },
  task_created: { type: "task_created", label: "Task Created", description: "Added to task board", icon: CheckSquare, color: "bg-pink-100 text-pink-700" },
};

interface AIResponseData {
  text: string;
  action?: ActionType;
  actionDetail?: string;
}

const vpResponse = (gradeLabel: string, gradeRange: string, startGrade: number): (msg: string) => AIResponseData => {
  return (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("at-risk") || m.includes("risk")) return {
      text: `⚠️ **At-Risk Students — ${gradeLabel}:**\n\nBased on attendance and performance data for ${gradeRange}, there are students flagged with attendance below 80% or performance tier "at-risk".\n\n📌 Recommended actions:\n• Schedule parent outreach for high-risk cases\n• Assign mentoring sessions with grade counselor\n• Review attendance patterns weekly\n\nNavigate to the VP Dashboard for the full at-risk list with individual scores.`,
    };
    if (m.includes("attendance") || m.includes("summary")) return {
      text: `📊 **Attendance Summary — ${gradeLabel}:**\n\n${gradeRange} Division\n• Average Attendance: ~${startGrade <= 4 ? "96.2" : startGrade <= 8 ? "93.6" : "92.4"}%\n• All 4 grades tracked daily\n\n📌 Attendance is reviewed weekly. Students below 85% are flagged automatically.\n\nView the full trend chart on your VP Dashboard.`,
    };
    if (m.includes("report") || m.includes("generate")) return {
      text: `✅ **Division Performance Report Generated**\n\n${gradeLabel} — ${gradeRange}\n\nReport includes:\n• Grade-by-grade attendance breakdown\n• At-risk student list with contact details\n• Teacher assignment coverage\n• Upcoming exams and events\n\n📊 Report saved and ready for download.`,
      action: "report_generated",
      actionDetail: `${gradeLabel}_Performance_Report.pdf`,
    };
    if (m.includes("teacher")) return {
      text: `👨‍🏫 **Teachers in ${gradeLabel}:**\n\nAll teachers assigned to ${gradeRange} are listed on your VP Dashboard under "Assigned Teachers".\n\n📌 To flag a concern or schedule a meeting with a specific teacher, navigate to the teacher's profile from the Teacher Directory.`,
    };
    return {
      text: `I can help you manage ${gradeLabel}. Try asking:\n\n• "Who are the at-risk students?"\n• "Show attendance summary for my division"\n• "Generate division performance report"\n• "Which teachers need attention?"\n\nAll data is scoped exclusively to ${gradeRange}.`,
    };
  };
};

const roleResponses: Record<string, (msg: string) => AIResponseData> = {
  admin: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("health") || m.includes("school summary")) return {
      text: "🏫 **School Health Score: 87/100**\n\n• Attendance: 94.3% ✅\n• Fee Collection: 87.5% ⚠️\n• Teacher Presence: 97.1% ✅\n• Parent Satisfaction: 4.3/5 ✅\n• At-Risk Students: 23 ⚠️\n\nFee collection is the primary area requiring attention. 15 students predicted to default on Q2 fees.",
    };
    if (m.includes("risk") || m.includes("at-risk")) return {
      text: "⚠️ **Top 5 At-Risk Students:**\n\n1. Omar Al-Ghamdi (Grade 11-B) — Academic + Fee Default, Risk: 87% 🔴\n2. Rayan Al-Khalidi (Grade 8-C) — Attendance 71%, Risk: 79% 🔴\n3. Sara Al-Qahtani (Grade 9-A) — Academic Decline, Risk: 72% 🟡\n4. Ali Al-Mansouri (Grade 12-B) — Fee Default Risk, Risk: 65% 🟡\n5. Lina Al-Dosari (Grade 7-A) — Frequent Absences, Risk: 61% 🟡\n\nImmediate parent outreach recommended for students 1 and 2.",
    };
    if (m.includes("report") || m.includes("generate")) return {
      text: "✅ **School Performance Report Generated**\n\nReport includes:\n• Q2 attendance analytics (all grades)\n• Fee collection vs. target breakdown\n• Teacher performance metrics\n• At-risk student list with interventions\n• Admissions funnel analysis\n\n📊 The report has been saved and is ready for download.",
      action: "report_generated",
      actionDetail: "Q2_School_Performance_Report.pdf",
    };
    if (m.includes("alert") || m.includes("send") || m.includes("parent")) return {
      text: "📨 **Attendance Alert Dispatched**\n\nSent to: 600 parent accounts\nMessage: 'Reminder — school attendance is now tracked daily. Students with <90% attendance will be flagged for intervention.'\n\nDelivery channel: Parent Portal + SMS\nExpected reach: 94% within 2 hours.",
      action: "alert_sent",
      actionDetail: "Attendance reminder sent to 600 parents",
    };
    if (m.includes("fee") || m.includes("collection")) return {
      text: "💰 **Fee Collection — June 2024**\n\n• Target: SAR 2,140,000\n• Collected: SAR 1,873,500 (87.5%)\n• Gap: SAR 266,500\n\nOverdue accounts: 128 students\nAI predicts 15 students will default.\n\n📌 Recommendation: Send automated reminders to 43 accounts overdue >30 days.",
    };
    if (m.includes("meeting") || m.includes("schedule")) return {
      text: "📅 **Meeting Scheduled**\n\nEmergency At-Risk Student Review Meeting:\n• Date: June 14, 2024 at 01:00 PM\n• Room: Seminar Room B\n• Attendees notified: VP, 4 teachers, school counselor\n\nAgenda auto-generated and attached.",
      action: "meeting_scheduled",
      actionDetail: "At-Risk Student Review — June 14, 01:00 PM",
    };
    return {
      text: "I can help you analyze that. Al-Noor Academy has a health score of 87/100. The main areas to watch are fee collection (87.5%) and the 23 at-risk students. Try asking me to 'generate school report' or 'send attendance alert to parents'.",
    };
  },
  vp1: vpResponse("Grades 1–4", "Lower Primary (Grades 1–4)", 1),
  vp2: vpResponse("Grades 5–8", "Upper Primary (Grades 5–8)", 5),
  vp3: vpResponse("Grades 9–12", "Secondary (Grades 9–12)", 9),
  teacher: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("message") && (m.includes("parent") || m.includes("ahmed"))) return {
      text: "📨 **Message Sent to Mohammed Al-Rashidi (Ahmed's Parent)**\n\nMessage: 'Dear Mohammed, I wanted to share my concern about Ahmed's Physics performance this term. His last 3 scores show a declining trend (-1 this term). I recommend we schedule a meeting to discuss a support plan. Available: Thu 4pm or Fri 2pm.'\n\nSent via: Tanweer Messaging\nExpected response time: Within 24 hours",
      action: "message_sent",
      actionDetail: "To: Mohammed Al-Rashidi (Ahmed's parent)",
    };
    if (m.includes("absent") || m.includes("missing")) return {
      text: "📋 **Students Absent Today (Grade 10-A):**\n\n• Omar Al-Ghamdi — 3rd absence this week ⚠️\n\n**Parent contact status:**\n• Omar's parent: Not contacted yet\n\nShall I send an automated absence notification to Omar's parent?",
    };
    if (m.includes("summary") || m.includes("class") || m.includes("generate")) return {
      text: "📊 **Grade 10-A Class Summary Generated**\n\n**Attendance:** 87.5% (28/32 present today)\n**Homework Submission:** 87.5% (28/32 submitted)\n**Last Assessment Avg:** 80.2%\n\n**Top 3 Students:** Fatima Al-Zahrani (96%), Nora Al-Otaibi (91%), Ahmed Al-Rashidi (82%)\n**Needs Attention:** Omar Al-Ghamdi (38%, High Risk)\n\nSummary saved to class dashboard.",
      action: "report_generated",
      actionDetail: "Grade 10-A Weekly Summary Report",
    };
    if (m.includes("homework") || m.includes("assign")) return {
      text: "✅ **Homework Assigned**\n\nTitle: 'Exam Revision — Chapters 4 & 5'\nGrade: 10-A\nDue Date: June 17, 2024\nPoints: 20\n\nAll 32 students in Grade 10-A have been notified via the Student Portal and their parents via the Parent Portal.",
      action: "homework_assigned",
      actionDetail: "Revision homework assigned to Grade 10-A",
    };
    if (m.includes("meeting") || m.includes("schedule")) return {
      text: "📅 **Meeting Scheduled**\n\n1-on-1 with Mohammed Al-Rashidi (Ahmed's parent):\n• Date: June 15, 2024 at 04:00 PM\n• Room: Room 204\n• Agenda: Physics performance, study plan, Q3 targets\n\nInvite sent to parent. You'll receive a confirmation soon.",
      action: "meeting_scheduled",
      actionDetail: "Ahmed's Physics Support Meeting — Jun 15",
    };
    if (m.includes("performance") || m.includes("grade 10") || m.includes("class")) return {
      text: "📊 **Grade 10-A Performance Summary:**\n\n• Class Average: 80.2%\n• Top: Fatima Al-Zahrani (96%) 🌟\n• Lowest: Omar Al-Ghamdi (38%) ⚠️\n\n**Grade Distribution:**\n• A (90+): 12 students\n• B (70-89): 18 students  \n• C (60-69): 9 students\n• Below 60: 5 students\n\nOmar Al-Ghamdi needs urgent 1-on-1 intervention.",
    };
    return {
      text: "I can help with that! Try asking me to 'message Ahmed's parent about Physics', 'find absent students today', 'generate class summary', or 'assign revision homework'. I can execute these actions instantly.",
    };
  },
  parent: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("contact") || m.includes("message") || m.includes("sarah") || m.includes("teacher")) return {
      text: "📨 **Message Sent to Dr. Sarah Al-Hamdan**\n\nMessage: 'Dear Dr. Sarah, I am writing about Ahmed's preparation for the upcoming Math mid-term exam. Could you please advise on specific areas to focus on and any additional resources? Thank you.'\n\nSent via: Tanweer Messaging\nDr. Sarah typically responds within 4 hours during school days.",
      action: "message_sent",
      actionDetail: "To: Dr. Sarah Al-Hamdan (Math Teacher)",
    };
    if (m.includes("attendance")) return {
      text: "📅 **Ahmed's Attendance — June 2024:**\n\nRate: 94.3% ✅\nPresent: 16 days | Absent: 1 day | Late: 0\n\nCurrent Streak: 12 consecutive days! 🔥\nYear-to-date: 94.8% — above school average (93.5%).\n\n✅ Ahmed's attendance is excellent. No concerns.",
    };
    if (m.includes("exam") || m.includes("upcoming")) return {
      text: "📝 **Ahmed's Upcoming Exams:**\n\n• **Jun 20** — Math Mid-Term (30%) — Exam Hall A, 08:00\n• **Jun 22** — Physics Mid-Term (30%) — Exam Hall B, 10:00\n• **Jun 24** — English Quiz (10%)\n• **Jun 26** — Chemistry Practical (15%)\n\n⚠️ Math exam is in 7 days. He should review Chapters 4 & 5 tonight.",
    };
    if (m.includes("homework") || m.includes("pending")) return {
      text: "📚 **Ahmed's Pending Homework:**\n\n⚠️ **English Essay** — Due Jun 16 — NOT STARTED!\n⚠️ **Physics Lab Report** — Due Jun 18 — NOT STARTED!\n🔄 **CS Python Project** — Due Jun 20 — In Progress (0%)\n\n✅ Chemistry (22/25) and Math (18/20) submitted.\n\nShall I send a reminder notification to Ahmed?",
    };
    if (m.includes("grade") || m.includes("marks") || m.includes("doing")) return {
      text: "📊 **Ahmed's Academic Summary:**\n\nGPA: 3.4 (B+) | Class Rank: 7/32\n\n• Arabic: 91/100 — A 🌟\n• English: 87/100 — A-\n• CS: 88/100 — A-\n• Chemistry: 84/100 — A-\n• Mathematics: 82/100 — B+\n• Physics: 79/100 — B+ ↓ (declining!)\n\nOverall trending positively. Physics is the only concern.",
    };
    return {
      text: "I'm here to help you stay connected with Ahmed's school journey. Try asking me to 'contact Dr. Sarah about Math exam', 'show upcoming exams', 'check pending homework', or 'show attendance'. I can also send messages to teachers on your behalf!",
    };
  },
  student: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("study plan") || m.includes("prepare") || m.includes("math")) return {
      text: "📖 **7-Day Math Mid-Term Study Plan:**\n\n**Day 1-2 (Jun 13-14):** Chapter 4 — Trigonometry\n• Practice 15 problems daily\n• Review unit circle and identities\n\n**Day 3-4 (Jun 15-16):** Chapter 5 — Quadratic Equations\n• Complete the 20-question practice sheet\n• Focus on vertex form and applications\n\n**Day 5 (Jun 17):** Chapter 3 — Polynomials review\n\n**Day 6 (Jun 18):** Past paper simulation (45 mins timed)\n\n**Day 7 (Jun 19):** Review mistakes + light revision only\n\n💡 Dr. Sarah says: focus on timed practice — you struggle under time pressure.\n\nPlan saved to your dashboard!",
      action: "task_created",
      actionDetail: "7-Day Math Study Plan created",
    };
    if (m.includes("homework") || m.includes("due")) return {
      text: "📚 **Your Homework This Week:**\n\n🔴 **English Essay** — Due Jun 16 (NOT STARTED!) — 25 marks\n🔴 **Physics Lab Report** — Due Jun 18 (NOT STARTED!) — 30 marks\n🟡 **CS Python Project** — Due Jun 20 (In Progress) — 50 marks\n\n✅ Math Exercises — Submitted (18/20)\n✅ Chemistry Problems — Submitted (22/25)\n✅ Arabic Reading — Submitted (19/20)\n\n📌 Start the English essay tonight — it's your highest-stakes pending item!",
    };
    if (m.includes("grade") || m.includes("mark") || m.includes("score")) return {
      text: "📊 **Your Current Grades:**\n\n🌟 Arabic: 91/100 — A (+3)\n📈 CS: 88/100 — A- (+5)\n📈 English: 87/100 — A- (+2)\n📈 Chemistry: 84/100 — A- (+6 — most improved!)\n📈 Mathematics: 82/100 — B+ (+4)\n⚠️ Physics: 79/100 — B+ (-1, declining!)\n\nOverall GPA: 3.4 (B+) | Class Rank: 7/32\n\nFocus on Physics — it's your only declining subject.",
    };
    if (m.includes("physics") || m.includes("problem")) return {
      text: "🔬 **Physics Support Plan:**\n\n**Your weak areas (based on last 3 tests):**\n• Newton's Laws of Motion (scored 65%)\n• Energy and Work calculations (scored 70%)\n• Projectile motion (scored 72%)\n\n**Recommended resources:**\n1. Khan Academy — Unit 3: Forces (30 min)\n2. Your textbook problems P.87-92\n3. Mr. Khalid's revision sheet (available on portal)\n\n**Quick tip:** You understand the theory but lose points on calculations. Practice 3 timed problems every day.",
    };
    if (m.includes("project")) return {
      text: "🔬 **Your Active Projects:**\n\n1. **Solar Energy Efficiency** (Physics)\n   Progress: 65% | Due: Jun 25 | Team: Ahmed, Fatima, Omar\n   ⚡ Next step: Write the analysis section (your part)\n\n2. **Population Growth Math Model** (Mathematics)\n   Progress: 40% | Due: Jun 30 | Team: Ahmed, Nora\n   ⚡ Next step: Collect data for 3 more cities\n\n📌 Solar project needs 35% more work in 12 days. Consider a team meeting this weekend!",
    };
    return {
      text: "I'm your personal AI study assistant! Here's what I can do for you:\n\n📖 Create custom study plans\n📊 Analyze your grade trends\n📝 Track all your homework\n🔬 Help you understand concepts\n📅 Show exam preparation timelines\n\nTry asking: 'Create a study plan for Math exam' or 'What homework is due this week?'",
    };
  },
};

export function AIDrawer() {
  const { aiDrawerOpen, setAiDrawerOpen } = useUIStore();
  const { activeRole } = useRoleStore();
  const cfg = roleConfig[activeRole];

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastAction, setLastAction] = useState<{ type: ActionType; detail?: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{
      id: "1",
      role: "assistant",
      content: roleGreetings[activeRole],
      timestamp: new Date(),
    }]);
    setLastAction(null);
  }, [activeRole]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    const userMsg: AIMessage = { id: Date.now().toString(), role: "user", content: msg, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setLastAction(null);

    setTimeout(() => {
      const respFn = roleResponses[activeRole];
      const response = respFn ? respFn(msg) : { text: "Let me look into that for you..." };
      const aiMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (response.action) {
        setLastAction({ type: response.action, detail: response.actionDetail });
      }
      setIsTyping(false);
    }, 1100);
  };

  if (!aiDrawerOpen) return null;
  const suggestions = roleSuggestions[activeRole];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b text-white"
        style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}>
        <Sparkles className="h-5 w-5" />
        <div className="flex-1">
          <p className="font-semibold text-sm">Tanweer AI — {cfg.label}</p>
          <p className="text-xs text-violet-200">Ask or command · Actions enabled</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setAiDrawerOpen(false)} className="h-8 w-8 text-white hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Action Banner */}
      {lastAction && (
        <div className={cn("mx-3 mt-3 rounded-xl p-3 flex items-center gap-2.5 border", actionConfigs[lastAction.type].color)}>
          <div className={cn("p-1.5 rounded-lg shrink-0", actionConfigs[lastAction.type].color)}>
            {(() => { const Icon = actionConfigs[lastAction.type].icon; return <Icon className="h-4 w-4" />; })()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold">{actionConfigs[lastAction.type].label}</p>
            <p className="text-xs opacity-80">{lastAction.detail || actionConfigs[lastAction.type].description}</p>
          </div>
          <Badge className="text-[10px] shrink-0">Done ✓</Badge>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            {msg.role === "assistant" && (
              <div className="h-7 w-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-1">
                <Bot className="h-4 w-4 text-violet-600" />
              </div>
            )}
            <div className={cn(
              "max-w-[82%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line leading-relaxed",
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted rounded-tl-sm"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="h-7 w-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-violet-600" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
              <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions (first message only) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-xs font-semibold text-muted-foreground">Quick Actions</p>
          </div>
          <div className="flex flex-col gap-1.5">
            {suggestions.map((s) => (
              <button key={s} onClick={() => handleSend(s)}
                className="text-xs text-left px-3 py-2 rounded-lg bg-muted hover:bg-accent transition-colors border border-border/50">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask or give a command..."
            className="h-9 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="icon" className="h-9 w-9 shrink-0" onClick={() => handleSend()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          AI can send messages, assign tasks, and generate reports
        </p>
      </div>
    </div>
  );
}
