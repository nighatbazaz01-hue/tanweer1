"use client";
import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";
import type { AIMessage } from "@/types";

const initialMessages: AIMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm the Tanweer AI Assistant. I can help you with attendance reports, student performance insights, fee collection analysis, and more. What would you like to know?",
    timestamp: new Date(),
  },
];

const suggestions = [
  "Show today's attendance summary",
  "List students with overdue fees",
  "What's the admission funnel status?",
  "Students at academic risk",
];

export function AIDrawer() {
  const { aiDrawerOpen, setAiDrawerOpen } = useUIStore();
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const simulateResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    if (msg.includes("attendance")) {
      return "📊 Today's Attendance Summary:\n• Total Students: 1,247\n• Present: 1,175 (94.2%)\n• Absent: 57 (4.6%)\n• Late: 15 (1.2%)\n\nGrade 10-A has the highest attendance at 98%. Grade 8-C needs attention with 89%.";
    }
    if (msg.includes("fee") || msg.includes("overdue")) {
      return "💰 Fee Collection Status:\n• Total Collected: SAR 1,873,500 (87.5%)\n• Pending: SAR 267,643\n• Overdue Students: 128\n\nTop overdue: Omar Al-Ghamdi (SAR 15,000), Rayan Al-Khalidi (SAR 12,000).";
    }
    if (msg.includes("admission")) {
      return "📋 Admission Funnel:\n• New Leads: 43\n• Contacted: 31 (72%)\n• Interview Scheduled: 18\n• Enrolled: 12\n• Conversion Rate: 27.9%\n\nTarget: 30% by end of quarter.";
    }
    if (msg.includes("risk")) {
      return "⚠️ Students at Academic Risk:\n• 23 students flagged for low attendance (<80%)\n• 15 students with failing grades in 2+ subjects\n• 8 students with both risk indicators\n\nRecommendation: Schedule parent-teacher meetings for the 8 high-risk students immediately.";
    }
    return "I understand you're asking about \"" + userMessage + "\". I can provide detailed analysis on attendance, fees, admissions, and academic performance. Could you be more specific about what data you need?";
  };

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: simulateResponse(msg),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  if (!aiDrawerOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l shadow-2xl flex flex-col z-50 animate-in slide-in-from-right">
      <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-violet-600 to-purple-700 text-white">
        <Sparkles className="h-5 w-5" />
        <div className="flex-1">
          <p className="font-semibold text-sm">Tanweer AI Assistant</p>
          <p className="text-xs text-violet-200">Powered by AI Analytics</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAiDrawerOpen(false)}
          className="h-8 w-8 text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
          >
            {msg.role === "assistant" && (
              <div className="h-7 w-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-1">
                <Bot className="h-4 w-4 text-violet-600" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted rounded-tl-sm"
              )}
            >
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
          <p className="text-xs text-muted-foreground mb-2">Quick suggestions:</p>
          <div className="flex flex-col gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-xs text-left px-3 py-2 rounded-lg bg-muted hover:bg-accent transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about students, fees, attendance..."
            className="h-9 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="icon" className="h-9 w-9 shrink-0" onClick={() => handleSend()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
