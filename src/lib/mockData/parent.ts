// Parent mock data — supplementary static content
// Live data (attendance, timetable, fees) is served from useDataStore + permissions.ts
// DEMO_CHILD_ID = "STU-0451" (defined in permissions.ts)

export const childProfile = {
  id:           "STU-0451",
  name:         "Aarav Sharma",
  studentId:    "STU-0451",
  grade:        "Grade 10-A",
  age:          15,
  photo:        "AS",
  classTeacher: "Dr. Priya Sharma",
  rollNumber:   7,
  overallGrade: "B+",
  gpa:          3.4,
};

// Historical monthly attendance trend (static — no per-day historical store)
export const childAttendanceTrend = [
  { month: "Sep", rate: 98 },
  { month: "Oct", rate: 96 },
  { month: "Nov", rate: 94 },
  { month: "Dec", rate: 100 },
  { month: "Jan", rate: 95 },
  { month: "Feb", rate: 92 },
  { month: "Mar", rate: 97 },
  { month: "Apr", rate: 93 },
  { month: "May", rate: 96 },
  { month: "Jun", rate: 94 },
];

// Historical marks trend by subject (static — no marks store yet)
export const childMarksTrend = [
  { month: "Sep", math: 78, english: 85, science: 80, urdu: 88, avg: 82 },
  { month: "Oct", math: 82, english: 83, science: 85, urdu: 86, avg: 84 },
  { month: "Nov", math: 75, english: 88, science: 78, urdu: 90, avg: 82 },
  { month: "Dec", math: 85, english: 90, science: 82, urdu: 88, avg: 86 },
  { month: "Jan", math: 80, english: 87, science: 88, urdu: 85, avg: 85 },
  { month: "Feb", math: 88, english: 84, science: 86, urdu: 89, avg: 87 },
];

// Subject teachers directory (static profile data)
export const subjectTeachers = [
  { name: "Dr. Priya Sharma",  subject: "Mathematics",      qualification: "PhD Mathematics",        experience: "12 yrs", photo: "PS", rating: 4.8, email: "priya@school.edu"   },
  { name: "Ms. Neha Gupta",   subject: "English",          qualification: "MA English Literature",  experience: "8 yrs",  photo: "NG", rating: 4.6, email: "neha@school.edu"    },
  { name: "Mr. Imran Khan",   subject: "Physics",          qualification: "MSc Physics",            experience: "9 yrs",  photo: "IK", rating: 4.5, email: "imran@school.edu"  },
  { name: "Dr. Sunita Rao",   subject: "Chemistry",        qualification: "PhD Chemistry",          experience: "7 yrs",  photo: "SR", rating: 4.7, email: "sunita@school.edu"  },
  { name: "Mr. Aaqib Wani",   subject: "Urdu",             qualification: "MA Urdu Language",       experience: "15 yrs", photo: "AW", rating: 4.9, email: "aaqib@school.edu"   },
  { name: "Mr. Ravi Sharma",  subject: "Computer Science", qualification: "BSc Computer Science",   experience: "5 yrs",  photo: "RV", rating: 4.4, email: "ravi@school.edu"    },
];

// Teacher reviews (static — parent-authored, no store backing)
export const teacherReviews = [
  { id: 1, teacher: "Dr. Priya Sharma",  subject: "Mathematics", month: "May 2026", rating: 5, review: "Excellent teaching! Aarav has shown great improvement in algebra. Very patient and explains concepts clearly." },
  { id: 2, teacher: "Ms. Neha Gupta",   subject: "English",     month: "May 2026", rating: 4, review: "Good engagement in class discussions. Would appreciate more writing practice assignments." },
  { id: 3, teacher: "Mr. Imran Khan",   subject: "Physics",     month: "Apr 2026", rating: 4, review: "Excellent lab sessions. Aarav enjoys the practical experiments. Keep up the great work." },
  { id: 4, teacher: "Dr. Sunita Rao",   subject: "Chemistry",   month: "Apr 2026", rating: 5, review: "Amazing dedication! The extra study materials provided are very helpful for exam prep." },
];

// Fee history fallback (used only if live fee record unavailable)
export const feeHistoryFallback = [
  { term: "Semester 2, 2023-24", amount: 15000, paidDate: "Jan 8, 2024", method: "Bank Transfer", status: "paid", receipt: "RCP-2024-0018" },
  { term: "Semester 1, 2023-24", amount: 15000, paidDate: "Sep 5, 2023", method: "Bank Transfer", status: "paid", receipt: "RCP-2023-0147" },
];

// Shaped alias consumed by parent/page.tsx fee history fallback render
export const feeStatus = {
  history: feeHistoryFallback.map((r) => ({
    type:   r.term,
    date:   r.paidDate,
    amount: r.amount,
  })),
};
