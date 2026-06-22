export type MeetingStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type RSVPStatus = "accepted" | "declined" | "pending" | "maybe";

export interface MeetingAttendee {
  name: string;
  role: string;
  avatar: string;
  rsvp: RSVPStatus;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  organizer: { name: string; role: string; avatar: string };
  attendees: MeetingAttendee[];
  date: string;
  time: string;
  endTime: string;
  room: string;
  type: "parent_teacher" | "department" | "staff" | "one_on_one" | "board" | "emergency";
  status: MeetingStatus;
  agenda: string[];
  notes?: string;
  grades?: string[];
  departments?: string[];
  isRecurring?: boolean;
  recurringPattern?: string;
  attachments?: string[];
}

export const meetings: Meeting[] = [
  {
    id: "MTG001",
    title: "Parent-Teacher Meeting — End of Term 2",
    description: "Comprehensive parent-teacher meeting to discuss student performance, exam results, and Q3 plans for all Grade 10-12 students.",
    organizer: { name: "Ms. Neha Gupta", role: "Vice Principal", avatar: "NG" },
    attendees: [
      { name: "Dr. Priya Sharma",  role: "Math Teacher",     avatar: "PS", rsvp: "accepted" },
      { name: "Mr. Imran Khan",    role: "Physics Teacher",  avatar: "IK", rsvp: "accepted" },
      { name: "Dr. Sunita Rao",    role: "Chemistry Teacher", avatar: "SR", rsvp: "accepted" },
      { name: "Ms. Neha Gupta",    role: "English Teacher",  avatar: "NG", rsvp: "accepted" },
      { name: "Mr. Aaqib Wani",    role: "Urdu Teacher",     avatar: "AW", rsvp: "pending" },
      { name: "Arjun Sharma",        role: "Parent (Aarav)", avatar: "AS", rsvp: "accepted" },
    ],
    date: "June 15, 2024",
    time: "09:00 AM",
    endTime: "12:00 PM",
    room: "Main Conference Room",
    type: "parent_teacher",
    status: "upcoming",
    grades: ["Grade 10", "Grade 11", "Grade 12"],
    agenda: [
      "Welcome and introduction (09:00 — 09:15)",
      "Mid-term exam results overview by subject (09:15 — 10:00)",
      "At-risk student intervention plans (10:00 — 10:30)",
      "Break (10:30 — 10:45)",
      "Parent Q&A sessions per teacher (10:45 — 11:30)",
      "Q4 curriculum and activity planning (11:30 — 12:00)",
    ],
    attachments: ["PTM_Agenda_June15.pdf", "Student_Performance_Summary.xlsx"],
    isRecurring: true,
    recurringPattern: "End of each term",
  },
  {
    id: "MTG002",
    title: "Department Heads Weekly Sync",
    description: "Weekly coordination meeting for all department heads to review school operations, upcoming events, and strategic items.",
    organizer: { name: "Dr. Mushtaq Ahmed", role: "Principal", avatar: "MA" },
    attendees: [
      { name: "Ms. Neha Gupta",    role: "Vice Principal", avatar: "NG", rsvp: "accepted" },
      { name: "Dr. Priya Sharma",  role: "Math HOD",       avatar: "PS", rsvp: "accepted" },
      { name: "Mr. Imran Khan",    role: "Science HOD",    avatar: "IK", rsvp: "accepted" },
      { name: "Mr. Aaqib Wani",    role: "Urdu HOD",       avatar: "AW", rsvp: "accepted" },
      { name: "Ms. Sunita Bhat",   role: "Arts HOD",      avatar: "SB", rsvp: "declined" },
    ],
    date: "June 16, 2024",
    time: "07:30 AM",
    endTime: "08:30 AM",
    room: "Principal's Office",
    type: "department",
    status: "upcoming",
    agenda: [
      "Action items from last week's meeting",
      "Mid-term exam logistics review",
      "Sports Day coordination update",
      "Staff professional development day prep",
      "Any other business",
    ],
    isRecurring: true,
    recurringPattern: "Weekly — Every Monday",
    departments: ["Mathematics", "Sciences", "Urdu", "English", "Arts"],
  },
  {
    id: "MTG003",
    title: "At-Risk Student Intervention Meeting",
    description: "Emergency meeting to discuss intervention plans for the 23 students flagged as high-risk by the AI system.",
    organizer: { name: "Ms. Neha Gupta", role: "Vice Principal", avatar: "NG" },
    attendees: [
      { name: "Dr. Mushtaq Ahmed",  role: "Principal",        avatar: "MA", rsvp: "accepted" },
      { name: "Dr. Priya Sharma",   role: "Math Teacher",     avatar: "PS", rsvp: "accepted" },
      { name: "Mr. Imran Khan",     role: "Physics Teacher",  avatar: "IK", rsvp: "accepted" },
      { name: "School Counselor",   role: "Counselor",        avatar: "SC", rsvp: "pending"  },
    ],
    date: "June 14, 2024",
    time: "01:00 PM",
    endTime: "02:30 PM",
    room: "Seminar Room B",
    type: "staff",
    status: "upcoming",
    agenda: [
      "Review AI-flagged at-risk student list",
      "Individual case discussions (top 5 priority cases)",
      "Parent outreach strategy",
      "Academic support assignments",
      "Follow-up schedule",
    ],
    notes: "Confidential — for teaching staff only. Student files will be distributed at the meeting.",
  },
  {
    id: "MTG004",
    title: "One-on-One: Aarav Sharma Physics Support",
    description: "Dedicated session with Aarav and his parent to discuss Physics performance decline and create a recovery plan.",
    organizer: { name: "Mr. Imran Khan", role: "Physics Teacher", avatar: "IK" },
    attendees: [
      { name: "Arjun Sharma",      role: "Parent",       avatar: "AS", rsvp: "accepted" },
      { name: "Aarav Sharma",      role: "Student",      avatar: "AA", rsvp: "accepted" },
      { name: "Dr. Priya Sharma",  role: "Math Teacher", avatar: "PS", rsvp: "accepted" },
    ],
    date: "June 15, 2024",
    time: "04:00 PM",
    endTime: "05:00 PM",
    room: "Room 204",
    type: "one_on_one",
    status: "upcoming",
    agenda: [
      "Review of Physics performance data (last 3 terms)",
      "Identify root causes of decline",
      "Agree on study plan and support structure",
      "Set measurable targets for Q3",
    ],
  },
  {
    id: "MTG005",
    title: "Board of Directors — Q2 Academic Review",
    description: "Quarterly board meeting to review academic performance, financial health, and strategic direction of Foundation School Humhama.",
    organizer: { name: "Dr. Mushtaq Ahmed", role: "Principal", avatar: "MA" },
    attendees: [
      { name: "Board Member 1", role: "Board", avatar: "B1", rsvp: "accepted" },
      { name: "Board Member 2", role: "Board", avatar: "B2", rsvp: "accepted" },
      { name: "Board Member 3", role: "Board", avatar: "B3", rsvp: "pending" },
      { name: "Ms. Neha Gupta",    role: "Vice Principal", avatar: "NG", rsvp: "accepted" },
    ],
    date: "June 20, 2024",
    time: "10:00 AM",
    endTime: "01:00 PM",
    room: "Board Room",
    type: "board",
    status: "upcoming",
    agenda: [
      "Q2 academic performance summary",
      "Financial report — fee collection & budget",
      "Enrollment numbers and admission pipeline",
      "Staff performance and retention",
      "Q3/Q4 strategic initiatives",
      "Infrastructure and technology updates",
    ],
    attachments: ["Q2_Board_Report.pdf", "Financial_Summary_Q2.xlsx"],
  },
  {
    id: "MTG006",
    title: "Math Department Planning Session",
    description: "Q3 curriculum planning and assessment design for the Mathematics department.",
    organizer: { name: "Dr. Priya Sharma", role: "Math HOD", avatar: "PS" },
    attendees: [
      { name: "Mr. Ravi Sharma",   role: "Math Teacher", avatar: "RS", rsvp: "accepted" },
      { name: "Mr. Vikram Singh",  role: "Math Teacher", avatar: "VS", rsvp: "accepted" },
      { name: "Ms. Sunita Bhat",   role: "Math Teacher", avatar: "SB", rsvp: "pending"  },
    ],
    date: "June 17, 2024",
    time: "02:30 PM",
    endTime: "04:00 PM",
    room: "Room 204",
    type: "department",
    status: "upcoming",
    departments: ["Mathematics"],
    agenda: [
      "Review Term 2 exam performance by topic",
      "Identify curriculum gaps",
      "Plan Term 3 topic sequence",
      "Design common assessments",
      "Coordinate Math Olympiad preparation",
    ],
  },
  {
    id: "MTG007",
    title: "Emergency: Grade 8-C Attendance Crisis",
    description: "Urgent meeting called to address the attendance crisis in Grade 8-C and coordinate parent outreach.",
    organizer: { name: "Ms. Neha Gupta", role: "Vice Principal", avatar: "NG" },
    attendees: [
      { name: "Mr. Vikram Singh",   role: "Grade 8-C Teacher", avatar: "VS", rsvp: "accepted" },
      { name: "School Counselor", role: "Counselor", avatar: "SC", rsvp: "accepted" },
      { name: "Admin Office", role: "Admin", avatar: "AO", rsvp: "accepted" },
    ],
    date: "June 5, 2024",
    time: "11:30 AM",
    endTime: "12:30 PM",
    room: "VP Office",
    type: "emergency",
    status: "completed",
    grades: ["Grade 8"],
    agenda: [
      "Review attendance data for Grade 8-C",
      "List of 7 chronic absentees",
      "Parent contact strategy",
      "Counselor follow-up plan",
    ],
    notes: "Action items: 1) All 7 parents contacted by June 6. 2) Counselor to do 1-on-1 check-in with each student. 3) Attendance recovery target: 90%+ by June 20. Follow-up meeting scheduled June 12.",
    attachments: ["Grade8C_Attendance_Report.pdf"],
  },
];

export const getMeetingsForRole = (role: string) => {
  if (role === "admin") return meetings;
  if (role === "teacher") return meetings.filter((m) => m.type !== "board");
  if (role === "parent") return meetings.filter((m) =>
    ["parent_teacher", "one_on_one"].includes(m.type) ||
    m.attendees.some((a) => a.role === "Parent" || a.role.includes("Parent"))
  );
  if (role === "student") return meetings.filter((m) => m.type === "one_on_one");
  return meetings;
};
