export type TaskStatus = "todo" | "in_progress" | "done" | "overdue" | "blocked";
export type TaskPriority = "urgent" | "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedBy: { name: string; role: string; avatar: string };
  assignedTo: { name: string; role: string; avatar: string };
  assignedToId?: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  progress: number;
  createdDate: string;
  linkedTo?: { type: string; label: string };
  completedAt?: string;
  notes?: string;
  comments?: { author: string; body: string; timestamp: string }[];
}

export const tasks: Task[] = [
  {
    id: "TSK001",
    title: "Contact parents of all Grade 8-C chronic absentees",
    description: "Call parents of 7 students with 3+ consecutive absences. Log each call outcome and schedule follow-up if needed.",
    assignedBy: { name: "Ms. Rubina Bhat",  role: "Vice Principal", avatar: "RB" },
    assignedTo:  { name: "Mr. Vikram Singh", role: "Grade 8-C Teacher", avatar: "VS" },
    assignedToId: "TCH-019",
    dueDate: "Jun 14, 2026",
    status: "in_progress",
    priority: "urgent",
    category: "attendance",
    progress: 57,
    createdDate: "Jun 10, 2026",
    linkedTo: { type: "meeting", label: "Emergency: Grade 8-C Attendance Crisis" },
    notes: "4 of 7 parents contacted. 2 scheduled callbacks. 1 number unreachable — trying alternative contact.",
  },
  {
    id: "TSK002",
    title: "Submit lesson plans for Professional Development Day coverage",
    description: "All teachers must submit lesson plans for June 19 (PD Day) substitute teachers by June 17.",
    assignedBy: { name: "Dr. Mushtaq Ahmed", role: "Admin", avatar: "MA" },
    assignedTo:  { name: "Dr. Priya Sharma",  role: "Math Teacher", avatar: "PS" },
    assignedToId: "TCH-003",
    dueDate: "Jun 17, 2026",
    status: "todo",
    priority: "high",
    category: "administrative",
    progress: 0,
    createdDate: "Jun 12, 2026",
    linkedTo: { type: "announcement", label: "Teacher Professional Development Day" },
  },
  {
    id: "TSK003",
    title: "Complete Q2 report cards for Grade 10-A",
    description: "Enter final grades, remarks, and attendance summaries for all 32 students in Grade 10-A.",
    assignedBy: { name: "Mr. Irfan Wani",    role: "Vice Principal", avatar: "IW" },
    assignedTo:  { name: "Dr. Priya Sharma",  role: "Math Teacher",   avatar: "PS" },
    assignedToId: "TCH-003",
    dueDate: "Jun 15, 2026",
    status: "in_progress",
    priority: "high",
    category: "academic",
    progress: 75,
    createdDate: "Jun 10, 2026",
    notes: "24 of 32 complete. 8 remaining — priority: 3 at-risk students.",
  },
  {
    id: "TSK004",
    title: "Review and approve 3 pending teacher expense claims",
    description: "Finance office has flagged 3 teacher expense claims over ₹5,000 for VP approval.",
    assignedBy: { name: "Finance Department", role: "Admin", avatar: "FD" },
    assignedTo:  { name: "Admin Office", role: "Admin", avatar: "AO" },
    dueDate: "Jun 13, 2026",
    status: "overdue",
    priority: "medium",
    category: "finance",
    progress: 0,
    createdDate: "Jun 9, 2026",
    notes: "Claims from: Dr. Sunita (lab supplies, ₹6,200), Mr. Ravi (software license, ₹8,990), Mr. Aaqib (teaching materials, ₹5,430).",
  },
  {
    id: "TSK005",
    title: "Prepare school health score board presentation for June 20 board meeting",
    description: "Create a presentation covering Q2 academic, financial, and operational metrics for the Board of Directors meeting.",
    assignedBy: { name: "Dr. Mushtaq Ahmed", role: "Admin", avatar: "MA" },
    assignedTo:  { name: "Admin Office",    role: "Admin", avatar: "AO" },
    dueDate: "Jun 18, 2026",
    status: "in_progress",
    priority: "high",
    category: "administrative",
    progress: 40,
    createdDate: "Jun 8, 2026",
    linkedTo: { type: "meeting", label: "Board of Directors — Q2 Academic Review" },
  },
  {
    id: "TSK006",
    title: "Nominate Math Olympiad participants — formal submission",
    description: "Complete the official nomination forms for Aarav Sharma, Fatima Sheikh, and Noor Kaul.",
    assignedBy: { name: "Mr. Irfan Wani",   role: "Vice Principal", avatar: "IW" },
    assignedTo:  { name: "Dr. Priya Sharma", role: "Math Teacher",   avatar: "PS" },
    assignedToId: "TCH-003",
    dueDate: "Jun 20, 2026",
    status: "todo",
    priority: "medium",
    category: "academic",
    progress: 0,
    createdDate: "Jun 11, 2026",
    linkedTo: { type: "message", label: "Math Olympiad team nominations" },
  },
  {
    id: "TSK007",
    title: "Follow up on 15 overdue fee accounts",
    description: "Send final payment notices and initiate payment plan discussions for the 15 most overdue accounts.",
    assignedBy: { name: "Finance Department", role: "Admin", avatar: "FD" },
    assignedTo:  { name: "Admin Office", role: "Admin", avatar: "AO" },
    dueDate: "Jun 14, 2026",
    status: "in_progress",
    priority: "urgent",
    category: "finance",
    progress: 33,
    createdDate: "Jun 9, 2026",
    notes: "5 of 15 contacted. 3 agreed to payment plan. 2 unresponsive — escalate to VP.",
  },
  {
    id: "TSK008",
    title: "Update school academic calendar with new exam dates",
    description: "Reflect the revised Q3 exam schedule on the school academic calendar and notify all stakeholders.",
    assignedBy: { name: "Academic Office", role: "Admin", avatar: "AO" },
    assignedTo:  { name: "Admin Office", role: "Admin", avatar: "AO" },
    dueDate: "Jun 12, 2026",
    status: "done",
    priority: "high",
    category: "administrative",
    progress: 100,
    createdDate: "Jun 8, 2026",
    completedAt: "Jun 11, 2026",
  },
  {
    id: "TSK009",
    title: "Arrange Sports Day equipment and venue setup",
    description: "Coordinate with facilities team to set up running tracks, equipment, and refreshment stations for Sports Day.",
    assignedBy: { name: "Ms. Rubina Bhat",   role: "Vice Principal", avatar: "RB" },
    assignedTo:  { name: "Mr. Vikram Singh",  role: "PE Teacher",     avatar: "VS" },
    assignedToId: "TCH-019",
    dueDate: "Jun 27, 2026",
    status: "todo",
    priority: "medium",
    category: "event",
    progress: 0,
    createdDate: "Jun 12, 2026",
    linkedTo: { type: "announcement", label: "Annual Sports Day — June 28" },
  },
  {
    id: "TSK010",
    title: "Submit pending lesson plan submissions — overdue review",
    description: "3 lesson plans overdue (Week 22, 23, 24). Follow up and ensure submission before end of week.",
    assignedBy: { name: "Mr. Irfan Wani",   role: "Vice Principal", avatar: "IW" },
    assignedTo:  { name: "Dr. Priya Sharma", role: "Math Teacher",   avatar: "PS" },
    assignedToId: "TCH-003",
    dueDate: "Jun 10, 2026",
    status: "overdue",
    priority: "high",
    category: "academic",
    progress: 0,
    createdDate: "Jun 7, 2026",
    notes: "2nd reminder sent June 8. No response yet.",
  },
  {
    id: "TSK011",
    title: "Conduct student wellness check-ins — Grade 8-C",
    description: "Individual 15-minute check-ins with 7 at-risk students from Grade 8-C attendance crisis.",
    assignedBy: { name: "Ms. Neha Gupta",       role: "Vice Principal", avatar: "NG" },
    assignedTo:  { name: "School Counselor", role: "Counselor", avatar: "SC" },
    dueDate: "Jun 15, 2026",
    status: "in_progress",
    priority: "high",
    category: "wellbeing",
    progress: 43,
    createdDate: "Jun 10, 2026",
    notes: "3 of 7 check-ins complete. 2 students showed improvement. 1 student flagged for additional support.",
    linkedTo: { type: "meeting", label: "Emergency: Grade 8-C Attendance Crisis" },
  },
  {
    id: "TSK012",
    title: "Generate Q2 school performance report for archive",
    description: "Compile comprehensive Q2 report: attendance, academics, finance, admissions, and teacher performance.",
    assignedBy: { name: "Dr. Mushtaq Ahmed",       role: "Admin", avatar: "MA" },
    assignedTo:  { name: "Academic Office", role: "Admin", avatar: "AO" },
    dueDate: "Jun 30, 2026",
    status: "todo",
    priority: "medium",
    category: "administrative",
    progress: 0,
    createdDate: "Jun 12, 2026",
  },
];

export const getTasksForRole = (role: string) => {
  if (role === "admin") return tasks;
  if (role === "teacher") return tasks.filter((t) => t.assignedTo.name === "Dr. Priya Sharma");
  return tasks;
};
