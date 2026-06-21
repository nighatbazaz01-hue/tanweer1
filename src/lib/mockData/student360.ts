export const student360 = {
  id: "1",
  name: "Aarav Sharma",
  studentId: "STU-2024-001",
  grade: "Grade 10-A",
  section: "A",
  rollNumber: 7,
  age: 15,
  dob: "March 15, 2009",
  gender: "Male",
  bloodGroup: "O+",
  photo: "AS",
  address: "House 12, Humhama Road, Srinagar",
  phone: "+91 94191 23456",
  email: "aarav.student@school.edu",
  parentName: "Arjun Sharma",
  parentPhone: "+91 94192 76543",
  parentEmail: "arjun.sharma@email.com",
  enrollmentDate: "Sep 1, 2022",
  gpa: 3.4,
  rank: 7,
  totalStudents: 32,
  attendanceRate: 94.3,
  overallGrade: "B+",
  status: "active",
};

export const academicPerformance = [
  { term: "T1 '23", math: 78, english: 82, physics: 75, chemistry: 80, urdu: 88, avg: 80.6 },
  { term: "T2 '23", math: 80, english: 85, physics: 78, chemistry: 82, urdu: 90, avg: 83.0 },
  { term: "T3 '23", math: 76, english: 83, physics: 80, chemistry: 79, urdu: 87, avg: 81.0 },
  { term: "T1 '24", math: 82, english: 87, physics: 79, chemistry: 84, urdu: 91, avg: 84.6 },
  { term: "T2 '24", math: 85, english: 89, physics: 82, chemistry: 86, urdu: 93, avg: 87.0 },
];

export const attendanceHistory = [
  { month: "Sep '23", rate: 98, present: 22, absent: 0, late: 0 },
  { month: "Oct '23", rate: 95, present: 20, absent: 1, late: 0 },
  { month: "Nov '23", rate: 91, present: 21, absent: 2, late: 0 },
  { month: "Dec '23", rate: 100, present: 20, absent: 0, late: 0 },
  { month: "Jan '24", rate: 95, present: 21, absent: 1, late: 0 },
  { month: "Feb '24", rate: 90, present: 19, absent: 2, late: 1 },
  { month: "Mar '24", rate: 96, present: 22, absent: 1, late: 0 },
  { month: "Apr '24", rate: 93, present: 21, absent: 1, late: 1 },
  { month: "May '24", rate: 96, present: 22, absent: 0, late: 1 },
  { month: "Jun '24", rate: 94, present: 15, absent: 1, late: 0 },
];

export const homeworkCompletion = [
  { month: "Sep", rate: 95 },
  { month: "Oct", rate: 88 },
  { month: "Nov", rate: 92 },
  { month: "Dec", rate: 97 },
  { month: "Jan", rate: 85 },
  { month: "Feb", rate: 90 },
  { month: "Mar", rate: 94 },
  { month: "Apr", rate: 89 },
  { month: "May", rate: 96 },
  { month: "Jun", rate: 93 },
];

export const projects360 = [
  { title: "Urdu Literature Analysis", subject: "Urdu", grade: "A", score: 92, term: "T2 '24", status: "completed" },
  { title: "English Drama Script", subject: "English", grade: "B+", score: 88, term: "T2 '24", status: "completed" },
  { title: "Physics Lab Report: Pendulum", subject: "Physics", grade: "A-", score: 87, term: "T1 '24", status: "completed" },
  { title: "Science Fair: Solar Energy", subject: "Physics", grade: null, score: null, term: "T2 '24", status: "in_progress" },
  { title: "Math Modeling: Population Growth", subject: "Mathematics", grade: null, score: null, term: "T2 '24", status: "in_progress" },
];

export const teacherRemarks = [
  { teacher: "Dr. Priya Sharma", subject: "Mathematics", date: "Jun 5, 2024", remark: "Aarav shows excellent analytical thinking. His performance in problem-solving has significantly improved this term. Recommend for the Math Olympiad team.", sentiment: "positive" },
  { teacher: "Ms. Neha Gupta", subject: "English", date: "May 28, 2024", remark: "Strong reading comprehension and articulate in class discussions. Creative writing needs more practice. Overall a solid student.", sentiment: "positive" },
  { teacher: "Mr. Imran Khan", subject: "Physics", date: "May 20, 2024", remark: "Good grasp of theory but struggles with complex calculations under time pressure. Recommend additional practice with timed problem sets.", sentiment: "neutral" },
  { teacher: "Dr. Sunita Rao", subject: "Chemistry", date: "May 15, 2024", remark: "Outstanding improvement this month! Lab safety and precision are excellent. One of the top performers in the practical component.", sentiment: "positive" },
  { teacher: "Mr. Aaqib Wani", subject: "Urdu", date: "Jun 8, 2024", remark: "Exceptional command of Urdu language and literature. Aarav demonstrates mature comprehension beyond his grade level.", sentiment: "positive" },
];

export const communicationHistory = [
  { date: "Jun 10, 2024", from: "Dr. Priya Sharma", type: "Message", subject: "Mid-Term Exam Reminder", preview: "Please ensure Aarav reviews chapters 4 and 5 before the June 20 exam..." },
  { date: "Jun 3, 2024", from: "School Admin", type: "Notice", subject: "Parent-Teacher Meeting - June 15", preview: "We would like to invite you to the upcoming parent-teacher meeting scheduled..." },
  { date: "May 28, 2024", from: "Mr. Imran Khan", type: "Message", subject: "Physics Assignment Feedback", preview: "Aarav's lab report was well-structured. Minor deductions for calculation errors..." },
  { date: "May 20, 2024", from: "School Admin", type: "Notice", subject: "Academic Calendar Update", preview: "Please note the updated exam schedule for the upcoming mid-term period..." },
  { date: "May 15, 2024", from: "Dr. Sunita Rao", type: "Message", subject: "Chemistry Performance", preview: "I wanted to share how impressed I am with Aarav's recent improvement in Chemistry..." },
];

export const feeHistory = [
  { term: "Semester 2, 2023-24", amount: 15000, paidDate: "Jan 8, 2024", method: "Bank Transfer", status: "paid", receipt: "RCP-2024-0018" },
  { term: "Semester 1, 2023-24", amount: 15000, paidDate: "Sep 5, 2023", method: "Bank Transfer", status: "paid", receipt: "RCP-2023-0147" },
  { term: "Semester 2, 2022-23", amount: 13000, paidDate: "Jan 10, 2023", method: "Cash", status: "paid", receipt: "RCP-2023-0012" },
  { term: "Semester 1, 2022-23", amount: 13000, paidDate: "Sep 3, 2022", method: "Bank Transfer", status: "paid", receipt: "RCP-2022-0098" },
];

export const aiSummary = `Aarav Sharma is a consistently improving, well-rounded student in Grade 10-A. 

**Strengths:** Exceptional in Urdu Language (91/100) and shows strong analytical skills in Mathematics (82/100) with a +4 point improvement this term. His attendance record is commendable at 94.3%, with a current 12-day streak.

**Areas for Development:** Physics performance requires attention — his last score of 79 reflects a -1 decline. Time-management under exam pressure needs practice. The pending English essay (due Jun 16) requires immediate attention.

**Overall Outlook:** Aarav is ranked 7th out of 32 students with a GPA of 3.4 (B+). His trajectory is positive with consistent improvement across 5 terms. He is a strong candidate for academic honours if current momentum is maintained.

**Recommendation:** Enroll in the Math Olympiad team and consider the Advanced Urdu Literature elective next term.`;
