"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles, X, Send, Bot, Zap, Mail, ClipboardList,
  Users, FileText, Calendar, CheckSquare, BarChart3,
  Mic, MicOff, ChevronDown, ChevronUp,
  BookOpen, UserCheck, Heart, DollarSign, Building2, TrendingUp,
  Brain, Dumbbell, Star, UserPlus, Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store/useUIStore";
import { useRoleStore, roleConfig } from "@/store/useRoleStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AIMessage } from "@/types";
import { useVoiceInput, type VoiceError } from "@/hooks/useVoiceInput";
import {
  roleMbsChips, MBS_ACTIONS, roleSuggestions,
  type MbsMode, type CategoryId,
} from "@/lib/aiSuggestions";

// ─── Icon maps ──────────────────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  BookOpen, UserCheck, Heart, Users, TrendingUp, DollarSign, Building2, Sparkles,
};
const ACTION_ICONS: Record<string, React.ElementType> = {
  ClipboardList, Calendar, UserPlus, Activity, Heart, Star, Users, BookOpen,
};

// ─── MBS mode config ────────────────────────────────────────────────────────────
interface MbsModeConfig {
  id: MbsMode;
  label: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
  activeCard: string;
  activeText: string;
  chipBg: string;
  tabBar: string;
}

const MBS_MODES: MbsModeConfig[] = [
  {
    id: "mind",
    label: "Mind",
    subtitle: "Academic Growth",
    icon: Brain,
    gradient: "from-blue-500 to-indigo-600",
    activeCard: "bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400",
    activeText: "text-white",
    chipBg: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    tabBar: "bg-blue-600",
  },
  {
    id: "body",
    label: "Body",
    subtitle: "Health & Wellness",
    icon: Dumbbell,
    gradient: "from-emerald-500 to-teal-600",
    activeCard: "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400",
    activeText: "text-white",
    chipBg: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    tabBar: "bg-emerald-600",
  },
  {
    id: "soul",
    label: "Soul",
    subtitle: "Character & Values",
    icon: Heart,
    gradient: "from-rose-500 to-violet-600",
    activeCard: "bg-gradient-to-br from-rose-500 to-violet-600 border-rose-400",
    activeText: "text-white",
    chipBg: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
    tabBar: "bg-rose-500",
  },
];

