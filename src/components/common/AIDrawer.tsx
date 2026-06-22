"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles, X, Send, Bot, Zap, Mail, ClipboardList,
  Users, FileText, Calendar, CheckSquare, BarChart3,
  Mic, MicOff, ChevronDown, ChevronUp,
  BookOpen, UserCheck, Heart, DollarSign, Building2, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store/useUIStore";
import { useRoleStore, roleConfig } from "@/store/useRoleStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AIMessage } from "@/types";
import { useVoiceInput, type VoiceError } from "@/hooks/useVoiceInput";
import { roleSuggestions, type CategoryId } from "@/lib/aiSuggestions";

// ─── Icon map for suggestion categories ────────────────────────────────────────
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  BookOpen, UserCheck, Heart, Users, TrendingUp, DollarSign, Building2, Sparkles,
};

// ─── Role greetings ─────────────────────────────────────────────────────────────
const roleGreetings: Record<string, string> = {
  admin:   "Hello, Dr. Mushtaq! I'm your AI Executive Assistant. I can provide real-time analytics, risk alerts, take actions like sending messages or generating reports. What would you like to do?",
  vp1:     "Hello! I'm your AI Assistant for Grades 1–4 (Lower Primary). I can surface at-risk students, attendance summaries, and teacher updates scoped to your division. What would you like to know?",
  vp2:     "Hello! I'm your AI Assistant for Grades 5–8 (Upper Primary). Ask me about attendance trends, student performance, or at-risk alerts — all scoped to your division.",
  vp3:     "Hello! I'm your AI Assistant for Grades 9–12 (Secondary). I can show you at-risk students, exam readiness, and attendance data for your division. What do you need?",
  teacher: "Hello, Dr. Priya! I'm your AI Teaching Assistant. I can message parents, assign homework, find absent students, generate class summaries, and more. What do you need?",
  parent:  "Hello! I'm the Parent AI Assistant. I can tell you about Aarav's attendance, marks, contact his teachers, check upcoming exams, and more. How can I help?",
  student: "Hey Aarav! 👋 I'm your AI Study Assistant. I can help you prepare for exams, track homework, generate study plans, and give you tips. What do you need help with?",
};

// ─── Action types ───────────────────────────────────────────────────────────────
type SchoolActionType  = "message_sent" | "report_generated" | "alert_sent" | "homework_assigned" | "meeting_scheduled";
type StudyActionType   = "study_plan_created" | "task_created";
type ActionType        = SchoolActionType | StudyActionType;

