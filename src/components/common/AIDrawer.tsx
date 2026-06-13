"use client";
import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store/useUIStore";
import { useRoleStore, roleConfig } from "@/store/useRoleStore";
import { cn } from "@/lib/utils";
import type { AIMessage } from "@/types";

const roleGreetings = {
  admin: "Hello, Dr. Khalid! I'm your AI Executive Assistant. I can provide real-time analytics, risk alerts, and strategic insights. What would you like to know about Al-Noor Academy today?",
  teacher: "Hello, Dr. Sarah! I'm your AI Teaching Assistant. I can help with class analytics, student risk analysis, lesson planning, and homework tracking. What do you need?",
  parent: "Hello! I'm the Tanweer Parent Assistant. I can tell you about Ahmed's attendance, marks, upcoming exams, and fee status. How can I help you today?",
  student: "Hey Ahmed! 👋 I'm your AI Study Assistant. I can help you prepare for exams, track your homework, and give you study tips. What do you need help with?",
};

const roleSuggestions = {
  admin: [
    "Show school health summary",
    "Which students are at highest risk?",
    "Fee collection vs. target this month",
    "Admission funnel conversion rate",
  ],
  teacher: [
    "Show Grade 10-A class performance",
    "Which students need attention?",
    "Homework submission rates today",
    "Suggest lesson plan for quadratic equations",
  ],
  parent: [
    "How is Ahmed doing in school?",
    "Show his attendance this month",
    "What exams are coming up?",
    "Are there any fee payments due?",
  ],
  student: [
    "What homework is due this week?",
    "Help me prepare for Math exam",
    "How are my grades looking?",
    "What projects am I working on?",
  ],
};