// ─── MBS structured response engine ────────────────────────────────────────────
function getMbsResponse(role: string, mode: MbsMode, msg: string): string {
  const m = msg.toLowerCase();

  if (mode === "mind") {
    // Admin mind responses
    if (role === "admin") {
      if (m.includes("intervention") || m.includes("academic risk") || m.includes("below expectations") || m.includes("biggest academic")) {
        return `💡 **Insight**\n5 students across Grades 8–12 are currently at academic risk — average performance below 65% or attendance below 82%.\n\n📌 **Why It Matters**\nEarly academic intervention increases recovery likelihood by 3×. Students not supported in Q2 are significantly more likely to disengage permanently.\n\n✅ **Recommended Actions**\n• Create individual intervention plans for each at-risk student\n• Schedule parent meetings within the next 7 days\n• Assign an academic mentor from the teaching staff\n• Review and monitor progress weekly for 4 weeks`;
      }
      if (m.includes("performing") || m.includes("grade") || m.includes("subject") || m.includes("summarize") || m.includes("performance")) {
        return `💡 **Insight**\nSchool-wide academic performance is at 83.1% average this term. Grade 12 leads at 87.4% and Grade 8 shows the lowest at 78.2%.\n\n📌 **Why It Matters**\nGrades 8–9 are a critical transition period. Students who underperform here are less likely to achieve strong results in secondary examinations.\n\n✅ **Recommended Actions**\n• Focus curriculum support resources on Grades 8 and 9\n• Review subject-level performance — Urdu and Physics show most variance\n• Schedule a mid-term academic review with all VPs\n• Introduce peer-tutoring in the two lowest-performing grades`;
      }
      if (m.includes("subject") || m.includes("support")) {
        return `💡 **Insight**\nPhysics (avg 76%) and Urdu (avg 79%) require the most support school-wide. English and Mathematics are performing above target.\n\n📌 **Why It Matters**\nSubject-level gaps left unaddressed compound across years. A student struggling with Physics in Grade 10 will carry that gap into Grade 12 examinations.\n\n✅ **Recommended Actions**\n• Assign additional revision sessions for Physics and Urdu\n• Review teaching methodology with the respective subject teachers\n• Introduce additional practice resources on the student portal\n• Monitor subject performance monthly`;
      }
    }
    // VP mind responses
    if (["vp1", "vp2", "vp3"].includes(role)) {
      const divLabel = role === "vp1" ? "Grades 1–4" : role === "vp2" ? "Grades 5–8" : "Grades 9–12";
      if (m.includes("underperform") || m.includes("concern") || m.includes("additional support") || m.includes("need")) {
        return `💡 **Insight**\n3 classes in ${divLabel} show average performance below 75% this term. Grade ${role === "vp1" ? "4-B" : role === "vp2" ? "7-A" : "11-C"} has the widest performance spread.\n\n📌 **Why It Matters**\nClass-level performance gaps often reflect teaching support needs or student cohort challenges — both are addressable with targeted action.\n\n✅ **Recommended Actions**\n• Visit the underperforming class this week for observation\n• Meet with the class teacher to review support strategies\n• Identify the 3 highest-risk students for individual plans\n• Schedule a progress review in 2 weeks`;
      }
      return `💡 **Insight**\nOverall academic health in ${divLabel} is at 81.4% this term, with 4 students currently flagged for academic support.\n\n📌 **Why It Matters**\nConsistent monitoring at the division level ensures no students slip through the gaps unnoticed.\n\n✅ **Recommended Actions**\n• Review the at-risk list on your VP Dashboard\n• Coordinate with class teachers on support strategies\n• Schedule parent meetings for flagged students\n• Report progress at the next leadership meeting`;
    }
    // Teacher mind responses
    if (role === "teacher") {
      if (m.includes("falling behind") || m.includes("extra support") || m.includes("need")) {
        return `💡 **Insight**\nIn Grade 10-A, 2 students are showing consistent decline — Rohan Sheikh (attendance 71%, performance 58%) and Sara Wani (Physics 62%, declining trend).\n\n📌 **Why It Matters**\nStudents in academic decline without intervention are significantly more likely to disengage before end-of-year examinations.\n\n✅ **Recommended Actions**\n• Schedule 1-on-1 catch-up sessions with both students\n• Contact parents this week to discuss support strategies\n• Provide additional revision materials targeted to their gaps\n• Monitor their performance at every assessment`;
      }
      if (m.includes("engagement") || m.includes("differenti") || m.includes("instruction") || m.includes("improve")) {
        return `💡 **Insight**\nEngagement in your class peaks during interactive activities and drops during extended lecture periods. Average attention window is 18–22 minutes.\n\n📌 **Why It Matters**\nActive learning strategies produce 35% better knowledge retention than passive instruction, particularly for students in the 14–17 age range.\n\n✅ **Recommended Actions**\n• Break lessons into 20-minute blocks with active transitions\n• Use think-pair-share for complex concepts\n• Introduce weekly low-stakes quizzes to maintain engagement\n• Experiment with collaborative problem-solving for Physics`;
      }
      return `💡 **Insight**\nGrade 10-A class average is 83.1%. Your top performers are Fatima Sheikh (96%) and Noor Kaul (91%). 2 students require immediate academic support.\n\n📌 **Why It Matters**\nRegular class-level insights help you make better instructional decisions and ensure every student gets what they need to succeed.\n\n✅ **Recommended Actions**\n• Review individual progress reports for the bottom 3 students\n• Assign differentiated revision tasks this week\n• Contact parents of students in the watch-list\n• Celebrate progress publicly to motivate the class`;
    }
    // Parent mind responses
    if (role === "parent") {
      if (m.includes("support") || m.includes("study habit") || m.includes("academically") || m.includes("home")) {
        return `💡 **Insight**\nAarav's strongest academic time is early evening (5–7 PM) based on when homework is typically completed. His weakest subject is Physics (79%), which needs focused attention.\n\n📌 **Why It Matters**\nParental involvement in study routines increases student achievement by up to 30%. Consistent structure at home is one of the most powerful academic supports.\n\n✅ **Recommended Actions**\n• Establish a fixed 90-minute study block at 5 PM daily\n• Spend 20 minutes daily on Physics problems with Aarav\n• Encourage Aarav to explain concepts back to you — it reinforces learning\n• Review his homework planner each evening together`;
      }
      if (m.includes("subject") || m.includes("attention") || m.includes("improve") || m.includes("exam")) {
        return `💡 **Insight**\nAarav's Physics score has declined by 4 points this term (from 83 to 79). His Chemistry improved most significantly (+6 points).\n\n📌 **Why It Matters**\nCaught early, a Physics decline is very reversible. The pattern suggests a concept gap in mechanics that can be addressed with targeted revision.\n\n✅ **Recommended Actions**\n• Ask Dr. Priya for the Physics revision resource list\n• Encourage Aarav to do 3 timed Physics problems each day\n• Praise his Chemistry improvement to maintain his momentum\n• Schedule a parent-teacher meeting before end-of-term exams`;
      }
      return `💡 **Insight**\nAarav is performing at B+ level (82% overall). He is particularly strong in Urdu and CS. Physics needs the most attention this term.\n\n📌 **Why It Matters**\nEarly parental awareness of subject-level trends helps you and the school support Aarav before a small gap becomes a larger problem.\n\n✅ **Recommended Actions**\n• Review Aarav's full grade report on the platform\n• Reach out to Dr. Priya about Physics support\n• Celebrate his strengths to build motivation\n• Establish a quiet, consistent study environment at home`;
    }
    // Student mind responses
    if (role === "student") {
      if (m.includes("study plan") || m.includes("exam") || m.includes("prepare")) {
        return `💡 **Insight**\nYou have 3 exams in the next 8 days. Physics and Chemistry need the most preparation based on your recent scores.\n\n📌 **Why It Matters**\nA structured study plan reduces exam anxiety and improves performance by ensuring you cover all topics without cramming.\n\n✅ **Recommended Actions**\n• Day 1–2: Physics — Newton's Laws and projectile motion\n• Day 3–4: Chemistry — Lab revision and reaction types\n• Day 5: English quiz preparation — grammar and essay outline\n• Day 6: Past papers and timed practice\n• Day 7: Light review and early rest — no new topics`;
      }
      if (m.includes("improvement") || m.includes("strength") || m.includes("subject") || m.includes("need")) {
        return `💡 **Insight**\nYour strongest subject is Urdu (91%) and Chemistry is your most improved (+6 points). Physics is your only declining subject (-4 points this term).\n\n📌 **Why It Matters**\nUnderstanding your subject profile helps you direct your study energy where it makes the most impact — not spread it too thin.\n\n✅ **Recommended Actions**\n• Spend 25% more revision time on Physics this week\n• Keep your Chemistry momentum — one practice problem daily\n• Identify your specific Physics weak areas (mechanics vs. electricity)\n• Ask Dr. Priya for extra Physics resources`;
      }
      return `💡 **Insight**\nYour overall academic average is 85.2% this term — a B+ level. You are ranked 7th in Grade 10-A.\n\n📌 **Why It Matters**\nTracking your academic progress helps you make smarter study decisions and stay motivated by seeing your own growth.\n\n✅ **Recommended Actions**\n• Check your grade trends weekly on the student portal\n• Focus this week on Physics (your only declining subject)\n• Start the overdue English essay today — it's 25 marks\n• Keep the Chemistry improvement going`;
    }
  }

  if (mode === "body") {
    if (role === "admin") {
      if (m.includes("attendance") || m.includes("concerning") || m.includes("health") || m.includes("wellbeing trend") || m.includes("engagement")) {
        return `💡 **Insight**\nSchool-wide attendance is at 94.3%, but Grades 9–12 show a declining trend (92.4% this month vs 95.1% in September). 23 students have attended fewer than 85% of sessions.\n\n📌 **Why It Matters**\nPoor attendance is the single strongest predictor of academic underperformance. Every day a student misses is a compounding gap in their learning.\n\n✅ **Recommended Actions**\n• Send automated attendance reminders to 23 flagged families this week\n• Investigate transport or health barriers for chronic absentees\n• Implement a "Welcome Back" protocol for students after 2+ absences\n• Review attendance trends monthly at leadership meetings`;
      }
      return `💡 **Insight**\nOverall student engagement is healthy at 87%. However, Grades 8–10 show reduced participation in extracurricular activities compared to last term.\n\n📌 **Why It Matters**\nEngagement beyond the classroom strengthens physical health, social development, and reduces risk of academic disengagement.\n\n✅ **Recommended Actions**\n• Review the extracurricular participation data by grade\n• Introduce new physical activity clubs targeting Grades 8–10\n• Survey students on barriers to participation\n• Promote physical wellbeing through a school-wide health week`;
    }
    if (["vp1", "vp2", "vp3"].includes(role)) {
      const divLabel = role === "vp1" ? "Grades 1–4" : role === "vp2" ? "Grades 5–8" : "Grades 9–12";
      return `💡 **Insight**\nAttendance in ${divLabel} is at ${role === "vp1" ? "96.2%" : role === "vp2" ? "93.6%" : "92.4%"} this month. ${role === "vp3" ? "Exam season stress may be contributing to absences in Grade 12." : "Overall engagement is strong across most classes."}\n\n📌 **Why It Matters**\nPhysical presence in school is the foundation of learning. Students who attend regularly are 2× more likely to meet their academic targets.\n\n✅ **Recommended Actions**\n• Review individual attendance records for students below 85%\n• Contact parents of chronic absentees this week\n• ${role === "vp3" ? "Introduce exam-season wellness check-ins for Grade 12" : "Promote physical activity and health programmes in your division"}\n• Monitor attendance weekly and escalate concerns to admin`;
    }
    if (role === "teacher") {
      if (m.includes("attendance") || m.includes("struggling") || m.includes("absent")) {
        return `💡 **Insight**\nIn Grade 10-A, 1 student (Rohan Sheikh) has attendance at 71% this month — the third absence this week.\n\n📌 **Why It Matters**\nStudents missing more than 15% of school days face significantly increased risk of academic failure and social disengagement.\n\n✅ **Recommended Actions**\n• Contact Rohan's parents today to understand the absence reason\n• Provide Rohan with catch-up materials for missed lessons\n• Flag the case to VP3 if absences continue\n• Assign a peer buddy to help Rohan re-engage when he returns`;
      }
      if (m.includes("energy") || m.includes("participation") || m.includes("healthy") || m.includes("classroom")) {
        return `💡 **Insight**\nClassroom energy is highest in the first 20 minutes and after physical movement. Students in afternoon slots show 18% lower engagement on average.\n\n📌 **Why It Matters**\nPhysical activity and movement directly affect cognitive performance. Even 5 minutes of movement can reset student focus.\n\n✅ **Recommended Actions**\n• Begin each lesson with a 2-minute energiser activity\n• Allow students to stand and stretch at the 20-minute mark\n• Introduce "brain break" movement activities between complex topics\n• Ensure adequate natural light and ventilation in your classroom`;
      }
      return `💡 **Insight**\nYour class attendance is 92.3% this month — above the school average. 1 student requires immediate attention due to frequent absences.\n\n📌 **Why It Matters**\nA classroom where every student feels physically and emotionally present creates the conditions for effective learning.\n\n✅ **Recommended Actions**\n• Check in personally with Rohan on his return\n• Introduce a "wellbeing minute" at the start of each class\n• Encourage students to report if they feel unwell — not to push through\n• Recommend the school's physical wellness programme to engaged students`;
    }
    if (role === "parent") {
      if (m.includes("routine") || m.includes("healthy") || m.includes("sleep") || m.includes("screen") || m.includes("screen-time") || m.includes("physical") || m.includes("exercise")) {
        return `💡 **Insight**\nAdolescents aged 13–17 need 8–9 hours of sleep nightly for optimal cognitive function. Increased screen time before bed is the most common disruptor of this in students Aarav's age.\n\n📌 **Why It Matters**\nSleep directly affects memory consolidation, focus, and emotional regulation — all critical for exam performance and social development.\n\n✅ **Recommended Actions**\n• Set a "screens off" rule 60 minutes before Aarav's bedtime\n• Encourage 30 minutes of physical activity daily (walking, sports, yoga)\n• Ensure breakfast is consistent — it measurably improves morning focus\n• Limit high-sugar foods during study sessions — they cause energy crashes`;
      }
      return `💡 **Insight**\nAarav's school attendance is excellent (94.3%). His physical routine during exam season is the key area to support right now.\n\n📌 **Why It Matters**\nStudents who maintain healthy physical routines during exams perform measurably better than those who sacrifice sleep and exercise for revision.\n\n✅ **Recommended Actions**\n• Protect Aarav's sleep — 8 hours minimum, screens off by 9:30 PM\n• Ensure he eats a proper breakfast each morning\n• Encourage a 20-minute outdoor break between study sessions\n• Praise his attendance consistency — it's a real strength`;
    }
    if (role === "student") {
      if (m.includes("focus") || m.includes("energized") || m.includes("healthy habit") || m.includes("balance") || m.includes("exercise")) {
        return `💡 **Insight**\nStudents who exercise for 30 minutes daily score an average of 15% higher on concentration tests. Physical activity also reduces exam anxiety by triggering natural endorphins.\n\n📌 **Why It Matters**\nYour brain is a physical organ — what you eat, how you sleep, and how you move directly affects how well you can think, remember, and perform.\n\n✅ **Recommended Actions**\n• Exercise for 30 minutes each day — even a brisk walk counts\n• Sleep 8 hours — never sacrifice sleep for last-minute revision\n• Eat a protein-rich breakfast before school (eggs, nuts, yogurt)\n• Use the Pomodoro technique: 25 min study → 5 min movement break\n• Drink water consistently — dehydration reduces focus by up to 20%`;
      }
      return `💡 **Insight**\nYour attendance streak is 12 days — excellent! Maintaining this physical presence in school is one of the strongest things you can do for your learning.\n\n📌 **Why It Matters**\nBeing present — physically, mentally, and emotionally — in class is the foundation of everything else. No revision can fully replace what you absorb in the room.\n\n✅ **Recommended Actions**\n• Keep your morning routine consistent — same wake-up time daily\n• Eat before school — skipping breakfast reduces concentration significantly\n• Take a 10-minute walk during your lunch break\n• Aim for 8 hours of sleep tonight`;
    }
  }

  if (mode === "soul") {
    if (role === "admin") {
      if (m.includes("wellbeing") || m.includes("support") || m.includes("culture") || m.includes("character") || m.includes("holistic") || m.includes("initiative")) {
        return `💡 **Insight**\n8 students have been referred to the school counselor this month. 3 show patterns of social isolation based on participation data. School belonging score is 72% — below the target of 82%.\n\n📌 **Why It Matters**\nStudents who feel they belong at school are 3× more likely to be academically engaged and significantly less likely to experience long-term mental health challenges.\n\n✅ **Recommended Actions**\n• Launch a school-wide character-building initiative this term\n• Introduce structured peer mentoring across Grades 7–10\n• Celebrate student achievements in weekly assemblies\n• Train teachers in recognising early signs of social isolation\n• Review the school's Mind·Body·Soul programme outcomes with the counsellor`;
      }
      if (m.includes("leadership") || m.includes("exceptional")) {
        return `💡 **Insight**\n12 students have been nominated by their teachers for leadership recognition this term. Grade 10 and 11 show the highest concentration of emerging leaders.\n\n📌 **Why It Matters**\nSchools that actively nurture leadership develop graduates who contribute meaningfully to society — a core part of Foundation School Humhama's mission.\n\n✅ **Recommended Actions**\n• Establish a formal Student Leadership Council this term\n• Create a community service programme for Grade 11–12\n• Introduce peer mentoring roles for top-performing senior students\n• Celebrate character achievements alongside academic ones in assemblies`;
      }
      return `💡 **Insight**\nSchool culture indicators show 72% belonging score and 68% student wellbeing score — both below the 80% target for this academic year.\n\n📌 **Why It Matters**\nCulture is the invisible curriculum. A school where students feel valued, safe, and purposeful produces better academic outcomes and graduates of stronger character.\n\n✅ **Recommended Actions**\n• Launch the Mind·Body·Soul programme formally this term\n• Introduce weekly school-wide reflection time (10 minutes per class)\n• Recognise character and service alongside academic achievements\n• Measure belonging and wellbeing scores termly`;
    }
    if (["vp1", "vp2", "vp3"].includes(role)) {
      const divLabel = role === "vp1" ? "Grades 1–4" : role === "vp2" ? "Grades 5–8" : "Grades 9–12";
      return `💡 **Insight**\nIn ${divLabel}, 3 students show patterns suggesting social isolation — reduced participation in group activities over the past 3 weeks.\n\n📌 **Why It Matters**\nSocial belonging in school is a strong protective factor for academic performance and long-term mental health. Early intervention creates the best outcomes.\n\n✅ **Recommended Actions**\n• Meet with class teachers to discuss the 3 flagged students\n• Introduce structured peer group activities in the next 2 weeks\n• ${role === "vp3" ? "Create exam-season wellbeing check-ins for Grade 12 students" : "Introduce a peer buddy system for new or withdrawn students"}\n• Refer to the school counsellor if patterns persist\n• Celebrate small social wins publicly in assemblies`;
    }
    if (role === "teacher") {
      if (m.includes("empathy") || m.includes("wellbeing") || m.includes("confidence") || m.includes("support") || m.includes("activity")) {
        return `💡 **Insight**\nClassrooms with explicit social-emotional learning activities show 23% higher student engagement and significantly fewer behavioural incidents.\n\n📌 **Why It Matters**\nAcademic skills and character skills reinforce each other. A student who feels seen, heard, and valued in your classroom will learn more effectively.\n\n✅ **Recommended Actions**\n• Begin each week with a 5-minute class circle — share one win and one challenge\n• Use cooperative learning tasks to build empathy naturally\n• Acknowledge effort and resilience — not just right answers\n• Create opportunities for every student to lead something small each month\n• Check in privately with quiet or withdrawn students`;
      }
      return `💡 **Insight**\nIn Grade 10-A, 2 students show signs of reduced social engagement over the past 2 weeks. Class morale is generally positive, with strong peer relationships among the majority.\n\n📌 **Why It Matters**\nA classroom where students feel emotionally safe is the precondition for intellectual risk-taking — the kind of thinking that leads to real learning.\n\n✅ **Recommended Actions**\n• Introduce a brief daily connection ritual (question of the day, partner share)\n• Pair the two withdrawn students with confident peers for collaborative tasks\n• Celebrate class achievements as a group weekly\n• Refer to VP or counsellor if withdrawal persists beyond this week`;
    }
    if (role === "parent") {
      if (m.includes("confidence") || m.includes("resilience") || m.includes("emotional") || m.includes("wellbeing") || m.includes("friendship") || m.includes("strengthen")) {
        return `💡 **Insight**\nAdolescent confidence is most strongly shaped by feeling competent, connected, and cared for. Home is the most powerful environment for building this foundation.\n\n📌 **Why It Matters**\nChildren who feel emotionally secure at home are significantly more resilient to academic stress, social challenges, and setbacks — all of which Aarav will face this term.\n\n✅ **Recommended Actions**\n• Have one meaningful conversation with Aarav each day — ask about his day, not just his homework\n• Celebrate effort and improvement, not just results (his Chemistry +6 is worth praising!)\n• Normalise struggle — let him know it is a normal part of learning\n• Encourage one social activity per week outside of school\n• Model calm, balanced responses to challenges yourself`;
      }
      return `💡 **Insight**\nAarav is socially well-integrated at school based on engagement data. He participates in group projects and has positive peer relationships.\n\n📌 **Why It Matters**\nSocial wellbeing and academic wellbeing are deeply connected. A child who feels supported both at home and at school can face challenges with confidence.\n\n✅ **Recommended Actions**\n• Continue the open conversations you have at home — they matter more than you know\n• Ask Aarav about his friendships and what he enjoys about school\n• Encourage him to try a leadership or community service role\n• Support the school's Mind·Body·Soul programme at home`;
    }
    if (role === "student") {
      if (m.includes("confident") || m.includes("confidence") || m.includes("stress") || m.includes("leader") || m.includes("friendship") || m.includes("motivat")) {
        return `💡 **Insight**\nConfidence is built through small, repeated wins — not through a single big achievement. Your Chemistry improvement (+6 points) and attendance streak (12 days) are exactly the kind of wins that build real confidence.\n\n📌 **Why It Matters**\nHow you feel about yourself shapes how you approach challenges. Students with strong self-belief are more likely to persist when things are hard — and that is what produces real results.\n\n✅ **Recommended Actions**\n• Write down one thing you did well each evening — even something small\n• Volunteer to answer in class once per day — it builds courage\n• Connect with one peer this week outside of schoolwork\n• Take on one leadership role in your group project\n• When something feels hard, remind yourself: Chemistry was hard too, and you improved`;
      }
      if (m.includes("stress") || m.includes("manage") || m.includes("anxious") || m.includes("worried")) {
        return `💡 **Insight**\nExam stress is normal and even helpful in small doses. But when it feels overwhelming, it becomes a barrier to the very performance you are trying to improve.\n\n📌 **Why It Matters**\nLearning to manage pressure now will serve you in every exam, job interview, and challenge you face throughout life. This is one of the most important skills you will ever develop.\n\n✅ **Recommended Actions**\n• Try the 4-7-8 breathing technique before exams (inhale 4, hold 7, exhale 8)\n• Study in 25-minute focused blocks — then take a 5-minute break\n• Exercise for 20 minutes when you feel overwhelmed — it resets your brain\n• Avoid all-night revision — sleep consolidates everything you studied\n• Talk to Dr. Priya or the school counsellor if stress feels unmanageable`;
      }
      return `💡 **Insight**\nYou are at a stage of life where your character — how you treat others, how you respond to difficulty, how you contribute — is being shaped daily.\n\n📌 **Why It Matters**\nThe habits of mind and heart you build now will define far more of your future than any single exam result. Foundation School Humhama's philosophy is to grow you as a whole person.\n\n✅ **Recommended Actions**\n• Choose one character quality to focus on this week (e.g. kindness, persistence, gratitude)\n• Do one act of service for someone — a classmate, teacher, or family member\n• Reflect for 5 minutes at the end of each day: What did I contribute today?\n• Seek out a leadership opportunity in a project, club, or classroom activity\n• Remember: your growth is not only academic — it is human`;
    }
  }

  // ── Holistic (combined Mind · Body · Soul) ─────────────────────────────────
  if (mode === "holistic") {
    if (role === "admin") {
      return `🧠💪🌟 **Holistic School Leadership Report**\n\n**🧠 Mind (Academic Health)**\nSchool-wide academic average: 83.1%. Grade 12 leads at 87.4%; Grade 8 needs urgent support (78.2%). 5 students are at immediate academic risk. Physics (76%) and Urdu (79%) require targeted curriculum support.\n\n**💪 Body (Wellness & Attendance)**\nSchool attendance: 94.3%, with a declining trend in Grades 9–12 (92.4% this month vs 95.1% in September). 23 students are below the 85% threshold. Extracurricular participation is down 12% in Grades 8–10.\n\n**🌟 Soul (Character & Culture)**\nBelonging score: 72% (target: 82%). 8 counsellor referrals this month. 3 students showing social isolation patterns. 12 students nominated for leadership recognition.\n\n**⚠️ Priority Risk Students**\n• 5 students: combined academic + wellbeing risk (immediate action required)\n• 12 students: attendance + social concern (monitor weekly)\n• 3 students: fee default + academic pressure (parent outreach needed)\n\n**✅ Board-Level Recommendations**\n• Launch formal Mind·Body·Soul intervention programme this term\n• Prioritise parent meetings for all 23 flagged students within 7 days\n• Introduce weekly wellbeing check-ins across all divisions\n• Schedule cross-divisional VP alignment meeting\n• Establish a Student Leadership Council to address the belonging score gap\n• Celebrate whole-child achievement alongside academic results in next school assembly`;
    }
    if (["vp1", "vp2", "vp3"].includes(role)) {
      const div = role === "vp1" ? "Grades 1–4" : role === "vp2" ? "Grades 5–8" : "Grades 9–12";
      const att = role === "vp1" ? "96.2%" : role === "vp2" ? "93.6%" : "92.4%";
      const avg = role === "vp1" ? "81.4%" : role === "vp2" ? "79.6%" : "84.2%";
      const riskCount = role === "vp3" ? "4 students below 85% threshold" : "2 students require attendance meetings";
      return `🧠💪🌟 **Holistic Division Report — ${div}**\n\n**🧠 Mind (Academic)**\nDivision average: ${avg}. 3 classes are below the 75% threshold. Key at-risk students are flagged on your dashboard. ${role === "vp3" ? "Exam preparation is progressing in Grade 12 but Grade 9–10 needs support." : "Core literacy and numeracy gaps need addressing before year-end."}\n\n**💪 Body (Attendance & Wellness)**\nDivision attendance: ${att}. ${role === "vp3" ? "Exam season is contributing to absences in Grade 12." : "Overall engagement is healthy."} ${riskCount}.\n\n**🌟 Soul (Character & Wellbeing)**\n3 students show signs of social isolation in ${div}. Peer mentoring programme recommended. ${role === "vp3" ? "Exam stress is elevated — counsellor check-ins scheduled for Grade 12." : "Class morale is generally positive."}\n\n**⚠️ Division Risk Summary**\n• Academic: 3 students require immediate intervention\n• Attendance: ${role === "vp1" ? "1 student" : role === "vp2" ? "2 students" : "4 students"} below 85% threshold\n• Wellbeing: 3 students flagged for social support\n\n**✅ Your Action Plan**\n• Meet personally with the 3 most at-risk students this week\n• Contact parents of all attendance-flagged students\n• ${role === "vp3" ? "Introduce exam-season wellness check-ins for Grade 12" : "Launch a peer mentoring pilot in your division"}\n• Report at the next leadership meeting\n• Schedule a divisional teacher briefing on student support strategies`;
    }
    if (role === "teacher") {
      return `🧠💪🌟 **Holistic Class Report — Grade 10-A**\n\n**🧠 Mind (Academic)**\nClass average: 83.1%. Top performer: Fatima Sheikh (96%). 2 students in academic decline — Rohan Sheikh (58%) and Sara Wani (62%). Class average is 3.1% above last term — great momentum.\n\n**💪 Body (Attendance & Energy)**\nClass attendance: 92.3% — above school average. 1 critical absence concern: Rohan Sheikh (71% this month, 3rd absence this week). Classroom energy is strongest in early-morning sessions.\n\n**🌟 Soul (Wellbeing & Character)**\n2 students show reduced social engagement this month. Overall class morale is strong, with positive peer relationships among the majority. 3 students show leadership potential worth nurturing.\n\n**⚠️ Students Requiring Attention**\n🔴 Rohan Sheikh — academic decline + attendance (urgent parent contact)\n🟡 Sara Wani — academic decline in Physics (62%, declining trend)\n🟡 2 students — reduced social engagement (monitor)\n\n**✅ Your Action Plan This Week**\n• Contact Rohan Sheikh's parents today regarding absences\n• Schedule 1-on-1 catch-up sessions with Rohan and Sara\n• Introduce a peer support pairing for socially withdrawn students\n• Celebrate top performers publicly to boost class morale\n• Submit support plan for Rohan to VP3 by Friday`;
    }
    if (role === "parent") {
      return `🧠💪🌟 **Aarav's Holistic Development Report**\n\n**🧠 Mind (Academic)**\nAarav is performing at B+ level (82% overall), ranked 7th in class. Strongest subject: Urdu (91%). Most improved: Chemistry (+6 points this term). Needs attention: Physics (79%, declining −1 point). 1 overdue assignment (English essay — 25 marks at stake).\n\n**💪 Body (Attendance & Wellness)**\nAttendance: 94.3% — excellent, with a current 12-day streak. No health concerns on file. During exam season, ensure consistent sleep (8 hours minimum) and daily exercise.\n\n**🌟 Soul (Character & Wellbeing)**\nAarav is socially well-integrated at school. Good peer relationships and positive participation in group activities. His confidence is growing — especially in subjects where he is succeeding.\n\n**🏡 What You Can Do At Home**\n• Protect Aarav's sleep: 8 hours minimum, screens off by 9:30 PM\n• Review the homework planner together each evening\n• Spend 20 minutes on Physics problems with him weekly\n• Praise his Chemistry improvement — it builds momentum for harder subjects\n• Have one meaningful conversation daily about school life (not just grades)\n• Schedule a parent-teacher meeting with Dr. Priya before end-of-term exams`;
    }
    if (role === "student") {
      return `🧠💪🌟 **Your Holistic Development Summary — Aarav**\n\n**🧠 Mind (Your Academics)**\nOverall: 85.2% (B+) · Rank 7/32 in class\n🌟 Strongest: Urdu (91), CS (88), English (87)\n⚠️ Needs work: Physics (79, declining) — start revision today\n🔴 Urgent: English essay is overdue — 25 marks at stake\n\n**💪 Body (Your Health & Presence)**\nAttendance: 94.3% — excellent! You have a 12-day streak.\nProtect these habits before exams:\n• 8 hours of sleep — every night, no exceptions\n• 30 minutes of movement every day\n• Breakfast before school — always\n\n**🌟 Soul (Your Growth & Character)**\nYou are growing in confidence, especially in Chemistry (+6 this term). Your Urdu achievement shows what focused effort produces. Keep building on these wins.\n\n**🎯 Your Focus This Week**\n1. 🔴 Start the English essay TODAY — 25 marks at stake\n2. 📖 Physics revision: 30 min/day (start with Newton's Laws)\n3. 💪 Exercise 30 min daily — your brain needs movement\n4. 😴 Sleep 8 hours — non-negotiable before exams\n5. 🌟 Write one thing you did well each evening`;
    }
    return `🧠💪🌟 **Holistic School Analysis**\n\nThis report combines Mind (academic), Body (wellness & attendance), and Soul (character & wellbeing) insights.\n\n✅ **Recommended Actions**\n• Review your dashboard for student-specific insights\n• Use the Mind, Body, and Soul tabs for targeted questions\n• Contact the school counsellor for individual student support`;
  }

  // Generic fallback
  const modeLabel = mode === "mind" ? "Academic Growth" : mode === "body" ? "Health & Wellness" : "Character & Wellbeing";
  return `💡 **Insight**\nFoundation School Humhama is committed to developing every student across Mind, Body, and Soul. ${modeLabel} is central to this vision.\n\n📌 **Why It Matters**\nA whole-child approach produces not just academic success, but confident, resilient, compassionate graduates — ready for life beyond school.\n\n✅ **Recommended Actions**\n• Use the quick question chips above for specific insights\n• Navigate to your dashboard for live data\n• Contact the school counsellor for individual student support\n• Ask me anything about your students, class, or school`;
}

