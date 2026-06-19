// Parent mock data — supplementary static content
// Live data (attendance, timetable, fees) is served from useDataStore + permissions.ts
// DEMO_CHILD_ID = "STU-0451" (defined in permissions.ts)

export const childProfile = {
  id:           "STU-0451",
  name:         "Ahmed Al-Rashidi",
  studentId:    "STU-0451",
  grade:        "Grade 10-A",
  age:          15,
  photo:        "AA",
  classTeacher: "Dr. Sarah Al-Hamdan",
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
  { month: "Sep", math: 78, english: 85, science: 80, arabic: 88, avg: 82 },
  { month: "Oct", math: 82, english: 83, science: 85, arabic: 86, avg: 84 },
  { month: "Nov", math: 75, english: 88, science: 78, arabic: 90, avg: 82 },
  { month: "Dec", math: 85, english: 90, science: 82, arabic: 88, avg: 86 },
  { month: "Jan", math: 80, english: 87, science: 88, arabic: 85, avg: 85 },
  { month: "Feb", math: 88, english: 84, science: 86, arabic: 89, avg: 87 },
];

// Subject teachers directory (static profile data)
export const subjectTeachers = [
  { name: "Dr. Sarah Al-Hamdan",  subject: "Mathematics",      qualification: "PhD Mathematics",        experience: "12 yrs", photo: "SA", rating: 4.8, email: "sarah@school.edu"   },
  { name: "Ms. Reem Al-Harbi",    subject: "English",          qualification: "MA English Literature",  experience: "8 yrs",  photo: "RA", rating: 4.6, email: "reem@school.edu"    },
  { name: "Mr. Khalid Al-Mutairi",subject: "Physics",          qualification: "MSc Physics",            experience: "9 yrs",  photo: "KA", rating: 4.5, email: "khalid@school.edu"  },
  { name: "Dr. Layla Al-Anazi",   subject: "Chemistry",        qualification: "PhD Chemistry",          experience: "7 yrs",  photo: "LA", rating: 4.7, email: "layla@school.edu"   },
  { name: "Mr. Hassan Al-Shehri", subject: "Arabic",           qualification: "MA Arabic Language",     experience: "15 yrs", photo: "HA", rating: 4.9, email: "hassan@school.edu"  },
  { name: "Mr. Tariq Al-Yami",    subject: "Computer Science", qualification: "BSc Computer Science",   experience: "5 yrs",  photo: "TA", rating: 4.4, email: "tariq@school.edu"   },
];

// Teacher reviews (static — parent-authored, no store backing)
export const teacherReviews = [
  { id: 1, teacher: "Dr. Sarah Al-Hamdan",  subject: "Mathematics", month: "May 2026", rating: 5, review: "Excellent teaching! Ahmed has shown great improvement in algebra. Very patient and explains concepts clearly." },
  { id: 2, teacher: "Ms. Reem Al-Harbi",    subject: "English",     month: "May 2026", rating: 4, review: "Good engagement in class discussions. Would appreciate more writing practice assignments." },
  { id: 3, teacher: "Mr. Khalid Al-Mutairi",subject: "Physics",     month: "Apr 2026", rating: 4, review: "Excellent lab sessions. Ahmed enjoys the practical experiments. Keep up the great work." },
  { id: 4, teacher: "Dr. Layla Al-Anazi",   subject: "Chemistry",   month: "Apr 2026", rating: 5, review: "Amazing dedication! The extra study materials provided are very helpful for exam prep." },
];

// Fee history fallback (used only if live fee record unavailable)
export const feeStatus = {
  totalFee:   15000,
  paid:       15000,
  balance:    0,
  nextDue:    "Oct 30, 2026",
  nextAmount: 15000,
  history: [
    { date: "Sep 5, 2026",  amount: 15000, type: "Semester 1", status: "paid" },
    { date: "Jan 8, 2026",  amount: 15000, type: "Semester 2", status: "paid" },
  ],
};

// weeklyTimetable REMOVED — timetable now served from useDataStore.timetableEntries
// todayChildSchedule REMOVED — schedule now derived from useDataStore.timetableEntries filtered to today
