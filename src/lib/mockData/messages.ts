export type MessagePriority = "urgent" | "high" | "normal" | "low";
export type MessageStatus = "unread" | "read" | "archived";

export interface Message {
  id: string;
  threadId: string;
  from: { name: string; role: string; avatar: string };
  to: { name: string; role: string; avatar: string }[];
  subject: string;
  body: string;
  timestamp: string;
  priority: MessagePriority;
  status: MessageStatus;
  hasAttachment: boolean;
  attachmentName?: string;
  isStarred?: boolean;
}

export interface Thread {
  id: string;
  participants: { name: string; role: string; avatar: string }[];
  subject: string;
  lastMessage: string;
  lastTimestamp: string;
  priority: MessagePriority;
  unreadCount: number;
  messages: Message[];
  isStarred?: boolean;
  isArchived?: boolean;
  label?: string;
}

export const mockThreads: Thread[] = [
  {
    id: "T001",
    subject: "Aarav's declining Physics performance - Action needed",
    participants: [
      { name: "Arjun Sharma",     role: "Parent",            avatar: "AS" },
      { name: "Mr. Imran Khan",   role: "Teacher - Physics", avatar: "IK" },
      { name: "Dr. Priya Sharma", role: "Teacher - Math",    avatar: "PS" },
    ],
    lastMessage: "I can schedule a meeting this Thursday at 4pm if that works for everyone.",
    lastTimestamp: "10:32 AM",
    priority: "high",
    unreadCount: 2,
    isStarred: true,
    label: "academic",
    messages: [
      {
        id: "M001a", threadId: "T001",
        from: { name: "Mr. Imran Khan", role: "Teacher - Physics", avatar: "IK" },
        to: [{ name: "Arjun Sharma",    role: "Parent",            avatar: "AS" }],
        subject: "Aarav's declining Physics performance - Action needed",
        body: "Dear Mr. Arjun,\n\nI hope this message finds you well. I am reaching out regarding Aarav's performance in Physics this term. His last three assessment scores have been 79, 72, and 68 — showing a concerning downward trend.\n\nI believe the primary issues are:\n1. Missing lab sessions (2 out of 5 this term)\n2. Incomplete homework submissions (only 60% submitted)\n3. Difficulty with calculation-based problems under time pressure\n\nI would strongly recommend we schedule a meeting to discuss a plan to support Aarav. I am also happy to provide additional practice materials.\n\nKind regards,\nMr. Imran Khan\nPhysics Department",
        timestamp: "Jun 10, 2024 — 09:15 AM",
        priority: "high",
        status: "read",
        hasAttachment: true,
        attachmentName: "Aarav_Physics_Progress_Report.pdf",
      },
      {
        id: "M001b", threadId: "T001",
        from: { name: "Arjun Sharma",   role: "Parent",            avatar: "AS" },
        to: [{ name: "Mr. Imran Khan", role: "Teacher - Physics",  avatar: "IK" }],
        subject: "Re: Aarav's declining Physics performance - Action needed",
        body: "Dear Mr. Imran,\n\nThank you for bringing this to my attention. I was not aware the situation had become this serious. Aarav has been spending a lot of time on his Urdu and Chemistry projects, which may have caused him to neglect Physics.\n\nI will have a serious conversation with him tonight and ensure he catches up on missed homework. Could you share the practice materials you mentioned?\n\nRegarding a meeting — I am available Tuesday and Thursday afternoons after 3pm.\n\nThank you,\nArjun Sharma",
        timestamp: "Jun 10, 2024 — 11:42 AM",
        priority: "high",
        status: "read",
        hasAttachment: false,
      },
      {
        id: "M001c", threadId: "T001",
        from: { name: "Dr. Priya Sharma",  role: "Teacher - Math", avatar: "PS" },
        to: [{ name: "Arjun Sharma", role: "Parent", avatar: "AS" }, { name: "Mr. Imran Khan", role: "Teacher - Physics", avatar: "IK" }],
        subject: "Re: Ahmed's declining Physics performance - Action needed",
        body: "Dear Arjun and Imran,\n\nI wanted to add that Aarav's Math performance has actually improved significantly this term (+4 points). He is very strong analytically. The Physics issue is likely related to application under timed conditions rather than fundamental understanding.\n\nI can schedule a meeting this Thursday at 4pm if that works for everyone. We can put together a combined study plan.\n\nBest,\nDr. Priya Sharma",
        timestamp: "Jun 13, 2024 — 10:32 AM",
        priority: "high",
        status: "unread",
        hasAttachment: false,
      },
    ],
  },
  {
    id: "T002",
    subject: "Homework submission extension request — Chemistry Project",
    participants: [
      { name: "Aarav Sharma",   role: "Student",             avatar: "AS" },
      { name: "Dr. Sunita Rao", role: "Teacher - Chemistry", avatar: "SR" },
    ],
    lastMessage: "Extension granted until June 16. Please submit via the student portal.",
    lastTimestamp: "Yesterday",
    priority: "normal",
    unreadCount: 1,
    label: "homework",
    messages: [
      {
        id: "M002a", threadId: "T002",
        from: { name: "Aarav Sharma",   role: "Student",             avatar: "AS" },
        to: [{ name: "Dr. Sunita Rao", role: "Teacher - Chemistry", avatar: "SR" }],
        subject: "Homework submission extension request — Chemistry Project",
        body: "Dear Dr. Sunita,\n\nI am writing to request a short extension for the Chemistry problem set due June 14. I have been unwell for the past two days and was unable to complete the assignment to the standard I normally hold myself to.\n\nI have completed approximately 70% of the work and would need just one more day to finish properly.\n\nThank you for your understanding.\nAarav Sharma\nGrade 10-A",
        timestamp: "Jun 12, 2024 — 08:20 PM",
        priority: "normal",
        status: "read",
        hasAttachment: false,
      },
      {
        id: "M002b", threadId: "T002",
        from: { name: "Dr. Sunita Rao", role: "Teacher - Chemistry", avatar: "SR" },
        to: [{ name: "Aarav Sharma",   role: "Student",             avatar: "AS" }],
        subject: "Re: Homework submission extension request — Chemistry Project",
        body: "Dear Aarav,\n\nI hope you are feeling better. Extension granted until June 16. Please submit via the student portal and include a short note explaining which sections you found most challenging.\n\nGet well soon!\nDr. Sunita Rao",
        timestamp: "Jun 13, 2024 — 09:05 AM",
        priority: "normal",
        status: "unread",
        hasAttachment: false,
      },
    ],
  },
  {
    id: "T003",
    subject: "Q3 Exam Schedule Confirmation — Math Department",
    participants: [
      { name: "Dr. Priya Sharma",  role: "Teacher - Math",   avatar: "PS" },
      { name: "Dr. Mushtaq Ahmed", role: "Principal",        avatar: "MA" },
      { name: "Ms. Neha Gupta",    role: "Vice Principal",   avatar: "NG" },
    ],
    lastMessage: "Confirmed. The exam schedule has been uploaded to the academic calendar.",
    lastTimestamp: "Mon",
    priority: "normal",
    unreadCount: 0,
    label: "academic",
    messages: [
      {
        id: "M003a", threadId: "T003",
        from: { name: "Dr. Priya Sharma", role: "Teacher - Math", avatar: "PS" },
        to: [{ name: "Ms. Neha Gupta",   role: "Vice Principal",  avatar: "NG" }],
        subject: "Q3 Exam Schedule Confirmation — Math Department",
        body: "Dear Ms. Neha,\n\nPlease find attached the proposed exam schedule for Q3 Mathematics across all grades.\n\nKey dates:\n• Grade 10-A: June 20, 08:00, Exam Hall A\n• Grade 10-B: June 20, 10:00, Exam Hall B\n• Grade 11-A: June 22, 08:00, Exam Hall A\n\nAll papers have been prepared and are with the admin office. Please confirm if these dates work with the overall school schedule.\n\nRegards,\nDr. Priya Sharma",
        timestamp: "Jun 10, 2024 — 10:00 AM",
        priority: "normal",
        status: "read",
        hasAttachment: true,
        attachmentName: "Q3_Math_Exam_Schedule.xlsx",
      },
      {
        id: "M003b", threadId: "T003",
        from: { name: "Ms. Neha Gupta",    role: "Vice Principal", avatar: "NG" },
        to: [{ name: "Dr. Priya Sharma",  role: "Teacher - Math", avatar: "PS" }, { name: "Dr. Mushtaq Ahmed", role: "Principal", avatar: "MA" }],
        subject: "Re: Q3 Exam Schedule Confirmation — Math Department",
        body: "Dear Dr. Priya,\n\nThank you. I have reviewed the schedule and there are no conflicts with other departments.\n\nConfirmed. The exam schedule has been uploaded to the academic calendar. Parents and students will receive automated notifications today.\n\nMs. Neha Gupta\nVice Principal",
        timestamp: "Jun 11, 2024 — 02:30 PM",
        priority: "normal",
        status: "read",
        hasAttachment: false,
      },
    ],
  },
  {
    id: "T004",
    subject: "URGENT: Fee payment overdue — Final notice",
    participants: [
      { name: "Admin Office",      role: "Admin",  avatar: "AO" },
      { name: "Aryan Koul Parent", role: "Parent", avatar: "AK" },
    ],
    lastMessage: "A payment plan can be arranged. Please contact the finance office at your earliest convenience.",
    lastTimestamp: "Jun 9",
    priority: "urgent",
    unreadCount: 0,
    label: "finance",
    messages: [
      {
        id: "M004a", threadId: "T004",
        from: { name: "Admin Office",      role: "Admin",  avatar: "AO" },
        to: [{ name: "Aryan Koul Parent", role: "Parent", avatar: "AK" }],
        subject: "URGENT: Fee payment overdue — Final notice",
        body: "Dear Parent/Guardian of Aryan Koul,\n\nThis is a final reminder that Semester 2 school fees (₹15,000) have been outstanding for 45 days. Failure to settle or arrange a payment plan within 7 days may result in academic record holds.\n\nA payment plan can be arranged. Please contact the finance office at your earliest convenience.\n\nFinance Office\nFoundation School Humhama",
        timestamp: "Jun 9, 2026 — 09:00 AM",
        priority: "urgent",
        status: "read",
        hasAttachment: true,
        attachmentName: "Fee_Statement_Aryan_Koul.pdf",
      },
    ],
  },
  {
    id: "T005",
    subject: "Parent-Teacher Meeting Agenda — June 15",
    participants: [
      { name: "Ms. Neha Gupta",   role: "Vice Principal",   avatar: "NG" },
      { name: "Dr. Priya Sharma", role: "Teacher - Math",   avatar: "PS" },
      { name: "Mr. Imran Khan",   role: "Teacher - Physics", avatar: "IK" },
    ],
    lastMessage: "I have attached the agenda document. Please review before Saturday.",
    lastTimestamp: "Jun 8",
    priority: "high",
    unreadCount: 0,
    label: "meeting",
    messages: [
      {
        id: "M005a", threadId: "T005",
        from: { name: "Ms. Neha Gupta",   role: "Vice Principal",    avatar: "NG" },
        to: [{ name: "Dr. Priya Sharma", role: "Teacher - Math", avatar: "PS" }, { name: "Mr. Imran Khan", role: "Teacher - Physics", avatar: "IK" }],
        subject: "Parent-Teacher Meeting Agenda — June 15",
        body: "Dear Team,\n\nPlease be advised of the upcoming Parent-Teacher meeting scheduled for June 15, 2026 from 09:00 AM — 12:00 PM in the Main Conference Room.\n\nI have attached the agenda document. Please review before Saturday and come prepared with your student performance summaries.\n\nKey discussion points:\n1. Mid-term exam results overview\n2. At-risk student action plans\n3. Q4 curriculum planning\n4. Extra-curricular activity proposals\n\nMs. Neha Gupta\nVice Principal",
        timestamp: "Jun 8, 2024 — 11:00 AM",
        priority: "high",
        status: "read",
        hasAttachment: true,
        attachmentName: "PTM_June15_Agenda.docx",
      },
    ],
  },
  {
    id: "T006",
    subject: "Math Olympiad team nominations",
    participants: [
      { name: "Dr. Priya Sharma",  role: "Teacher - Math", avatar: "PS" },
      { name: "Dr. Mushtaq Ahmed", role: "Principal",      avatar: "MA" },
    ],
    lastMessage: "Excellent choices. Please submit the formal nomination forms by June 20.",
    lastTimestamp: "Jun 7",
    priority: "normal",
    unreadCount: 0,
    label: "academic",
    messages: [
      {
        id: "M006a", threadId: "T006",
        from: { name: "Dr. Priya Sharma",  role: "Teacher - Math", avatar: "PS" },
        to: [{ name: "Dr. Mushtaq Ahmed", role: "Principal",       avatar: "MA" }],
        subject: "Math Olympiad team nominations",
        body: "Dear Dr. Mushtaq,\n\nI would like to formally nominate the following students for the Regional Math Olympiad:\n\n1. Aarav Sharma (Grade 10-A) — 82/100, strong analytical skills\n2. Fatima Sheikh (Grade 10-A) — 96/100, exceptional problem solver\n3. Noor Kaul (Grade 10-B) — 91/100, consistent performer\n\nAll three have been briefed and are enthusiastic. Competition date: August 15, 2026.\n\nDr. Priya Sharma",
        timestamp: "Jun 7, 2024 — 03:20 PM",
        priority: "normal",
        status: "read",
        hasAttachment: false,
      },
      {
        id: "M006b", threadId: "T006",
        from: { name: "Dr. Mushtaq Ahmed", role: "Principal",      avatar: "MA" },
        to: [{ name: "Dr. Priya Sharma",   role: "Teacher - Math", avatar: "PS" }],
        subject: "Re: Math Olympiad team nominations",
        body: "Excellent choices, Dr. Priya. Please submit the formal nomination forms by June 20. The school will cover all competition fees and transportation.\n\nDr. Mushtaq Ahmed\nPrincipal",
        timestamp: "Jun 7, 2024 — 05:45 PM",
        priority: "normal",
        status: "read",
        hasAttachment: false,
      },
    ],
  },
  {
    id: "T007",
    subject: "Grade 8-C attendance crisis — intervention needed",
    participants: [
      { name: "Ms. Neha Gupta",   role: "Vice Principal", avatar: "NG" },
      { name: "Mr. Vikram Singh", role: "Teacher - PE",   avatar: "VS" },
      { name: "Admin Office",     role: "Admin",          avatar: "AO" },
    ],
    lastMessage: "Parent calls have been logged for all 7 students. Follow-up in 48 hours.",
    lastTimestamp: "Jun 5",
    priority: "urgent",
    unreadCount: 0,
    label: "attendance",
    messages: [
      {
        id: "M007a", threadId: "T007",
        from: { name: "Ms. Neha Gupta",   role: "Vice Principal", avatar: "NG" },
        to: [{ name: "Mr. Vikram Singh", role: "Teacher - PE",   avatar: "VS" }, { name: "Admin Office", role: "Admin", avatar: "AO" }],
        subject: "Grade 8-C attendance crisis — intervention needed",
        body: "Team,\n\nGrade 8-C attendance has dropped to 78% this week — 8% below school average. I need immediate parent contact for the 7 students with 3+ consecutive absences.\n\nPlease coordinate:\n• Admin: Pull parent contact list for Grade 8-C absentees\n• Mr. Vikram: Prepare attendance report with absence reasons\n• I will initiate parent calls this afternoon\n\nParent calls have been logged for all 7 students. Follow-up in 48 hours.\n\nMs. Neha",
        timestamp: "Jun 5, 2024 — 10:00 AM",
        priority: "urgent",
        status: "read",
        hasAttachment: false,
      },
    ],
  },
];

export const mockInboxStats = {
  total: 1024,
  unread: 12,
  starred: 8,
  archived: 145,
  sent: 87,
};

export const getRoleThreads = (role: string) => {
  if (role === "admin") return mockThreads;
  if (role === "teacher") return mockThreads.filter((t) => t.id !== "T004");
  if (role === "parent") return mockThreads.filter((t) => ["T001", "T002", "T004"].includes(t.id));
  if (role === "student") return mockThreads.filter((t) => t.id === "T002");
  return mockThreads;
};