// ─── Role greetings ─────────────────────────────────────────────────────────────
const roleGreetings: Record<string, string> = {
  admin:   "Hello, Dr. Mushtaq! I'm your AI Executive Assistant — powered by Foundation School Humhama's Mind · Body · Soul philosophy. Select a pillar below to explore holistic insights, or ask me anything about your school.",
  vp1:     "Hello! I'm your AI Assistant for Grades 1–4. I can surface academic risks, attendance data, and wellbeing insights — all scoped to your division. Select a pillar to begin.",
  vp2:     "Hello! I'm your AI Assistant for Grades 5–8. Ask me about Mind (academics), Body (attendance & health), or Soul (character & wellbeing) — all for your division.",
  vp3:     "Hello! I'm your AI Assistant for Grades 9–12. Select a pillar below — I can show you exam readiness, attendance trends, and student wellbeing insights.",
  teacher: "Hello, Dr. Priya! I'm your AI Teaching Assistant. Explore Mind (class performance), Body (attendance & energy), or Soul (student wellbeing & confidence). What do you need?",
  parent:  "Hello! I'm here to support Aarav's whole development — academically, physically, and personally. Select Mind, Body, or Soul to begin, or ask me anything.",
  student: "Hey Aarav! 👋 I'm your AI Study & Wellbeing Assistant. Select Mind for academics, Body for health & energy, or Soul for confidence and growth. What do you need?",
};