interface AIAction {
  type: ActionType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const actionConfigs: Record<ActionType, AIAction> = {
  message_sent:       { type: "message_sent",       label: "Message Sent",       description: "via Tanweer Messaging",    icon: Mail,         color: "bg-blue-100 text-blue-700"    },
  report_generated:   { type: "report_generated",   label: "Report Generated",   description: "Available in downloads",   icon: BarChart3,    color: "bg-violet-100 text-violet-700" },
  alert_sent:         { type: "alert_sent",          label: "Alert Dispatched",   description: "Notified all recipients",  icon: Zap,          color: "bg-amber-100 text-amber-700"  },
  homework_assigned:  { type: "homework_assigned",   label: "Homework Assigned",  description: "Students notified",        icon: FileText,     color: "bg-emerald-100 text-emerald-700"},
  meeting_scheduled:  { type: "meeting_scheduled",   label: "Meeting Scheduled",  description: "Invites sent",             icon: Calendar,     color: "bg-indigo-100 text-indigo-700" },
  study_plan_created: { type: "study_plan_created",  label: "Study Plan Created", description: "Saved to your dashboard",  icon: CheckSquare,  color: "bg-emerald-100 text-emerald-700"},
  task_created:       { type: "task_created",        label: "Task Added",         description: "Added to your study board",icon: ClipboardList,color: "bg-amber-100 text-amber-700"  },
};

// ─── AI response engine ─────────────────────────────────────────────────────────
interface AIResponseData { text: string; action?: ActionType; actionDetail?: string; }

const vpResponse = (gradeLabel: string, gradeRange: string, startGrade: number) => (msg: string): AIResponseData => {
  const m = msg.toLowerCase();
  if (m.includes("at-risk") || m.includes("risk") || m.includes("intervention")) return {
    text: `⚠️ **At-Risk Students — ${gradeLabel}:**\n\nBased on attendance and performance data for ${gradeRange}, there are students flagged with attendance below 80% or performance tier "at-risk".\n\n📌 Recommended actions:\n• Schedule parent outreach for high-risk cases\n• Assign mentoring sessions with grade counselor\n• Review attendance patterns weekly\n\nNavigate to the VP Dashboard for the full at-risk list with individual scores.`,
  };
  if (m.includes("attendance") || m.includes("summary") || m.includes("compare")) return {
    text: `📊 **Attendance Summary — ${gradeLabel}:**\n\n${gradeRange} Division\n• Average Attendance: ~${startGrade <= 4 ? "96.2" : startGrade <= 8 ? "93.6" : "92.4"}%\n• All grades tracked daily\n\n📌 Students below 85% are flagged automatically.\n\nView the full trend chart on your VP Dashboard.`,
  };
  if (m.includes("report") || m.includes("generate") || m.includes("performance")) return {
    text: `✅ **Division Performance Report Generated**\n\n${gradeLabel} — ${gradeRange}\n\nReport includes:\n• Grade-by-grade attendance breakdown\n• At-risk student list with contact details\n• Teacher assignment coverage\n• Upcoming exams and events\n\n📊 Report saved and ready for download.`,
    action: "report_generated", actionDetail: `${gradeLabel}_Performance_Report.pdf`,
  };
  if (m.includes("teacher") || m.includes("support")) return {
    text: `👨‍🏫 **Teachers in ${gradeLabel}:**\n\nAll teachers assigned to ${gradeRange} are listed on your VP Dashboard under "Assigned Teachers".\n\n📌 To flag a concern or schedule a meeting, navigate to the teacher's profile from the Teacher Directory.`,
  };
  if (m.includes("parent") || m.includes("meeting")) return {
    text: `📅 **Parent Meetings — ${gradeLabel}:**\n\nStudents with attendance below 85% or performance tier "at-risk" are recommended for parent-teacher meetings.\n\n📌 Navigate to Meetings to schedule parent-teacher conferences for flagged students.`,
    action: "meeting_scheduled", actionDetail: `Parent Outreach — ${gradeLabel}`,
  };
  if (m.includes("wellbeing") || m.includes("stress") || m.includes("mindful") || m.includes("counsel")) return {
    text: `💚 **Wellbeing Insights — ${gradeLabel}:**\n\nBased on engagement patterns and attendance data:\n• Students with >3 absences this month may need check-ins\n• Recommend daily mindfulness activities\n• Social-emotional learning sessions available\n\n📌 Connect with the school counselor for individual student wellbeing plans.`,
  };
  return {
    text: `I can help you manage ${gradeLabel}. Try asking:\n\n• "Who are the at-risk students?"\n• "Show attendance summary for my division"\n• "Generate division performance report"\n• "Which teachers need attention?"\n\nAll data is scoped exclusively to ${gradeRange}.`,
  };
};

const roleResponses: Record<string, (msg: string) => AIResponseData> = {
  admin: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("health") || m.includes("school summary") || m.includes("board") || m.includes("metric")) return {
      text: "🏫 **School Health Score: 87/100**\n\n• Attendance: 94.3% ✅\n• Fee Collection: 87.5% ⚠️\n• Teacher Presence: 97.1% ✅\n• Parent Satisfaction: 4.3/5 ✅\n• At-Risk Students: 23 ⚠️\n\nFee collection is the primary area requiring attention. 15 students predicted to default on Q2 fees.",
    };
    if (m.includes("risk") || m.includes("at-risk") || m.includes("declining") || m.includes("intervention")) return {
      text: "⚠️ **Top 5 At-Risk Students:**\n\n1. Aryan Koul (Grade 11-B) — Academic + Fee Default, Risk: 87% 🔴\n2. Rohan Sheikh (Grade 8-C) — Attendance 71%, Risk: 79% 🔴\n3. Sara Wani (Grade 9-A) — Academic Decline, Risk: 72% 🟡\n4. Ali Shah (Grade 12-B) — Fee Default Risk, Risk: 65% 🟡\n5. Lina Bhat (Grade 7-A) — Frequent Absences, Risk: 61% 🟡\n\nImmediate parent outreach recommended for students 1 and 2.",
    };
    if (m.includes("report") || m.includes("generate")) return {
      text: "✅ **School Performance Report Generated**\n\nReport includes:\n• Q2 attendance analytics (all grades)\n• Fee collection vs. target breakdown\n• Teacher performance metrics\n• At-risk student list with interventions\n• Admissions funnel analysis\n\n📊 The report has been saved and is ready for download.",
      action: "report_generated", actionDetail: "Q2_School_Performance_Report.pdf",
    };
    if (m.includes("alert") || m.includes("send") || (m.includes("parent") && !m.includes("concern"))) return {
      text: "📨 **Attendance Alert Dispatched**\n\nSent to: 600 parent accounts\nMessage: 'Reminder — school attendance is now tracked daily. Students with <90% attendance will be flagged for intervention.'\n\nDelivery channel: Parent Portal + SMS\nExpected reach: 94% within 2 hours.",
      action: "alert_sent", actionDetail: "Attendance reminder sent to 600 parents",
    };
    if (m.includes("fee") || m.includes("collection") || m.includes("financial")) return {
      text: "💰 **Fee Collection — June 2026**\n\n• Target: ₹21,40,000\n• Collected: ₹18,73,500 (87.5%)\n• Gap: ₹2,66,500\n\nOverdue accounts: 128 students\nAI predicts 15 students will default.\n\n📌 Recommendation: Send automated reminders to 43 accounts overdue >30 days.",
    };
    if (m.includes("admission") || m.includes("enrol") || m.includes("funnel")) return {
      text: "📥 **Admissions Funnel — June 2026:**\n\n• Leads: 43\n• Contacted: 31 (72%)\n• Interview: 18 (42%)\n• Enrolled: 12 (28%)\n\nConversion rate: 28% — above last year's 22%.\n📌 Recommend follow-up with 13 interviewed but not enrolled candidates.",
    };
    if (m.includes("meeting") || m.includes("schedule")) return {
      text: "📅 **Meeting Scheduled**\n\nEmergency At-Risk Student Review Meeting:\n• Date: June 25, 2026 at 01:00 PM\n• Room: Seminar Room B\n• Attendees notified: VP, 4 teachers, school counselor\n\nAgenda auto-generated and attached.",
      action: "meeting_scheduled", actionDetail: "At-Risk Student Review — June 25, 01:00 PM",
    };
    if (m.includes("teacher") || m.includes("staff")) return {
      text: "👨‍🏫 **Teacher Support Overview:**\n\n• Total teachers: 50\n• Attendance rate: 97.1% ✅\n• 3 teachers flagged for classroom observation this term\n• 2 teachers on professional development track\n\n📌 Navigate to Teacher Directory to view individual profiles and schedule support sessions.",
    };
    if (m.includes("wellbeing") || m.includes("counsel") || m.includes("stress") || m.includes("concern")) return {
      text: "💚 **Student Wellbeing Overview:**\n\n• 8 students referred to school counselor this month\n• 3 students showing signs of chronic stress (attendance + performance patterns)\n• 2 students flagged for social isolation\n\n📌 Recommend scheduling wellbeing check-ins for flagged students. Mind·Body·Soul programme can support all three cases.",
    };
    if (m.includes("improve") || m.includes("culture") || m.includes("operational")) return {
      text: "🏫 **Top Operational Risks — June 2026:**\n\n1. Fee collection gap (₹2.66L) — needs immediate follow-up\n2. 23 at-risk students without intervention plans\n3. Attendance declining in Grades 9-12 (92.4%)\n4. Parent satisfaction dipped in Grades 5-8 (3.9/5)\n\n📌 Generating improvement action plan...",
      action: "report_generated", actionDetail: "Operational Risk Action Plan.pdf",
    };
    return {
      text: "I can help you analyze that. Foundation School Humhama has a health score of 87/100. The main areas to watch are fee collection (87.5%) and the 23 at-risk students. Try asking me to 'generate school report' or 'send attendance alert to parents'.",
    };
  },
  vp1: vpResponse("Grades 1–4", "Lower Primary (Grades 1–4)", 1),
  vp2: vpResponse("Grades 5–8", "Upper Primary (Grades 5–8)", 5),
  vp3: vpResponse("Grades 9–12", "Secondary (Grades 9–12)", 9),
  teacher: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("message") && (m.includes("parent") || m.includes("aarav"))) return {
      text: "📨 **Message Sent to Arjun Sharma (Aarav's Parent)**\n\nMessage: 'Dear Arjun, I wanted to share my concern about Aarav's Physics performance this term. His last 3 scores show a declining trend. I recommend we schedule a meeting to discuss a support plan. Available: Thu 4pm or Fri 2pm.'\n\nSent via: Tanweer Messaging\nExpected response time: Within 24 hours",
      action: "message_sent", actionDetail: "To: Arjun Sharma (Aarav's parent)",
    };
    if (m.includes("absent") || m.includes("missing") || m.includes("attendance")) return {
      text: "📋 **Students Absent Today (Grade 10-A):**\n\n• Rohan Sheikh — 3rd absence this week ⚠️\n\n**Parent contact status:**\n• Rohan's parent: Not contacted yet\n\nShall I send an automated absence notification to Rohan's parent?",
    };
    if (m.includes("summary") || m.includes("class") || m.includes("generate") || m.includes("performance")) return {
      text: "📊 **Grade 10-A Class Summary Generated**\n\n**Attendance:** 92.3% (12/13 present today)\n**Homework Submission:** 84.6% (11/13 submitted)\n**Last Assessment Avg:** 83.1%\n\n**Top 3 Students:** Noor Kaul (91%), Aarav Sharma (87%), Fatima Sheikh (96%)\n**Needs Attention:** Rohan Sheikh (absent)\n\nSummary saved to class dashboard.",
      action: "report_generated", actionDetail: "Grade 10-A Weekly Summary Report",
    };
    if (m.includes("homework") || m.includes("assign")) return {
      text: "✅ **Homework Assigned**\n\nTitle: 'Exam Revision — Chapters 4 & 5'\nGrade: 10-A\nDue Date: June 26, 2026\nPoints: 20\n\nAll 13 students in Grade 10-A have been notified via the Student Portal and their parents via the Parent Portal.",
      action: "homework_assigned", actionDetail: "Revision homework assigned to Grade 10-A",
    };
    if (m.includes("meeting") || m.includes("schedule")) return {
      text: "📅 **Meeting Scheduled**\n\n1-on-1 with Arjun Sharma (Aarav's parent):\n• Date: June 26, 2026 at 04:00 PM\n• Room: Room 204\n• Agenda: Physics performance, study plan, Q3 targets\n\nInvite sent to parent.",
      action: "meeting_scheduled", actionDetail: "Aarav's Physics Support Meeting — Jun 26",
    };
    if (m.includes("support") || m.includes("extra") || m.includes("risk") || m.includes("behind")) return {
      text: "📊 **Students Needing Extra Support — Grade 10-A:**\n\n⚠️ High Risk:\n• Rohan Sheikh — Attendance 71%, performance declining\n\n🟡 Watch List:\n• Sara Wani — Physics score -8 this term\n• Ali Shah — Homework submission rate 65%\n\n📌 Recommend 1-on-1 sessions for Rohan and parent contact for all three.",
    };
    if (m.includes("wellbeing") || m.includes("stress") || m.includes("isolated") || m.includes("counsel")) return {
      text: "💚 **Wellbeing Check — Grade 10-A:**\n\nBased on engagement and attendance patterns:\n• Rohan Sheikh — 3 absences, low engagement. Recommend counselor referral.\n• No other students flagged this week.\n\n📌 Mindfulness activity recommended before exams. School counselor available Tue/Thu 2-4pm.",
    };
    return {
      text: "I can help with that! Try asking me to 'message Aarav's parent about Physics', 'find absent students today', 'generate class summary', or 'assign revision homework'. I can execute these actions instantly.",
    };
  },
  parent: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("contact") || m.includes("message") || m.includes("priya") || m.includes("teacher")) return {
      text: "📨 **Message Sent to Dr. Priya Sharma**\n\nMessage: 'Dear Dr. Priya, I am writing about Aarav's preparation for the upcoming Math mid-term exam. Could you please advise on specific areas to focus on and any additional resources? Thank you.'\n\nSent via: Tanweer Messaging\nDr. Priya typically responds within 4 hours during school days.",
      action: "message_sent", actionDetail: "To: Dr. Priya Sharma (Math Teacher)",
    };
    if (m.includes("attendance") || m.includes("attending")) return {
      text: "📅 **Aarav's Attendance — June 2026:**\n\nRate: 94.3% ✅\nPresent: 16 days | Absent: 1 day | Late: 1\n\nCurrent Streak: 12 consecutive days! 🔥\nYear-to-date: 94.8% — above school average (93.5%).\n\n✅ Aarav's attendance is excellent. No concerns.",
    };
    if (m.includes("exam") || m.includes("upcoming")) return {
      text: "📝 **Aarav's Upcoming Exams:**\n\n• **Jun 20** — Math Mid-Term (30%) — Exam Hall A, 08:00\n• **Jun 22** — Physics Mid-Term (30%) — Exam Hall B, 10:00\n• **Jun 24** — English Quiz (10%)\n• **Jun 26** — Chemistry Practical (15%)\n\n⚠️ Chemistry practical is tomorrow. Review lab notes tonight.",
    };
    if (m.includes("homework") || m.includes("pending") || m.includes("missing")) return {
      text: "📚 **Aarav's Pending Homework:**\n\n⚠️ **English Essay** — Due Jun 16 — NOT STARTED!\n⚠️ **Physics Lab Report** — Due Jun 18 — NOT STARTED!\n🔄 **CS Python Project** — Due Jun 20 — In Progress\n\n✅ Chemistry (22/25) and Math (18/20) submitted.\n\nShall I send a reminder notification to Aarav?",
    };
    if (m.includes("grade") || m.includes("mark") || m.includes("doing") || m.includes("overall") || m.includes("performance") || m.includes("strength")) return {
      text: "📊 **Aarav's Academic Summary:**\n\nOverall Grade: B+ | Rank: 7 in class\n\n• Urdu: 91/100 — A 🌟 (Strongest subject)\n• English: 87/100 — A-\n• CS: 88/100 — A-\n• Chemistry: 84/100 — A-\n• Mathematics: 82/100 — B+\n• Physics: 79/100 — B+ ↓ (needs attention)\n\nOverall trending positively. Physics is the only concern.",
    };
    if (m.includes("support") || m.includes("home") || m.includes("study") || m.includes("habit") || m.includes("improve")) return {
      text: "🏠 **Supporting Aarav's Learning at Home:**\n\n1. **Quiet study time** — 5:00–7:00 PM daily works best for exam prep\n2. **Physics focus** — 20 mins of Physics problems before other subjects\n3. **English essay** — Help him outline tonight (due Jun 16)\n4. **Celebrate wins** — His Chemistry improved by 6 points! Acknowledge this.\n\n📌 AI Study Assistant is also available in Aarav's student portal.",
    };
    if (m.includes("wellbeing") || m.includes("stress") || m.includes("emotional") || m.includes("concern")) return {
      text: "💚 **Aarav's Wellbeing:**\n\nBased on school engagement data:\n• Attendance: Consistent — no concern ✅\n• Homework: 3 pending items — mild pressure period\n• Social: Active in group project with peers ✅\n\n📌 Exam season can be stressful. Encourage breaks, physical activity, and regular meals. The school's Mind·Body·Soul programme is available.",
    };
    return {
      text: "I'm here to help you stay connected with Aarav's school journey. Try asking me to 'contact Dr. Priya about Math exam', 'show upcoming exams', 'check pending homework', or 'show attendance'. I can also send messages to teachers on your behalf!",
    };
  },
  student: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("study plan") || m.includes("prepare") || m.includes("math") || m.includes("exam")) return {
      text: "📖 **Study Plan for Your Upcoming Exams:**\n\n**Today (Jun 22):** Physics mid-term review — Units 1-4\n**Jun 23:** English Grammar + Essay outline\n**Jun 24:** English Quiz — Grammar & Essay writing\n**Jun 25:** Chemistry lab revision — Units 1-3\n**Jun 26:** Chemistry Practical\n\n💡 Dr. Priya tip: focus on timed practice — you struggle under time pressure.\n\nPlan saved to your dashboard!",
      action: "study_plan_created", actionDetail: "Exam Prep Study Plan — Jun 22-26",
    };
    if (m.includes("homework") || m.includes("due") || m.includes("manage")) return {
      text: "📚 **Your Homework This Week:**\n\n🔴 **English Essay** — Due Jun 16 (OVERDUE!) — 25 marks\n🔴 **Physics Lab Report** — Due Jun 18 (OVERDUE!) — 30 marks\n🟡 **CS Python Project** — Due Jun 20 (In Progress) — 50 marks\n\n✅ Math Exercises — Submitted (18/20)\n✅ Chemistry Problems — Submitted (22/25)\n✅ Urdu Reading — Submitted (19/20)\n\n📌 Talk to your teachers about the overdue items today!",
    };
    if (m.includes("grade") || m.includes("mark") || m.includes("score") || m.includes("subject") || m.includes("strongest") || m.includes("attention")) return {
      text: "📊 **Your Current Grades:**\n\n🌟 Urdu: 91/100 — A (+3) — Your best!\n📈 CS: 88/100 — A- (+5)\n📈 English: 87/100 — A- (+2)\n📈 Chemistry: 84/100 — A- (+6 — most improved!)\n📈 Mathematics: 82/100 — B+ (+4)\n⚠️ Physics: 79/100 — B+ (-1, declining!)\n\nRank: 7 in class\n\nFocus on Physics — it's your only declining subject.",
    };
    if (m.includes("physics") || m.includes("problem")) return {
      text: "🔬 **Physics Support Plan:**\n\n**Your weak areas (based on last 3 tests):**\n• Newton's Laws of Motion (scored 65%)\n• Energy and Work calculations (scored 70%)\n• Projectile motion (scored 72%)\n\n**Recommended:**\n1. Khan Academy — Unit 3: Forces (30 min)\n2. Textbook problems P.87-92\n3. Mr. Imran's revision sheet (available on portal)\n\n💡 You understand theory but lose points on calculations. Practice 3 timed problems daily.",
    };
    if (m.includes("project")) return {
      text: "🔬 **Your Active Projects:**\n\n1. **Solar Energy Efficiency** (Physics)\n   Progress: 65% | Due: Jun 25 | Team: Aarav, Fatima, Aryan\n   ⚡ Next step: Write your analysis section\n\n2. **Population Growth Math Model** (Mathematics)\n   Progress: 40% | Due: Jun 30 | Team: Aarav, Noor\n   ⚡ Next step: Collect data for 3 more cities\n\n📌 Solar project needs 35% more work in 3 days. Schedule a team meeting today!",
    };
    if (m.includes("stress") || m.includes("wellbeing") || m.includes("mindful") || m.includes("focus") || m.includes("break") || m.includes("confidence")) return {
      text: "💚 **Mind·Body·Soul Tips for You:**\n\n🧘 **Exam stress?**\n• 5-minute breathing exercise before each exam\n• Study in 25-minute blocks with 5-min breaks (Pomodoro)\n\n💪 **Stay sharp:**\n• 30 mins of physical activity daily improves memory by 20%\n• Sleep 8 hours — your brain consolidates learning overnight\n\n🌟 **You're doing great:** Chemistry +6, CS +5, Urdu staying strong!\n\n📌 You have this. One subject at a time.",
    };
    if (m.includes("attend") || m.includes("streak")) return {
      text: "📅 **Your Attendance:**\n\n✅ Rate: 94.3% — Excellent!\n🔥 Current streak: 12 days in a row\n\nYou're above the class average (93.5%).\n\n📌 Keep the streak going — consistent attendance = better learning outcomes.",
    };
    return {
      text: "I'm your personal AI study assistant! Here's what I can do:\n\n📖 Create custom study plans\n📊 Analyze your grade trends\n📝 Track all your homework\n🔬 Help you understand concepts\n📅 Show exam preparation timelines\n\nTry: 'Create a study plan for exams' or 'What homework is due?'",
    };
  },
};

