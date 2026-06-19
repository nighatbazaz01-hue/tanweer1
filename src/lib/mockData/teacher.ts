export const teacherProfile = {
  name: "Dr. Sarah Al-Hamdan",
  subject: "Mathematics",
  grade: "Grade 10",
  sections: ["10-A", "10-B", "11-A"],
  employeeId: "TCH-001",
  totalStudents: 94,
};

export const todaysClasses = [
  { id: 1, time: "07:30", subject: "Mathematics", grade: "Grade 10-A", room: "Room 204", students: 12, status: "completed", topic: "Quadratic Equations" },
  { id: 2, time: "09:15", subject: "Mathematics", grade: "Grade 10-B", room: "Room 204", students: 30, status: "ongoing", topic: "Quadratic Equations" },
  { id: 3, time: "11:00", subject: "Advanced Math", grade: "Grade 11-A", room: "Room 301", students: 28, status: "upcoming", topic: "Calculus Introduction" },
  { id: 4, time: "13:30", subject: "Math Club", grade: "Mixed", room: "Room 102", students: 15, status: "upcoming", topic: "Competition Prep" },
];

export const classAttendanceToday = [
  { name: "Ahmed Al-Rashidi",  id: "STU-001", status: "present", grade: "10-A" },
  { name: "Fatima Al-Zahrani", id: "STU-002", status: "present", grade: "10-A" },
  { name: "Omar Al-Ghamdi",    id: "STU-003", status: "absent",  grade: "10-A" },
  { name: "Nora Al-Otaibi",    id: "STU-004", status: "late",    grade: "10-A" },
  { name: "Yusuf Al-Dosari",   id: "STU-005", status: "present", grade: "10-A" },
  { name: "Lina Al-Shamri",    id: "STU-006", status: "present", grade: "10-A" },
  { name: "Hassan Al-Barrak",  id: "STU-007", status: "present", grade: "10-A" },
  { name: "Reem Al-Harbi",     id: "STU-008", status: "present", grade: "10-A" },
  { name: "Salma Al-Qahtani",  id: "STU-009", status: "present", grade: "10-A" },
  { name: "Khalid Al-Mutairi", id: "STU-010", status: "present", grade: "10-A" },
  { name: "Dana Al-Shammari",  id: "STU-011", status: "absent",  grade: "10-A" },
  { name: "Tariq Al-Anazi",    id: "STU-012", status: "present", grade: "10-A" },
];

export const homeworkAssignments = [
  { id: 1, title: "Ch. 5 Exercises: Quadratic Equations", grade: "Grade 10-A", dueDate: "Jun 15", submitted: 10, total: 12, status: "active" },
  { id: 2, title: "Practice Problems: Quadratic Equations", grade: "Grade 10-B", dueDate: "Jun 15", submitted: 22, total: 30, status: "active" },
  { id: 3, title: "Mid-Term Revision Sheet", grade: "Grade 11-A", dueDate: "Jun 18", submitted: 25, total: 28, status: "active" },
  { id: 4, title: "Problem Set 4: Trigonometry", grade: "Grade 10-A", dueDate: "Jun 10", submitted: 12, total: 12, status: "completed" },
];

export const studentPerformance = [
  { month: "Jan", avg: 72, highest: 95, lowest: 45 },
  { month: "Feb", avg: 74, highest: 97, lowest: 48 },
  { month: "Mar", avg: 76, highest: 98, lowest: 52 },
  { month: "Apr", avg: 73, highest: 94, lowest: 44 },
  { month: "May", avg: 78, highest: 99, lowest: 55 },
  { month: "Jun", avg: 80, highest: 100, lowest: 58 },
];

export const gradeDistribution = [
  { grade: "A+ (90-100)", count: 12, color: "#34d399" },
  { grade: "A (80-89)", count: 18, color: "#60a5fa" },
  { grade: "B (70-79)", count: 14, color: "#a78bfa" },
  { grade: "C (60-69)", count: 9, color: "#f59e0b" },
  { grade: "D (50-59)", count: 5, color: "#f87171" },
  { grade: "F (<50)", count: 2, color: "#ef4444" },
];

export const classRiskStudents = [
  { name: "Omar Al-Ghamdi", grade: "10-A", attendance: 71, lastScore: 38, risk: "High", trend: "down" },
  { name: "Lina Al-Shamri", grade: "10-B", attendance: 85, lastScore: 52, risk: "Medium", trend: "stable" },
  { name: "Hassan Al-Barrak", grade: "10-A", attendance: 88, lastScore: 61, risk: "Medium", trend: "up" },
];

export const teacherAttendanceSummary = { present: 58, total: 60, rate: 96.7 };
