export type NotifType = "homework" | "attendance" | "fee" | "announcement" | "meeting" | "exam" | "message" | "alert" | "achievement";

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  priority: "urgent" | "high" | "normal";
  link?: string;
  actor?: string;
  roles: string[];
}

export const allNotifications: Notification[] = [
  { id: "N001", type: "alert", title: "⚠️ At-Risk Alert: Omar Al-Ghamdi", body: "AI flagged Omar Al-Ghamdi for combined academic and fee default risk (score: 87%). Immediate parent contact recommended.", timestamp: "2 min ago", isRead: false, priority: "urgent", link: "/students/1", actor: "Tanweer AI", roles: ["admin", "teacher"] },
  { id: "N002", type: "fee", title: "Fee Payment Overdue — 15 Students", body: "15 students are 30+ days overdue on Q2 fees totaling SAR 225,000. Automated reminders have been sent.", timestamp: "18 min ago", isRead: false, priority: "urgent", link: "/fees", actor: "Finance System", roles: ["admin"] },
  { id: "N003", type: "message", title: "New message from Dr. Sarah Al-Hamdan", body: "Re: Ahmed's declining Physics performance — \"I can schedule a meeting this Thursday at 4pm...\"", timestamp: "35 min ago", isRead: false, priority: "high", link: "/messages", actor: "Dr. Sarah Al-Hamdan", roles: ["admin", "parent"] },
  { id: "N004", type: "attendance", title: "Grade 8-C Attendance Alert", body: "Attendance dropped to 78% in Grade 8-C this week — 8% below school average. 7 students with 3+ consecutive absences.", timestamp: "1 hr ago", isRead: false, priority: "high", link: "/attendance", actor: "Attendance System", roles: ["admin", "teacher"] },
  { id: "N005", type: "exam", title: "Exam Results Published: Math Mid-Term", body: "Grade 10-A Math mid-term results are now available. Class average: 80.2%. 5 students below passing threshold.", timestamp: "2 hrs ago", isRead: false, priority: "high", link: "/academics", actor: "Academic Office", roles: ["admin", "teacher", "parent", "student"] },
  { id: "N006", type: "homework", title: "New Homework Assigned", body: "Dr. Sarah Al-Hamdan assigned 'Ch. 5 Exercises: Quadratic Equations' for Grade 10-A. Due: June 15, 2024.", timestamp: "3 hrs ago", isRead: true, priority: "normal", link: "/student-view", actor: "Dr. Sarah Al-Hamdan", roles: ["student", "parent"] },
  { id: "N007", type: "announcement", title: "📢 School Sports Day — June 28", body: "Annual Sports Day scheduled for June 28. All students must register for at least one event by June 20.", timestamp: "5 hrs ago", isRead: true, priority: "normal", link: "/announcements", actor: "School Admin", roles: ["admin", "teacher", "parent", "student"] },
  { id: "N008", type: "meeting", title: "Meeting Invitation: Parent-Teacher Day", body: "You are invited to the Parent-Teacher meeting on June 15, 09:00 AM — Main Conference Room. RSVP required.", timestamp: "Yesterday", isRead: true, priority: "high", link: "/meetings", actor: "Ms. Reem Al-Harbi", roles: ["teacher", "parent"] },
  { id: "N009", type: "achievement", title: "🏆 Ahmed Nominated for Math Olympiad!", body: "Dr. Sarah Al-Hamdan has nominated Ahmed Al-Rashidi for the Regional Math Olympiad on August 15.", timestamp: "Yesterday", isRead: true, priority: "normal", link: "/students/1", actor: "Dr. Sarah Al-Hamdan", roles: ["parent", "student", "admin"] },
  { id: "N010", type: "attendance", title: "Attendance Marked — June 13", body: "Your attendance for June 13 has been marked as Present by Dr. Sarah Al-Hamdan for Mathematics.", timestamp: "Yesterday", isRead: true, priority: "normal", link: "/student-view", actor: "Dr. Sarah Al-Hamdan", roles: ["student"] },
  { id: "N011", type: "homework", title: "Homework Graded — Chemistry Problem Set", body: "Your Chemistry problem set has been graded: 22/25. Dr. Layla Al-Anazi left feedback: 'Excellent work on bonding!'", timestamp: "2 days ago", isRead: true, priority: "normal", link: "/student-view", actor: "Dr. Layla Al-Anazi", roles: ["student", "parent"] },
  { id: "N012", type: "fee", title: "Fee Receipt Confirmed", body: "Payment of SAR 15,000 for Semester 2 has been confirmed. Receipt: RCP-2024-0018.", timestamp: "Jun 8", isRead: true, priority: "normal", link: "/fees", actor: "Finance Office", roles: ["parent"] },
  { id: "N013", type: "announcement", title: "Academic Calendar Updated", body: "The academic calendar has been updated with new mid-term and final exam dates. Please review the changes.", timestamp: "Jun 7", isRead: true, priority: "normal", link: "/announcements", actor: "Academic Office", roles: ["admin", "teacher", "parent", "student"] },
  { id: "N014", type: "exam", title: "Exam Reminder: Math Mid-Term in 7 Days", body: "Reminder: Mathematics mid-term exam on June 20, 08:00 AM, Exam Hall A. Syllabus: Chapters 1-5.", timestamp: "Jun 6", isRead: true, priority: "high", link: "/student-view", actor: "Academic System", roles: ["student", "parent"] },
  { id: "N015", type: "message", title: "Extension Granted — Chemistry Homework", body: "Dr. Layla Al-Anazi granted your extension request. New deadline: June 16. Submit via student portal.", timestamp: "Jun 5", isRead: true, priority: "normal", link: "/messages", actor: "Dr. Layla Al-Anazi", roles: ["student"] },
  { id: "N016", type: "alert", title: "Teacher Performance Alert", body: "Mr. Hassan Al-Shehri has 3 pending lesson plan submissions. Deadline passed 5 days ago.", timestamp: "Jun 5", isRead: true, priority: "high", link: "/tasks", actor: "Academic System", roles: ["admin"] },
  { id: "N017", type: "meeting", title: "Meeting Notes Published", body: "Notes from the June 1 Department Heads meeting are now available. 7 action items assigned.", timestamp: "Jun 2", isRead: true, priority: "normal", link: "/meetings", actor: "Ms. Reem Al-Harbi", roles: ["admin", "teacher"] },
  { id: "N018", type: "achievement", title: "🌟 Class Attendance Record!", body: "Grade 10-A achieved 100% attendance for the week of June 3-7. Congratulations to the class!", timestamp: "Jun 1", isRead: true, priority: "normal", link: "/attendance", actor: "Attendance System", roles: ["teacher", "parent", "student"] },
];

export const getNotificationsForRole = (role: string) =>
  allNotifications.filter((n) => n.roles.includes(role));

export const getUnreadCount = (role: string) =>
  getNotificationsForRole(role).filter((n) => !n.isRead).length;