// ─── Toast ──────────────────────────────────────────────────────────────────────
interface ToastItem { id: number; msg: string; type: "success" | "error" | "info"; }

// ─── Component ──────────────────────────────────────────────────────────────────
export function AIDrawer() {
  const { aiDrawerOpen, toggleAiDrawer } = useUIStore();
  const { activeRole } = useRoleStore();

  const greeting   = roleGreetings[activeRole]   ?? roleGreetings.admin;
  const respond    = roleResponses[activeRole]   ?? roleResponses.admin;
  const roleInfo   = roleConfig[activeRole];
  const suggConfig = roleSuggestions[activeRole] ?? roleSuggestions.admin;

  const [input, setInput]           = useState("");
  const [messages, setMessages]     = useState<AIMessage[]>([
    { id: "1", role: "assistant", content: greeting, timestamp: new Date() },
  ]);
  const [isTyping, setIsTyping]     = useState(false);
  const [toasts, setToasts]         = useState<ToastItem[]>([]);
  const [qqOpen, setQqOpen]         = useState(true);
  const [activeCat, setActiveCat]   = useState<CategoryId>(suggConfig.categories[0]?.id ?? "academics");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const toastId   = useRef(0);

  // Reset on role change
  useEffect(() => {
    setMessages([{ id: "1", role: "assistant", content: roleGreetings[activeRole] ?? roleGreetings.admin, timestamp: new Date() }]);
    setInput("");
    const cats = roleSuggestions[activeRole]?.categories;
    if (cats?.length) setActiveCat(cats[0].id);
  }, [activeRole]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    if (aiDrawerOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [aiDrawerOpen]);

  const addToast = useCallback((msg: string, type: ToastItem["type"] = "info") => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  // ─── Voice ──────────────────────────────────────────────────────────────────
  const { status: voiceStatus, start: startVoice, stop: stopVoice, isSupported: voiceSupported } = useVoiceInput({
    onTranscript: (text) => setInput(text),
    onStart:      () => addToast("Listening… speak now", "info"),
    onEnd:        () => {
      if (input.trim()) addToast("Voice captured — edit or send", "success");
    },
    onError: (err: VoiceError) => {
      if (err === "permission")   addToast("Microphone permission denied", "error");
      else if (err === "no-speech") addToast("No speech detected — try again", "info");
      else if (err === "unsupported") addToast("Voice not supported in this browser", "error");
      else addToast("Voice error — please try again", "error");
    },
  });

  const isListening = voiceStatus === "listening";

  const handleMicClick = () => {
    if (!voiceSupported) {
      addToast("Voice input is not supported in this browser", "error");
      return;
    }
    if (isListening) {
      stopVoice();
    } else {
      setInput("");
      startVoice();
    }
  };

  // ─── Send ────────────────────────────────────────────────────────────────────
  const handleSend = useCallback((text: string = input.trim()) => {
    if (!text) return;
    if (isListening) stopVoice();
    const userMsg: AIMessage = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response = respond(text);
      const assistantMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.text,
        timestamp: new Date(),
        action: response.action ? { type: response.action, detail: response.actionDetail } : undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 900 + Math.random() * 600);
  }, [input, isListening, respond, stopVoice]);

  const renderContent = (text: string) =>
    text.split("\n").map((line, i, arr) => {
      const html = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: html }} />
          {i < arr.length - 1 && <br />}
        </span>
      );
    });

  const activeCategory = suggConfig.categories.find((c) => c.id === activeCat) ?? suggConfig.categories[0];

  if (!aiDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={toggleAiDrawer} />

      <div className="w-[440px] max-w-[95vw] bg-background border-l shadow-2xl flex flex-col h-full">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-violet-600 to-indigo-600 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">Tanweer AI Assistant</p>
              <p className="text-[11px] text-white/75 leading-tight">{roleInfo?.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white text-[10px] border-0 hover:bg-white/30">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
              Online
            </Badge>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20" onClick={toggleAiDrawer}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── In-drawer toasts ─────────────────────────────────────────────── */}
        {toasts.length > 0 && (
          <div className="absolute top-[60px] left-0 right-0 z-10 px-3 space-y-1 pointer-events-none">
            {toasts.map((t) => (
              <div key={t.id} className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium shadow-lg border animate-in slide-in-from-top-2 fade-in duration-200",
                t.type === "success" && "bg-emerald-50 border-emerald-200 text-emerald-700",
                t.type === "error"   && "bg-red-50 border-red-200 text-red-700",
                t.type === "info"    && "bg-blue-50 border-blue-200 text-blue-700",
              )}>
                {t.type === "success" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />}
                {t.type === "error"   && <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />}
                {t.type === "info"    && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />}
                {t.msg}
              </div>
            ))}
          </div>
        )}

        {/* ── Messages ─────────────────────────────────────────────────────── */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              {msg.role === "assistant" && (
                <div className="h-7 w-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4 text-violet-600" />
                </div>
              )}
              <div className={cn("max-w-[85%] space-y-2", msg.role === "user" ? "items-end flex flex-col" : "items-start")}>
                <div className={cn(
                  "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "user" ? "bg-violet-600 text-white rounded-tr-sm" : "bg-muted rounded-tl-sm"
                )}>
                  {renderContent(msg.content)}
                </div>
                {msg.action && (() => {
                  const cfg = actionConfigs[msg.action.type as ActionType];
                  if (!cfg) return null;
                  const Icon = cfg.icon;
                  return (
                    <div className={cn("flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium", cfg.color)}>
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span>{cfg.label}</span>
                      {msg.action.detail && <span className="text-[11px] opacity-70">— {msg.action.detail}</span>}
                    </div>
                  );
                })()}
                <p className="text-[10px] text-muted-foreground px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5">
              <div className="h-7 w-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-violet-600" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Quick Questions panel ────────────────────────────────────────── */}
        <div className="border-t shrink-0">
          {/* Panel header toggle */}
          <button
            onClick={() => setQqOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-violet-500" />
              <span>Quick Questions</span>
              <span className="text-[10px] text-muted-foreground/60">— tap to send instantly</span>
            </div>
            {qqOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>

          {qqOpen && (
            <div className="px-3 pb-3 space-y-2.5">
              {/* Category tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {suggConfig.categories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.iconName] ?? Sparkles;
                  const isActive = cat.id === activeCat;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCat(cat.id)}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap shrink-0 transition-all",
                        isActive
                          ? cat.tabActive
                          : "bg-muted text-muted-foreground hover:bg-muted/70"
                      )}
                    >
                      <Icon className="h-3 w-3 shrink-0" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Chips for active category */}
              {activeCategory && (
                <div className="flex flex-wrap gap-1.5">
                  {activeCategory.questions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      disabled={isTyping}
                      className={cn(
                        "text-[11px] px-2.5 py-1 rounded-full border transition-all leading-snug text-left disabled:opacity-50",
                        activeCategory.chipColor
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Input row ────────────────────────────────────────────────────── */}
        <div className="px-3 py-3 border-t shrink-0">
          {/* Listening indicator */}
          {isListening && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="flex items-end gap-0.5 h-4">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-0.5 rounded-full bg-red-500 animate-bounce"
                    style={{
                      height: `${8 + (i % 2) * 6}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: "0.6s",
                    }}
                  />
                ))}
              </div>
              <span className="text-[11px] text-red-600 font-medium">Listening… speak now</span>
              <span className="text-[10px] text-muted-foreground ml-auto">ESC to stop</span>
            </div>
          )}

          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={isListening ? "Listening…" : "Ask anything about your school…"}
                className={cn(
                  "flex-1 text-sm rounded-xl pr-3 transition-all",
                  isListening && "border-red-300 bg-red-50/50 placeholder:text-red-400"
                )}
                disabled={isTyping}
              />
            </div>

            {/* Mic button */}
            <Button
              size="icon"
              variant="outline"
              onClick={handleMicClick}
              disabled={isTyping}
              title={
                !voiceSupported ? "Voice not supported in this browser" :
                isListening ? "Tap to stop recording" : "Start voice input"
              }
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
              className={cn(
                "rounded-xl shrink-0 h-9 w-9 transition-all",
                isListening
                  ? "bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600 animate-pulse"
                  : !voiceSupported
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:border-violet-400 hover:text-violet-600"
              )}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            {/* Send button */}
            <Button
              size="icon"
              className="bg-violet-600 hover:bg-violet-700 rounded-xl shrink-0 h-9 w-9"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {!voiceSupported && (
            <p className="text-[10px] text-muted-foreground/60 mt-1.5 text-center">
              Voice input requires Chrome or a Chromium-based browser
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