// ─── General AI action types ─────────────────────────────────────────────────────
type SchoolActionType  = "message_sent" | "report_generated" | "alert_sent" | "homework_assigned" | "meeting_scheduled";
type StudyActionType   = "study_plan_created" | "task_created";
type ActionType        = SchoolActionType | StudyActionType;

interface AIAction {
  type: ActionType; label: string; description: string; icon: React.ElementType; color: string;
}
const actionConfigs: Record<ActionType, AIAction> = {
  message_sent:       { type: "message_sent",       label: "Message Sent",       description: "via Tanweer Messaging",    icon: Mail,         color: "bg-blue-100 text-blue-700"     },
  report_generated:   { type: "report_generated",   label: "Report Generated",   description: "Available in downloads",   icon: BarChart3,    color: "bg-violet-100 text-violet-700"  },
  alert_sent:         { type: "alert_sent",          label: "Alert Dispatched",   description: "Notified all recipients",  icon: Zap,          color: "bg-amber-100 text-amber-700"   },
  homework_assigned:  { type: "homework_assigned",   label: "Homework Assigned",  description: "Students notified",        icon: FileText,     color: "bg-emerald-100 text-emerald-700"},
  meeting_scheduled:  { type: "meeting_scheduled",   label: "Meeting Scheduled",  description: "Invites sent",             icon: Calendar,     color: "bg-indigo-100 text-indigo-700"  },
  study_plan_created: { type: "study_plan_created",  label: "Study Plan Created", description: "Saved to your dashboard",  icon: CheckSquare,  color: "bg-emerald-100 text-emerald-700"},
  task_created:       { type: "task_created",        label: "Task Added",         description: "Added to your study board",icon: ClipboardList,color: "bg-amber-100 text-amber-700"   },
};