const roleResponses: Record<string, (msg: string) => string> = {
  admin: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("health") || m.includes("school")) return "🏫 School Health Score: **87/100**\n\n• Attendance: 94.3% ✅\n• Fee Collection: 87.5% ⚠️\n• Teacher Presence: 97.1% ✅\n• Parent Satisfaction: 4.3/5 ✅\n• At-Risk Students: 23 ⚠️\n\nOverall status is GOOD. Fee collection is the primary area requiring attention this week.";
    if (m.includes("risk") || m.includes("student")) return "⚠️ **Top 5 At-Risk Students:**\n\n1. Omar Al-Ghamdi (Grade 11-B) — Academic + Fee Default, Risk: 87%\n2. Rayan Al-Khalidi (Grade 8-C) — Attendance 71%, Risk: 79%\n3. Sara Al-Qahtani (Grade 9-A) — Academic Decline, Risk: 72%\n4. Ali Al-Mansouri (Grade 12-B) — Fee Default Risk, Risk: 65%\n5. Lina Al-Dosari (Grade 7-A) — Frequent Absences, Risk: 61%\n\nRecommend immediate parent outreach for students 1 and 2.";
    if (m.includes("fee") || m.includes("collection")) return "💰 **Fee Collection — June 2024**\n\n• Target: SAR 2,140,000\n• Collected: SAR 1,873,500 (87.5%)\n• Gap: SAR 266,500\n\nOverdue accounts: 128 students\nAI predicts 15 students will default on Q2 fees.\n\n📌 Recommendation: Send automated payment reminders to the 43 accounts overdue >30 days.";
    if (m.includes("admission") || m.includes("funnel")) return "📋 **Admission Funnel — June 2024**\n\n• New Leads: 43\n• Contacted: 31 (72%)\n• Interview Scheduled: 18 (42%)\n• Enrolled: 12 (28%)\n\nConversion Rate: 27.9% ↑12% vs last month\nTarget: 30% — nearly there!\n\n📌 Recommendation: Follow up on 13 leads that were contacted but haven't scheduled an interview.";
    return `I can help you analyze that. Based on school data: Al-Noor Academy is performing well overall with a health score of 87/100. The main areas to watch are fee collection (87.5% vs 90% target) and the 23 at-risk students flagged this week. What specific data would you like to dive into?`;
  },
  teacher: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("performance") || m.includes("class")) return "📊 **Grade 10-A Performance Summary**\n\n• Class Average: 80.2%\n• Top Performer: Fatima Al-Zahrani (96%)\n• Lowest: Omar Al-Ghamdi (38% ⚠️)\n\nGrade Distribution:\n• A (90+): 12 students\n• B (70-89): 18 students\n• C (60-69): 9 students\n• Below 60: 5 students\n\n📌 Omar Al-Ghamdi needs urgent intervention.";
    if (m.includes("risk") || m.includes("attention")) return "⚠️ **Students Needing Attention — Grade 10:**\n\n1. Omar Al-Ghamdi — Attendance 71%, Last Score: 38/100 🔴\n2. Lina Al-Shamri — Attendance 85%, Score decline last 3 tests 🟡\n3. Hassan Al-Barrak — Missed 2 homeworks this week 🟡\n\n📌 Recommendation: Schedule a 1-on-1 with Omar this week and notify his parents.";
    if (m.includes("homework") || m.includes("submission")) return "📝 **Homework Submission — Today:**\n\n• Grade 10-A: 28/32 submitted (87.5%)\n• Grade 10-B: 22/30 submitted (73.3%) ⚠️\n• Grade 11-A: 25/28 submitted (89.3%)\n\nMissing submissions:\n10-A: Omar Al-Ghamdi, Nasser Al-Qahtani, Rana Al-Mutiri, Sara Al-Harbi\n\n📌 Send automated reminder to non-submitters.";
    if (m.includes("lesson") || m.includes("plan")) return "📚 **Suggested Lesson Plan: Quadratic Equations**\n\n**Objective:** Students understand vertex form and real-world applications.\n\n**Structure (45 min):**\n• Warm-up: Quick review quiz — 5 mins\n• Direct instruction: Vertex form derivation — 15 mins\n• Guided practice: 3 worked examples — 10 mins\n• Group activity: Projectile motion problem — 10 mins\n• Exit ticket: 2 quick problems — 5 mins\n\n**Resources:** Khan Academy video, GeoGebra visualization.";
    return `I can analyze class data for you. Today's attendance in Grade 10-A is 28/32 (87.5%). The next class is at 11:00 AM covering Calculus Introduction for Grade 11-A. Would you like a detailed student performance breakdown or homework tracking report?`;
  },
  parent: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("doing") || m.includes("ahmed")) return "👦 **Ahmed Al-Rashidi — Quick Summary**\n\nGrade: 10-A | GPA: 3.4 (B+) | Rank: 7/32\n\n• Attendance: 94.3% ✅ (12-day streak!)\n• Best Subject: Arabic (91/100) 🌟\n• Needs Attention: Physics (79/100, slight decline)\n\nTeacher Note (Dr. Sarah): *\"Ahmed shows excellent analytical thinking. Recommend for Math Olympiad team!\"*\n\n📌 English essay due June 16 — not yet started.";
    if (m.includes("attendance")) return "📅 **Ahmed's Attendance — June 2024**\n\nRate: 94.3% ✅\nPresent: 16 days | Absent: 1 day | Late: 0\n\nMTD Best: December 2023 (100%) 🏆\nCurrent Streak: 12 consecutive days present!\n\nYear-to-date average: 94.8% — above the school average of 93.5%.\n\n✅ Ahmed's attendance is excellent. No concerns.";
    if (m.includes("exam") || m.includes("coming")) return "📝 **Ahmed's Upcoming Exams:**\n\n• **Jun 20** — Mathematics Mid-Term (30% weight) — Room: Exam Hall A\n• **Jun 22** — Physics Mid-Term (30% weight) — Room: Exam Hall B\n• **Jun 24** — English Quiz (10% weight)\n• **Jun 26** — Chemistry Practical (15% weight)\n\n⚠️ Math exam is in 7 days. Recommend he review Chapters 4 & 5 tonight.";
    if (m.includes("fee") || m.includes("payment")) return "💳 **Fee Status for Ahmed Al-Rashidi**\n\n• Semester 1 (2024-25): SAR 15,000 — **PAID** ✅\n• Semester 2 (2023-24): SAR 15,000 — **PAID** ✅\n\nNext Payment Due: October 30, 2024\nAmount: SAR 15,000\n\n✅ All fees are fully paid. No outstanding balance.";
    return `Ahmed is doing well overall! His GPA is 3.4 (B+) and he ranks 7th out of 32 students. Attendance is at 94.3% with a 12-day streak. His strongest subject is Arabic (91/100). Would you like details on his marks, upcoming exams, or teacher feedback?`;
  },
  student: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("homework") || m.includes("due")) return "📚 **Your Homework Due This Week:**\n\n• ⚠️ **English Essay** — Due Jun 16 (NOT STARTED!)\n• ⚠️ **Physics Lab Report** — Due Jun 18 (NOT STARTED!)\n• 🔄 **CS Python Project** — Due Jun 20 (In Progress: 0%)\n• ✅ **Math Exercises** — Submitted (18/20)\n• ✅ **Chemistry Problems** — Submitted (22/25)\n\n📌 Start the English essay tonight — it's 25 marks!";
    if (m.includes("math") || m.includes("exam") || m.includes("prepare")) return "📖 **Math Mid-Term Prep Plan (7 days)**\n\n**What to study:**\n• Chapter 4: Trigonometry (you scored 71% last time)\n• Chapter 5: Quadratic Equations (your strongest!)\n• Chapter 3: Polynomials (review)\n\n**Daily Plan:**\n• Day 1-2: Chapter 4 practice problems\n• Day 3-4: Mixed problem sets\n• Day 5: Past papers\n• Day 6: Review mistakes\n• Day 7: Rest & light revision\n\n💡 Focus on timed practice — Dr. Sarah said you struggle under time pressure.";
    if (m.includes("grade") || m.includes("mark")) return "📊 **Your Current Grades:**\n\n• Arabic: 91/100 — A 🌟 (+3)\n• English: 87/100 — A- (+2)\n• CS: 88/100 — A- (+5)\n• Chemistry: 84/100 — A- (+6 📈)\n• Mathematics: 82/100 — B+ (+4)\n• Physics: 79/100 — B+ (-1 ⚠️)\n\nOverall GPA: 3.4 (B+) | Rank: 7/32\n\n📌 Physics is your only declining subject — review Units 3 & 4.";
    if (m.includes("project")) return "🔬 **Your Active Projects:**\n\n1. **Solar Energy Efficiency** (Physics)\n   Progress: 65% | Due: Jun 25 | Team: Ahmed, Fatima, Omar\n   Next step: Write analysis section\n\n2. **Population Growth Math Model** (Mathematics)\n   Progress: 40% | Due: Jun 30 | Team: Ahmed, Nora\n   Next step: Collect data for 3 more cities\n\n📌 Solar project needs 35% more work in 12 days — schedule a team meeting this weekend!";
    return `Hey Ahmed! Your GPA is 3.4 (B+) and you're ranked 7th in your class. Arabic is your strongest subject at 91/100! You have 3 homework items due this week — the English essay (Jun 16) and Physics lab report (Jun 18) haven't been started yet. Want help with any of them?`;
  },
};

