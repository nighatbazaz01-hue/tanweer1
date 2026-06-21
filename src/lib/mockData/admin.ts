export const adminStats = {
  schoolHealthScore: 87,
  totalStudents: 600,
  totalTeachers: 50,
  totalParents: 600,
  attendanceRate: 94.3,
  feeCollectionRate: 87.5,
  teacherAttendanceRate: 97.1,
  parentSatisfaction: 4.3,
  newLeadsThisMonth: 43,
  enrolledThisMonth: 12,
  atRiskStudents: 23,
  pendingFeeAmount: 267643,
};

export const attendanceTrend = [
  { month: "Jan", present: 96.1, absent: 3.9 },
  { month: "Feb", present: 94.8, absent: 5.2 },
  { month: "Mar", present: 95.3, absent: 4.7 },
  { month: "Apr", present: 93.7, absent: 6.3 },
  { month: "May", present: 94.9, absent: 5.1 },
  { month: "Jun", present: 94.3, absent: 5.7 },
];

export const feeCollectionTrend = [
  { month: "Jan", collected: 1820000, target: 2100000 },
  { month: "Feb", collected: 1950000, target: 2100000 },
  { month: "Mar", collected: 2050000, target: 2100000 },
  { month: "Apr", collected: 1780000, target: 2100000 },
  { month: "May", collected: 1900000, target: 2100000 },
  { month: "Jun", collected: 1873500, target: 2140000 },
];

export const teacherAttendanceTrend = [
  { month: "Jan", rate: 98.2 },
  { month: "Feb", rate: 97.5 },
  { month: "Mar", rate: 96.8 },
  { month: "Apr", rate: 97.9 },
  { month: "May", rate: 98.1 },
  { month: "Jun", rate: 97.1 },
];

export const admissionFunnel = [
  { stage: "Leads", count: 43, color: "#818cf8" },
  { stage: "Contacted", count: 31, color: "#6366f1" },
  { stage: "Interview", count: 18, color: "#4f46e5" },
  { stage: "Enrolled", count: 12, color: "#4338ca" },
];

export const gradeDistribution = [
  { grade: "Grade 1-3", students: 150, color: "#34d399" },
  { grade: "Grade 4-6", students: 150, color: "#60a5fa" },
  { grade: "Grade 7-9", students: 150, color: "#a78bfa" },
  { grade: "Grade 10-12", students: 150, color: "#f59e0b" },
];

export const atRiskStudents = [
  { id: "1", name: "Aryan Koul", grade: "Grade 11-B", risk: "Academic + Fee Default", score: 87, avatar: "AK" },
  { id: "2", name: "Rohan Sheikh", grade: "Grade 8-C", risk: "Low Attendance (71%)", score: 79, avatar: "RS" },
  { id: "3", name: "Sara Wani", grade: "Grade 9-A", risk: "Academic Decline", score: 72, avatar: "SW" },
  { id: "4", name: "Ali Shah", grade: "Grade 12-B", risk: "Fee Default Risk", score: 65, avatar: "AS" },
  { id: "5", name: "Lina Bhat", grade: "Grade 7-A", risk: "Frequent Absences", score: 61, avatar: "LB" },
];

export const parentSatisfactionData = [
  { category: "Communication", score: 4.5 },
  { category: "Teaching Quality", score: 4.4 },
  { category: "Facilities", score: 4.1 },
  { category: "Safety", score: 4.7 },
  { category: "Curriculum", score: 4.2 },
  { category: "Support", score: 4.3 },
];

export const recentAlerts = [
  { id: 1, type: "fee", message: "15 students predicted to default on Q2 fees", severity: "high", time: "2 min ago" },
  { id: 2, type: "attendance", message: "Grade 8-C attendance dropped 8% this week", severity: "medium", time: "25 min ago" },
  { id: 3, type: "academic", message: "23 students flagged for academic underperformance", severity: "medium", time: "1 hr ago" },
  { id: 4, type: "admission", message: "3 new admission leads from Anantnag district", severity: "info", time: "2 hrs ago" },
  { id: 5, type: "positive", message: "Admission conversion rate improved by 12%", severity: "positive", time: "3 hrs ago" },
];
