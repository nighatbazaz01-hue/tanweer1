export type AnnouncementAudience = "school_wide" | "teachers" | "parents" | "students" | "grade_specific" | "department";
export type AnnouncementCategory = "academic" | "event" | "administrative" | "urgent" | "holiday" | "sports" | "achievement";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: { name: string; role: string; avatar: string };
  audience: AnnouncementAudience[];
  gradeFilter?: string[];
  category: AnnouncementCategory;
  isPinned: boolean;
  isScheduled: boolean;
  scheduledFor?: string;
  publishedAt: string;
  expiresAt?: string;
  readCount: number;
  totalAudience: number;
  attachments?: string[];
  tags: string[];
}

export const announcements: Announcement[] = [
  {
    id: "A001",
    title: "📌 End of Term Exam Schedule — All Grades",
    body: "Dear Students, Parents, and Teachers,\n\nThe End of Term 2 examination schedule has been finalized. All exams will take place from June 20 to July 3, 2024.\n\nImportant points:\n• Students must arrive 30 minutes early\n• Mobile phones are strictly prohibited in exam halls\n• Results will be published within 7 working days\n• Parents can view results via the Tanweer Parent Portal\n\nFor the complete schedule per grade, please refer to the attached document.\n\nAcademic Office\nAl-Noor Academy",
    author: { name: "Academic Office", role: "Admin", avatar: "AO" },
    audience: ["school_wide"],
    category: "academic",
    isPinned: true,
    isScheduled: false,
    publishedAt: "Jun 10, 2024",
    expiresAt: "Jul 5, 2024",
    readCount: 1089,
    totalAudience: 1247,
    attachments: ["Exam_Schedule_Term2_AllGrades.pdf"],
    tags: ["exams", "schedule", "urgent"],
  },
  {
    id: "A002",
    title: "🏆 Annual Sports Day — June 28, 2024",
    body: "We are thrilled to announce the Al-Noor Academy Annual Sports Day on June 28, 2024!\n\n📍 Location: School Main Stadium\n🕗 Time: 07:30 AM — 02:00 PM\n\nEvents include:\n• 100m, 200m, 400m sprint\n• Long jump & high jump\n• Team relay races\n• Football & basketball tournaments\n• Swimming (for registered students)\n\nAll students MUST register for at least one event by June 20 via the student portal. Parents are warmly invited to attend!\n\nRefreshments will be provided.\n\nSports Department\nAl-Noor Academy",
    author: { name: "Mr. Faris Al-Shammari", role: "PE Teacher", avatar: "FS" },
    audience: ["school_wide"],
    category: "sports",
    isPinned: true,
    isScheduled: false,
    publishedAt: "Jun 8, 2024",
    expiresAt: "Jun 28, 2024",
    readCount: 987,
    totalAudience: 1247,
    attachments: [],
    tags: ["sports", "event", "mandatory"],
  },
  {
    id: "A003",
    title: "📚 Mid-Term Revision Classes — Grades 10-12",
    body: "To support students in preparing for the upcoming mid-term exams, the school is offering FREE revision classes starting June 17.\n\nSchedule:\n• Mathematics: Mon & Wed, 02:30 PM — 04:00 PM (Room 204)\n• Physics: Tue & Thu, 02:30 PM — 04:00 PM (Lab 2)\n• Chemistry: Mon & Wed, 04:00 PM — 05:30 PM (Lab 1)\n• English: Tue & Thu, 04:00 PM — 05:30 PM (Room 105)\n\nRegistration is optional but strongly encouraged for students scoring below 75%.\n\nAcademic Support Team",
    author: { name: "Ms. Reem Al-Harbi", role: "Vice Principal", avatar: "RA" },
    audience: ["students", "parents"],
    gradeFilter: ["Grade 10", "Grade 11", "Grade 12"],
    category: "academic",
    isPinned: false,
    isScheduled: false,
    publishedAt: "Jun 7, 2024",
    expiresAt: "Jun 20, 2024",
    readCount: 423,
    totalAudience: 659,
    attachments: [],
    tags: ["revision", "exams", "grades 10-12"],
  },
  {
    id: "A004",
    title: "⚠️ Urgent: Updated School Entry Procedure",
    body: "Effective from June 15, 2024, all students must use the NEW biometric entry system at Gate 2.\n\nChanges:\n• Gate 1 is now CLOSED for students (staff only)\n• All students MUST scan ID cards at Gate 2\n• Parents dropping off students must use the dedicated drop-off lane on the western side\n• Unauthorized entry will result in disciplinary action\n\nPlease ensure your child is aware of this change.\n\nThis change is part of our Enhanced Campus Security Initiative.\n\nSchool Administration",
    author: { name: "Dr. Khalid Al-Mansouri", role: "Principal", avatar: "DK" },
    audience: ["school_wide"],
    category: "urgent",
    isPinned: true,
    isScheduled: false,
    publishedAt: "Jun 6, 2024",
    expiresAt: "Jul 1, 2024",
    readCount: 1201,
    totalAudience: 1247,
    attachments: ["Campus_Security_Update.pdf"],
    tags: ["urgent", "security", "mandatory"],
  },
  {
    id: "A005",
    title: "🎓 Teacher Professional Development Day — June 19",
    body: "All teaching staff are required to attend the Professional Development Day on June 19, 2024.\n\n📍 Location: Main Conference Room & Seminar Hall B\n🕗 Time: 08:00 AM — 04:00 PM\n\nSessions include:\n• AI in Education: Using Tanweer AI Assistant effectively (09:00 AM)\n• Differentiated Instruction Strategies (10:30 AM)\n• Data-Driven Teaching with Analytics (01:00 PM)\n• Student Wellbeing & Mental Health Awareness (02:30 PM)\n\nAttendance is mandatory. Lesson plans for June 19 must be submitted by June 17.\n\nHR Department",
    author: { name: "HR Department", role: "Admin", avatar: "HR" },
    audience: ["teachers"],
    category: "administrative",
    isPinned: false,
    isScheduled: false,
    publishedAt: "Jun 5, 2024",
    expiresAt: "Jun 19, 2024",
    readCount: 81,
    totalAudience: 86,
    attachments: ["PD_Day_Schedule_June19.pdf"],
    tags: ["mandatory", "staff", "training"],
  },
  {
    id: "A006",
    title: "💰 Q2 Fee Payment Deadline — June 20",
    body: "Dear Parents,\n\nThis is a reminder that Q2 school fees are due by June 20, 2024.\n\nPayment Methods:\n• Online: Parent Portal → Payments\n• Bank Transfer: Al-Rajhi Bank, IBAN SA12 3456 7890\n• In-Person: Finance Office (Sunday–Thursday, 08:00–15:00)\n\nLate payments will incur a SAR 250 administrative fee after June 20.\n\nIf you are experiencing financial difficulties, please contact the Finance Office to discuss a payment plan.\n\nFinance Department\nAl-Noor Academy",
    author: { name: "Finance Department", role: "Admin", avatar: "FD" },
    audience: ["parents"],
    category: "administrative",
    isPinned: false,
    isScheduled: false,
    publishedAt: "Jun 1, 2024",
    expiresAt: "Jun 21, 2024",
    readCount: 834,
    totalAudience: 1103,
    attachments: ["Q2_Fee_Payment_Guide.pdf"],
    tags: ["fees", "payment", "deadline"],
  },
  {
    id: "A007",
    title: "🌟 Student Achievement Spotlight — May 2024",
    body: "We are proud to celebrate our outstanding students for May 2024!\n\n🥇 Academic Excellence:\n• Fatima Al-Zahrani (Grade 10-A) — 96% average, ranked 1st\n• Hassan Al-Barrak (Grade 11-B) — Perfect score in Arabic\n• Noura Al-Zaid (Grade 9-A) — Best project award in Science\n\n🏅 Sports:\n• Ahmed Al-Rashidi — 1st place, Regional Math Olympiad (nominated)\n• Omar Bin Saleh — Basketball team MVP\n\n🎖 Character Award:\n• Reem Al-Harbi (Grade 12-A) — Community Service Excellence\n\nCongratulations to all our champions!\n\nThe Tanweer Team",
    author: { name: "Dr. Khalid Al-Mansouri", role: "Principal", avatar: "DK" },
    audience: ["school_wide"],
    category: "achievement",
    isPinned: false,
    isScheduled: false,
    publishedAt: "May 30, 2024",
    readCount: 1156,
    totalAudience: 1247,
    attachments: [],
    tags: ["achievement", "recognition", "students"],
  },
  {
    id: "A008",
    title: "🗓️ Ramadan Schedule Changes — Coming Soon",
    body: "In preparation for the Holy Month of Ramadan, the following schedule adjustments will take effect from the first day of Ramadan:\n\n• School hours: 08:00 AM — 12:30 PM\n• Prayer breaks will be extended\n• Cafeteria will remain closed during school hours\n• Exams and assessments will be rescheduled\n\nFull details will be shared one week before Ramadan begins. Parents are requested to update their contact information in the Parent Portal.\n\nSchool Administration",
    author: { name: "School Administration", role: "Admin", avatar: "SA" },
    audience: ["school_wide"],
    category: "administrative",
    isPinned: false,
    isScheduled: true,
    scheduledFor: "Jul 1, 2024",
    publishedAt: "Scheduled",
    readCount: 0,
    totalAudience: 1247,
    attachments: [],
    tags: ["schedule", "ramadan", "upcoming"],
  },
];

export const getAnnouncementsForRole = (role: string) => {
  if (role === "admin") return announcements;
  if (role === "teacher") return announcements.filter((a) =>
    a.audience.includes("school_wide") || a.audience.includes("teachers")
  );
  if (role === "parent") return announcements.filter((a) =>
    a.audience.includes("school_wide") || a.audience.includes("parents")
  );
  if (role === "student") return announcements.filter((a) =>
    a.audience.includes("school_wide") || a.audience.includes("students")
  );
  return announcements;
};