export function AIDrawer() {
  const { aiDrawerOpen, setAiDrawerOpen } = useUIStore();
  const { activeRole } = useRoleStore();
  const cfg = roleConfig[activeRole];

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{
      id: "1",
      role: "assistant",
      content: roleGreetings[activeRole],
      timestamp: new Date(),
    }]);
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
    setTimeout(() => {
      const respFn = roleResponses[activeRole];
      const aiMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: respFn ? respFn(msg) : "Let me look into that for you...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  if (!aiDrawerOpen) return null;
  const suggestions = roleSuggestions[activeRole];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l shadow-2xl flex flex-col z-50">
      <div className={`flex items-center gap-2 p-4 border-b text-white`}
        style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}>
        <Sparkles className="h-5 w-5" />
        <div className="flex-1">
          <p className="font-semibold text-sm">Tanweer AI — {cfg.label}</p>
          <p className="text-xs text-violet-200">Ask me anything about {cfg.description}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setAiDrawerOpen(false)} className="h-8 w-8 text-white hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            {msg.role === "assistant" && (
              <div className="h-7 w-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-1">
                <Bot className="h-4 w-4 text-violet-600" />
              </div>
            )}
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line leading-relaxed",
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

      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-col gap-1.5">
            {suggestions.map((s) => (
              <button key={s} onClick={() => handleSend(s)}
                className="text-xs text-left px-3 py-2 rounded-lg bg-muted hover:bg-accent transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI assistant..." className="h-9 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSend()} />
          <Button size="icon" className="h-9 w-9 shrink-0" onClick={() => handleSend()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