// ─── General role response engine ──────────────────────────────────────────────
interface AIResponseData { text: string; action?: ActionType; actionDetail?: string; }

const vpResponse = (gradeLabel: string, gradeRange: string, startGrade: number) => (msg: string): AIResponseData => {
  const m = msg.toLowerCase();
  if (m.includes("at-risk") || m.includes("risk") || m.includes("intervention")) return { text: `⚠️ **At-Risk Students — ${gradeLabel}:**\n\nStudents in ${gradeRange} flagged with attendance below 80% or performance tier "at-risk".\n\n📌 Recommended:\n• Schedule parent outreach for high-risk cases\n• Assign mentoring sessions with grade counselor\n• Review attendance patterns weekly` };
  if (m.includes("attendance") || m.includes("summary") || m.includes("compare")) return { text: `📊 **Attendance — ${gradeLabel}:**\n\n${gradeRange}\n• Average: ~${startGrade <= 4 ? "96.2" : startGrade <= 8 ? "93.6" : "92.4"}%\n• All grades tracked daily\n\n📌 Students below 85% flagged automatically.` };
  if (m.includes("report") || m.includes("generate") || m.includes("performance")) return { text: `✅ **Division Report Generated — ${gradeLabel}**\n\n${gradeRange} report includes:\n• Attendance breakdown\n• At-risk student list\n• Teacher coverage\n• Upcoming exams\n\n📊 Report saved and ready for download.`, action: "report_generated", actionDetail: `${gradeLabel}_Performance_Report.pdf` };
  if (m.includes("teacher") || m.includes("support")) return { text: `👨‍🏫 **Teachers in ${gradeLabel}:**\n\nAll teachers for ${gradeRange} are listed on your VP Dashboard.\n\n📌 Navigate to the Teacher Directory to flag concerns or schedule support meetings.` };
  if (m.includes("parent") || m.includes("meeting")) return { text: `📅 **Parent Meetings — ${gradeLabel}:**\n\nStudents with attendance <85% or "at-risk" performance are recommended for parent meetings.\n\n📌 Navigate to Meetings to schedule conferences.`, action: "meeting_scheduled", actionDetail: `Parent Outreach — ${gradeLabel}` };
  return { text: `I can help you manage ${gradeLabel}. Ask me:\n\n• "Who are the at-risk students?"\n• "Show attendance summary"\n• "Generate division performance report"\n• "Which teachers need attention?"\n\nAll data scoped to ${gradeRange}.` };
};

const roleResponses: Record<string, (msg: string) => AIResponseData> = {
  admin: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("health") || m.includes("school summary") || m.includes("board") || m.includes("metric")) return { text: "🏫 **School Health Score: 87/100**\n\n• Attendance: 94.3% ✅\n• Fee Collection: 87.5% ⚠️\n• Teacher Presence: 97.1% ✅\n• Parent Satisfaction: 4.3/5 ✅\n• At-Risk Students: 23 ⚠️\n\nFee collection is the primary area requiring attention." };
    if (m.includes("risk") || m.includes("at-risk") || m.includes("declining")) return { text: "⚠️ **Top 5 At-Risk Students:**\n\n1. Aryan Koul (Grade 11-B) — Academic + Fee Default 🔴\n2. Rohan Sheikh (Grade 8-C) — Attendance 71% 🔴\n3. Sara Wani (Grade 9-A) — Academic Decline 🟡\n4. Ali Shah (Grade 12-B) — Fee Default Risk 🟡\n5. Lina Bhat (Grade 7-A) — Frequent Absences 🟡" };
    if (m.includes("report") || m.includes("generate")) return { text: "✅ **School Performance Report Generated**\n\nIncludes: Q2 attendance, fee breakdown, teacher metrics, at-risk list, admissions funnel.\n\n📊 Report saved and ready for download.", action: "report_generated", actionDetail: "Q2_School_Performance_Report.pdf" };
    if (m.includes("alert") || m.includes("send") || (m.includes("parent") && !m.includes("concern"))) return { text: "📨 **Attendance Alert Dispatched**\n\nSent to: 600 parent accounts\nChannel: Parent Portal + SMS\nExpected reach: 94% within 2 hours.", action: "alert_sent", actionDetail: "Attendance reminder — 600 parents" };
    if (m.includes("fee") || m.includes("collection") || m.includes("financial")) return { text: "💰 **Fee Collection — June 2026**\n\n• Target: ₹21,40,000\n• Collected: ₹18,73,500 (87.5%)\n• Gap: ₹2,66,500\n\nOverdue: 128 students. AI predicts 15 will default.\n\n📌 Send reminders to 43 accounts overdue >30 days." };
    if (m.includes("admission") || m.includes("funnel")) return { text: "📥 **Admissions Funnel — June 2026:**\n\n• Leads: 43 → Contacted: 31 → Interview: 18 → Enrolled: 12\n• Conversion: 28% — above last year (22%)\n\n📌 Follow up with 13 interviewed-not-enrolled candidates." };
    if (m.includes("meeting") || m.includes("schedule")) return { text: "📅 **Meeting Scheduled**\n\nAt-Risk Review Meeting:\n• Jun 25, 2026 at 01:00 PM\n• Seminar Room B\n• Attendees: VP, 4 teachers, counselor", action: "meeting_scheduled", actionDetail: "At-Risk Review — June 25" };
    return { text: "Foundation School Humhama health score: 87/100. Try asking me to 'generate school report', 'send attendance alert', 'show fee collection', or select a Mind·Body·Soul pillar above for holistic insights." };
  },
  vp1: vpResponse("Grades 1–4", "Lower Primary (Grades 1–4)", 1),
  vp2: vpResponse("Grades 5–8", "Upper Primary (Grades 5–8)", 5),
  vp3: vpResponse("Grades 9–12", "Secondary (Grades 9–12)", 9),
  teacher: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("message") && (m.includes("parent") || m.includes("aarav"))) return { text: "📨 **Message Sent to Arjun Sharma**\n\n'Dear Arjun, I wanted to share my concern about Aarav's Physics performance this term. His last 3 scores show a declining trend. I recommend a meeting. Available: Thu 4pm or Fri 2pm.'\n\nSent via: Tanweer Messaging", action: "message_sent", actionDetail: "To: Arjun Sharma (Aarav's parent)" };
    if (m.includes("absent") || m.includes("attendance")) return { text: "📋 **Absent Today (Grade 10-A):**\n\n• Rohan Sheikh — 3rd absence this week ⚠️\n\nParent not contacted yet. Shall I send an automated absence notification?" };
    if (m.includes("summary") || m.includes("class") || m.includes("generate")) return { text: "📊 **Grade 10-A Summary**\n\nAttendance: 92.3% | Homework Submission: 84.6% | Avg: 83.1%\n\nTop: Fatima Sheikh (96%), Noor Kaul (91%)\nNeeds attention: Rohan Sheikh (absent)", action: "report_generated", actionDetail: "Grade 10-A Weekly Summary" };
    if (m.includes("homework") || m.includes("assign")) return { text: "✅ **Homework Assigned**\n\nTitle: 'Exam Revision — Chapters 4 & 5'\nGrade: 10-A | Due: Jun 26 | Points: 20\n\nAll 13 students notified.", action: "homework_assigned", actionDetail: "Revision homework — Grade 10-A" };
    return { text: "I can help with that! Try 'message Aarav's parent about Physics', 'find absent students', 'generate class summary', or 'assign revision homework'. Or select a Mind·Body·Soul pillar above for deeper insights." };
  },
  parent: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("contact") || m.includes("message") || m.includes("priya") || m.includes("teacher")) return { text: "📨 **Message Sent to Dr. Priya Sharma**\n\n'Dear Dr. Priya, I am writing about Aarav's Math mid-term preparation. Could you advise on areas to focus and resources? Thank you.'\n\nDr. Priya typically responds within 4 hours.", action: "message_sent", actionDetail: "To: Dr. Priya Sharma" };
    if (m.includes("attendance") || m.includes("attending")) return { text: "📅 **Aarav's Attendance — June 2026:**\n\n✅ Rate: 94.3% | Streak: 12 days 🔥\nPresent: 16 | Absent: 1 | Late: 1\n\nAbove school average (93.5%). Excellent!" };
    if (m.includes("exam") || m.includes("upcoming")) return { text: "📝 **Aarav's Upcoming Exams:**\n\n• Jun 22 — Physics Mid-Term (30%) — Exam Hall B, 10:00\n• Jun 24 — English Quiz (10%)\n• Jun 26 — Chemistry Practical (15%)\n\n⚠️ Chemistry practical is tomorrow — review lab notes tonight." };
    if (m.includes("homework") || m.includes("pending")) return { text: "📚 **Pending Homework:**\n\n⚠️ English Essay — OVERDUE\n⚠️ Physics Lab Report — OVERDUE\n🔄 CS Python Project — In Progress\n\n✅ Math (18/20) and Chemistry (22/25) submitted." };
    if (m.includes("grade") || m.includes("mark") || m.includes("doing") || m.includes("overall")) return { text: "📊 **Aarav's Academic Summary:**\n\nOverall: B+ | Rank: 7 in class\n\n🌟 Urdu: 91 | CS: 88 | English: 87 | Chemistry: 84 | Math: 82 | ⚠️ Physics: 79 (declining)" };
    return { text: "I'm here to help you stay connected with Aarav's journey. Try 'contact Dr. Priya', 'show upcoming exams', 'check pending homework', or select a Mind·Body·Soul pillar above for holistic insights." };
  },
  student: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("study plan") || m.includes("prepare") || m.includes("exam")) return { text: "📖 **Exam Prep Plan:**\n\n• Today: Physics mid-term review — Units 1-4\n• Jun 23: English grammar + essay outline\n• Jun 24: English Quiz\n• Jun 25: Chemistry lab revision\n• Jun 26: Chemistry Practical\n\n💡 Focus on timed practice — you lose points under time pressure.", action: "study_plan_created", actionDetail: "Exam Prep — Jun 22-26" };
    if (m.includes("homework") || m.includes("due")) return { text: "📚 **This Week's Homework:**\n\n🔴 English Essay — OVERDUE (25 marks)\n🔴 Physics Lab Report — OVERDUE (30 marks)\n🟡 CS Python Project — In Progress (50 marks)\n\n✅ Math (18/20) | Chemistry (22/25) | Urdu (19/20)" };
    if (m.includes("grade") || m.includes("mark") || m.includes("score")) return { text: "📊 **Your Grades:**\n\n🌟 Urdu: 91 | CS: 88 | English: 87 | Chemistry: 84 | Math: 82 | ⚠️ Physics: 79 ↓\n\nRank: 7 | Chemistry most improved (+6)! Focus on Physics." };
    return { text: "I'm your AI Study & Wellbeing Assistant! Try 'create a study plan', 'what homework is due', 'show my grades', or select Mind, Body, or Soul above for personalised support." };
  },
};

// ─── Toast ──────────────────────────────────────────────────────────────────────
interface ToastItem { id: number; msg: string; type: "success" | "error" | "info"; }

// ─── Component ──────────────────────────────────────────────────────────────────
export function AIDrawer() {
  const { aiDrawerOpen, toggleAiDrawer, pendingPrompt, pendingMbsMode, clearPendingPrompt } = useUIStore();
  const { activeRole } = useRoleStore();

  const greeting   = roleGreetings[activeRole]   ?? roleGreetings.admin;
  const respond    = roleResponses[activeRole]   ?? roleResponses.admin;
  const roleInfo   = roleConfig[activeRole];
  const mbsChips   = roleMbsChips[activeRole]   ?? roleMbsChips.admin;
  const suggConfig = roleSuggestions[activeRole] ?? roleSuggestions.admin;

  const [input, setInput]           = useState("");
  const [messages, setMessages]     = useState<AIMessage[]>([
    { id: "1", role: "assistant", content: greeting, timestamp: new Date() },
  ]);
  const [isTyping, setIsTyping]     = useState(false);
  const [toasts, setToasts]         = useState<ToastItem[]>([]);
  const [mbsMode, setMbsMode]       = useState<MbsMode>("mind");
  const [qqOpen, setQqOpen]         = useState(true);
  const [activeCat, setActiveCat]   = useState<CategoryId>(suggConfig.categories[0]?.id ?? "academics");
  // Track which messages were generated by MBS chips → show action panel
  const [mbsMsgMap, setMbsMsgMap]   = useState<Record<string, MbsMode>>({});

  const scrollRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const toastId    = useRef(0);

  useEffect(() => {
    setMessages([{ id: "1", role: "assistant", content: roleGreetings[activeRole] ?? roleGreetings.admin, timestamp: new Date() }]);
    setInput("");
    setMbsMsgMap({});
    const cats = roleSuggestions[activeRole]?.categories;
    if (cats?.length) setActiveCat(cats[0].id);
  }, [activeRole]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    if (aiDrawerOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [aiDrawerOpen]);

  // Auto-send pending prompt injected from MBS/Interventions pages
  useEffect(() => {
    if (aiDrawerOpen && pendingPrompt) {
      const prompt = pendingPrompt;
      const mode = pendingMbsMode;
      clearPendingPrompt();
      setTimeout(() => handleSend(prompt, mode), 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiDrawerOpen, pendingPrompt]);

  const addToast = useCallback((msg: string, type: ToastItem["type"] = "info") => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  // ─── Voice ────────────────────────────────────────────────────────────────────
  const { status: voiceStatus, start: startVoice, stop: stopVoice, isSupported: voiceSupported } = useVoiceInput({
    onTranscript: (text) => setInput(text),
    onStart:      () => addToast("Listening… speak now", "info"),
    onEnd:        () => { /* silence is golden */ },
    onError: (err: VoiceError) => {
      if (err === "permission")     addToast("Microphone permission denied", "error");
      else if (err === "no-speech") addToast("No speech detected — try again", "info");
      else if (err === "unsupported") addToast("Voice not supported in this browser", "error");
      else addToast("Voice error — please try again", "error");
    },
  });
  const isListening = voiceStatus === "listening";

  const handleMicClick = () => {
    if (!voiceSupported) { addToast("Voice input requires Chrome or a Chromium browser", "error"); return; }
    if (isListening) { stopVoice(); } else { setInput(""); startVoice(); }
  };

  // ─── Send ──────────────────────────────────────────────────────────────────────
  const handleSend = useCallback((text: string = input.trim(), fromMbs: MbsMode | null = null) => {
    if (!text) return;
    if (isListening) stopVoice();
    const userMsg: AIMessage = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aId = (Date.now() + 1).toString();
      let content: string;
      let action: AIResponseData["action"];
      let actionDetail: AIResponseData["actionDetail"];

      if (fromMbs) {
        content = getMbsResponse(activeRole, fromMbs, text);
        setMbsMsgMap((prev) => ({ ...prev, [aId]: fromMbs }));
      } else {
        const resp = respond(text);
        content = resp.text;
        action = resp.action;
        actionDetail = resp.actionDetail;
      }

      const assistantMsg: AIMessage = {
        id: aId,
        role: "assistant",
        content,
        timestamp: new Date(),
        action: action ? { type: action, detail: actionDetail } : undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 950 + Math.random() * 550);
  }, [input, isListening, respond, stopVoice, activeRole]);

  // Quick action clicked → generate a confirmation message
  const handleQuickAction = useCallback((label: string, mode: MbsMode) => {
    const confirmations: Record<string, string> = {
      "Create Intervention Plan":  "✅ **Intervention Plan Created**\n\nPlan has been saved to the student profile and assigned to the class teacher for weekly review.",
      "Schedule Parent Meeting":   "📅 **Parent Meeting Scheduled**\n\nInvite sent to parent. Meeting request logged in the school calendar.",
      "Assign Academic Mentor":    "👤 **Academic Mentor Assigned**\n\nMentor assigned from the teaching staff. First session to be scheduled within 3 school days.",
      "Monitor Progress":          "📊 **Progress Monitoring Active**\n\nStudent has been added to the weekly progress tracking list. You'll receive updates every Monday.",
      "Wellbeing Check-In":        "💚 **Wellbeing Check-In Scheduled**\n\nCheck-in logged and assigned to the school counsellor. Student will be seen within 2 school days.",
      "Counsellor Referral":       "💛 **Counsellor Referral Submitted**\n\nReferral sent to the school counsellor. Parent will be informed and a session scheduled.",
      "Teacher Follow-Up":         "📋 **Teacher Follow-Up Assigned**\n\nClass teacher has been notified to check in with the student this week.",
      "Schedule Health Review":    "🏥 **Health Review Scheduled**\n\nHealth review request sent. Student added to the nurse/counsellor review list.",
      "Leadership Opportunity":    "🌟 **Leadership Opportunity Created**\n\nStudent has been nominated for a leadership role. Teacher will follow up with details.",
      "Community Service":         "🤝 **Community Service Activity Assigned**\n\nStudent enrolled in the next community service activity organised by the school.",
      "Peer Mentoring Program":    "👥 **Peer Mentoring Program**\n\nStudent added to the peer mentoring programme. Mentor pairing to be confirmed within the week.",
      "Schedule Counselling":      "💙 **Counselling Session Scheduled**\n\nCounselling appointment booked. Parent will receive confirmation via the parent portal.",
    };
    const text = confirmations[label] ?? `✅ **${label}**\n\nAction has been logged and will be followed up by the relevant school staff.`;
    const aId = Date.now().toString();
    const msg: AIMessage = { id: aId, role: "assistant", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, msg]);
    setMbsMsgMap((prev) => ({ ...prev, [aId]: mode }));
  }, []);

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

  const activeMbsConfig = MBS_MODES.find((m) => m.id === mbsMode) ?? MBS_MODES[0];
  const activeCatConfig = suggConfig.categories.find((c) => c.id === activeCat) ?? suggConfig.categories[0];

  if (!aiDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={toggleAiDrawer} />

      <div className="w-[460px] max-w-[96vw] bg-background border-l shadow-2xl flex flex-col h-full">

        {/* ── Header ──────────────────────────────────────────────────────────── */}
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

        {/* ── Mind • Body • Soul Selector ──────────────────────────────────── */}
        <div className="px-4 pt-3 pb-3 border-b shrink-0 bg-gradient-to-br from-slate-50 to-violet-50/40">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest leading-none">Foundation School Humhama</p>
              <p className="text-[13px] font-semibold text-foreground mt-0.5 leading-none">Mind · Body · Soul</p>
            </div>
            <Badge variant="outline" className="text-[9px] border-violet-200 text-violet-600 bg-violet-50">
              Holistic AI
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MBS_MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = mbsMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setMbsMode(mode.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border-2 transition-all duration-200 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                    isActive
                      ? `${mode.activeCard} shadow-md`
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  )}
                  aria-pressed={isActive}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-500")} />
                  <div>
                    <p className={cn("text-[12px] font-bold leading-none", isActive ? "text-white" : "text-foreground")}>
                      {mode.label}
                    </p>
                    <p className={cn("text-[9px] leading-tight mt-0.5", isActive ? "text-white/80" : "text-muted-foreground")}>
                      {mode.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── In-drawer toasts ─────────────────────────────────────────────── */}
        {toasts.length > 0 && (
          <div className="absolute top-[184px] left-0 right-0 z-20 px-3 space-y-1 pointer-events-none">
            {toasts.map((t) => (
              <div key={t.id} className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium shadow-lg border animate-in slide-in-from-top-2 fade-in duration-200",
                t.type === "success" && "bg-emerald-50 border-emerald-200 text-emerald-700",
                t.type === "error"   && "bg-red-50 border-red-200 text-red-700",
                t.type === "info"    && "bg-blue-50 border-blue-200 text-blue-700",
              )}>
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0",
                  t.type === "success" ? "bg-emerald-500" : t.type === "error" ? "bg-red-500" : "bg-blue-500"
                )} />
                {t.msg}
              </div>
            ))}
          </div>
        )}

        {/* ── Messages ─────────────────────────────────────────────────────── */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => {
            const msgMbsMode = mbsMsgMap[msg.id];
            const mbsActions = msgMbsMode ? MBS_ACTIONS[msgMbsMode] : null;
            return (
              <div key={msg.id} className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                {msg.role === "assistant" && (
                  <div className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    msgMbsMode === "mind" ? "bg-blue-100" :
                    msgMbsMode === "body" ? "bg-emerald-100" :
                    msgMbsMode === "soul" ? "bg-rose-100" : "bg-violet-100"
                  )}>
                    {msgMbsMode === "mind" ? <Brain className="h-4 w-4 text-blue-600" /> :
                     msgMbsMode === "body" ? <Dumbbell className="h-4 w-4 text-emerald-600" /> :
                     msgMbsMode === "soul" ? <Heart className="h-4 w-4 text-rose-600" /> :
                     <Bot className="h-4 w-4 text-violet-600" />}
                  </div>
                )}
                <div className={cn("max-w-[88%] space-y-2", msg.role === "user" ? "items-end flex flex-col" : "items-start")}>
                  <div className={cn(
                    "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user" ? "bg-violet-600 text-white rounded-tr-sm" : "bg-muted rounded-tl-sm"
                  )}>
                    {renderContent(msg.content)}
                  </div>

                  {/* General action badge */}
                  {msg.action && !msgMbsMode && (() => {
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

                  {/* MBS quick actions panel */}
                  {msg.role === "assistant" && mbsActions && mbsActions.length > 0 && (
                    <div className="w-full">
                      <p className="text-[10px] text-muted-foreground font-semibold mb-1.5 uppercase tracking-wide">Quick Actions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mbsActions.map((qa) => {
                          const Icon = ACTION_ICONS[qa.iconName] ?? CheckSquare;
                          return (
                            <button
                              key={qa.label}
                              onClick={() => handleQuickAction(qa.label, msgMbsMode)}
                              className={cn(
                                "flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg border font-medium transition-colors",
                                qa.color
                              )}
                            >
                              <Icon className="h-3 w-3 shrink-0" />
                              {qa.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-muted-foreground px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2.5">
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                mbsMode === "mind" ? "bg-blue-100" : mbsMode === "body" ? "bg-emerald-100" : "bg-rose-100"
              )}>
                {mbsMode === "mind" ? <Brain className="h-4 w-4 text-blue-600" /> :
                 mbsMode === "body" ? <Dumbbell className="h-4 w-4 text-emerald-600" /> :
                 <Heart className="h-4 w-4 text-rose-600" />}
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={cn(
                    "h-1.5 w-1.5 rounded-full animate-bounce",
                    mbsMode === "mind" ? "bg-blue-400" : mbsMode === "body" ? "bg-emerald-400" : "bg-rose-400"
                  )} style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Quick Questions ──────────────────────────────────────────────── */}
        <div className="border-t shrink-0">
          <button
            onClick={() => setQqOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {mbsMode === "mind" ? <Brain className="h-3 w-3 text-blue-500" /> :
               mbsMode === "body" ? <Dumbbell className="h-3 w-3 text-emerald-500" /> :
               <Heart className="h-3 w-3 text-rose-500" />}
              <span>Quick Questions</span>
              <span className="text-[10px] text-muted-foreground/60 font-normal">
                — {activeMbsConfig.label} Mode
              </span>
            </div>
            {qqOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>

          {qqOpen && (
            <div className="px-3 pb-3 space-y-2">
              {/* MBS chip section */}
              <div>
                <p className="text-[10px] text-muted-foreground/70 font-medium mb-1.5 uppercase tracking-wide px-0.5">
                  {activeMbsConfig.label} · {activeMbsConfig.subtitle}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {mbsChips[mbsMode].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q, mbsMode)}
                      disabled={isTyping}
                      className={cn(
                        "text-[11px] px-2.5 py-1 rounded-full border transition-all leading-snug disabled:opacity-50",
                        activeMbsConfig.chipBg
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* General category section (compact, secondary) */}
              <div className="pt-1 border-t">
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none mb-1.5">
                  {suggConfig.categories.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.iconName] ?? Sparkles;
                    const isActive = cat.id === activeCat;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCat(cat.id)}
                        className={cn(
                          "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap shrink-0 transition-all",
                          isActive ? cat.tabActive : "bg-muted text-muted-foreground hover:bg-muted/70"
                        )}
                      >
                        <Icon className="h-3 w-3 shrink-0" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
                {activeCatConfig && (
                  <div className="flex flex-wrap gap-1.5">
                    {activeCatConfig.questions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        disabled={isTyping}
                        className={cn(
                          "text-[11px] px-2.5 py-1 rounded-full border transition-all leading-snug disabled:opacity-50",
                          activeCatConfig.chipColor
                        )}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Input row ────────────────────────────────────────────────────── */}
        <div className="px-3 py-3 border-t shrink-0">
          {isListening && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="flex items-end gap-0.5 h-4">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="w-0.5 rounded-full bg-red-500 animate-bounce"
                    style={{ height: `${8 + (i % 2) * 6}px`, animationDelay: `${i * 0.1}s`, animationDuration: "0.6s" }} />
                ))}
              </div>
              <span className="text-[11px] text-red-600 font-medium">Listening…</span>
              <span className="text-[10px] text-muted-foreground ml-auto">ESC to stop</span>
            </div>
          )}

          <div className="flex gap-2 items-center">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={isListening ? "Listening…" : `Ask about ${activeMbsConfig.label.toLowerCase()} or anything else…`}
              className={cn(
                "flex-1 text-sm rounded-xl transition-all",
                isListening && "border-red-300 bg-red-50/50 placeholder:text-red-400"
              )}
              disabled={isTyping}
            />
            <Button
              size="icon" variant="outline"
              onClick={handleMicClick}
              disabled={isTyping}
              title={!voiceSupported ? "Voice not supported in this browser" : isListening ? "Tap to stop" : "Start voice input"}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
              className={cn(
                "rounded-xl shrink-0 h-9 w-9 transition-all",
                isListening ? "bg-red-500 border-red-500 text-white hover:bg-red-600 animate-pulse" :
                !voiceSupported ? "opacity-40 cursor-not-allowed" :
                "hover:border-violet-400 hover:text-violet-600"
              )}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              className={cn(
                "rounded-xl shrink-0 h-9 w-9 transition-all",
                mbsMode === "mind" ? "bg-blue-600 hover:bg-blue-700" :
                mbsMode === "body" ? "bg-emerald-600 hover:bg-emerald-700" :
                "bg-rose-500 hover:bg-rose-600"
              )}
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {!voiceSupported && (
            <p className="text-[10px] text-muted-foreground/50 mt-1.5 text-center">
              Voice input requires Chrome or a Chromium-based browser
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
