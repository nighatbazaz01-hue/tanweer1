export const studentProfile = {
  name: "Aarav Sharma",
  studentId: "STU-2024-001",
  grade: "Grade 10-A",
  gpa: 3.4,
  rank: 7,
  totalStudents: 32,
};

export const studentAttendance = {
  present: 89,
  absent: 4,
  late: 3,
  total: 96,
  rate: 92.7,
  streak: 12,
};

export const homeworkStatus = [
  { subject: "Mathematics", title: "Quadratic Equations - Chapter 5", dueDate: "Jun 15", status: "submitted", score: 18, total: 20 },
  { subject: "English", title: "Essay: Technology in Education", dueDate: "Jun 16", status: "pending", score: null, total: 25 },
  { subject: "Physics", title: "Lab Report: Motion Experiment", dueDate: "Jun 18", status: "pending", score: null, total: 30 },
  { subject: "Chemistry", title: "Problem Set: Chemical Bonds", dueDate: "Jun 14", status: "submitted", score: 22, total: 25 },
  { subject: "Urdu",   title: "Reading Comprehension #8", dueDate: "Jun 12", status: "submitted", score: 19, total: 20 },
  { subject: "Computer Science", title: "Python Project: Calculator", dueDate: "Jun 20", status: "in_progress", score: null, total: 50 },
];

export const projects = [
  { id: 1, title: "Science Fair: Solar Energy Efficiency", subject: "Physics", dueDate: "Jun 25", progress: 65, members: ["Ahmed", "Fatima", "Omar"], grade: null, status: "in_progress" },
  { id: 2, title: "Math Modeling: Population Growth", subject: "Mathematics", dueDate: "Jun 30", progress: 40, members: ["Ahmed", "Nora"], grade: null, status: "in_progress" },
  { id: 3, title: "Urdu Literature Analysis",   subject: "Urdu",  dueDate: "Jun 10", progress: 100, members: ["Aarav"], grade: "A", status: "completed" },
  { id: 4, title: "English Drama Script", subject: "English", dueDate: "May 25", progress: 100, members: ["Ahmed", "Hassan", "Lina"], grade: "B+", status: "completed" },
];

export const upcomingExams = [
  { subject: "Mathematics", date: "Jun 20", time: "08:00", room: "Exam Hall A", type: "Mid-Term", syllabus: "Ch. 1-5", weight: "30%" },
  { subject: "Physics", date: "Jun 22", time: "10:00", room: "Exam Hall B", type: "Mid-Term", syllabus: "Units 1-4", weight: "30%" },
  { subject: "English", date: "Jun 24", time: "08:00", room: "Exam Hall A", type: "Quiz", syllabus: "Grammar + Essay", weight: "10%" },
  { subject: "Chemistry", date: "Jun 26", time: "10:00", room: "Lab 1", type: "Practical", syllabus: "Lab Units 1-3", weight: "15%" },
];

export const subjectMarks = [
  { subject: "Mathematics",    teacher: "Dr. Priya Sharma", marks: 82, total: 100, grade: "B+", change: +4 },
  { subject: "English",        teacher: "Ms. Neha Gupta",   marks: 87, total: 100, grade: "A-", change: +2 },
  { subject: "Physics",        teacher: "Mr. Imran Khan",   marks: 79, total: 100, grade: "B+", change: -1 },
  { subject: "Chemistry",      teacher: "Dr. Sunita Rao",   marks: 84, total: 100, grade: "A-", change: +6 },
  { subject: "Urdu",           teacher: "Mr. Aaqib Wani",   marks: 91, total: 100, grade: "A",  change: +3 },
  { subject: "Computer Science", teacher: "Mr. Ravi Sharma",marks: 88, total: 100, grade: "A-", change: +5 },
];

export const weeklyTimetable = {
  Monday: [
    { time: "07:30", subject: "Mathematics",    room: "204",    teacher: "Dr. Priya"  },
    { time: "09:15", subject: "English",         room: "105",    teacher: "Ms. Neha"   },
    { time: "11:00", subject: "Physics",         room: "Lab 2",  teacher: "Mr. Imran"  },
    { time: "13:00", subject: "Urdu",            room: "201",    teacher: "Mr. Aaqib"  },
  ],
  Tuesday: [
    { time: "07:30", subject: "Chemistry",       room: "Lab 1",  teacher: "Dr. Sunita" },
    { time: "09:15", subject: "Mathematics",     room: "204",    teacher: "Dr. Priya"  },
    { time: "11:00", subject: "Social Studies",  room: "103",    teacher: "Ms. Reema"  },
    { time: "13:00", subject: "PE",              room: "Gym",    teacher: "Mr. Vikram" },
  ],
  Wednesday: [
    { time: "07:30", subject: "English",         room: "105",    teacher: "Ms. Neha"   },
    { time: "09:15", subject: "Physics",         room: "Lab 2",  teacher: "Mr. Imran"  },
    { time: "11:00", subject: "Mathematics",     room: "204",    teacher: "Dr. Priya"  },
    { time: "13:00", subject: "Computer Science",room: "CS Lab", teacher: "Mr. Ravi"   },
  ],
  Thursday: [
    { time: "07:30", subject: "Urdu",            room: "201",    teacher: "Mr. Aaqib"  },
    { time: "09:15", subject: "Chemistry",       room: "Lab 1",  teacher: "Dr. Sunita" },
    { time: "11:00", subject: "English",         room: "105",    teacher: "Ms. Neha"   },
    { time: "13:00", subject: "Art",             room: "Art Room", teacher: "Ms. Jyoti" },
  ],
  Friday: [
    { time: "07:30", subject: "Mathematics",     room: "204",    teacher: "Dr. Priya"  },
    { time: "09:15", subject: "Urdu",            room: "201",    teacher: "Mr. Aaqib"  },
    { time: "11:00", subject: "Physics",         room: "Lab 2",  teacher: "Mr. Imran"  },
    { time: "13:00", subject: "Computer Science",room: "CS Lab", teacher: "Mr. Ravi"   },
  ],
};

export const studyTips = [
  "You have a Math mid-term in 7 days — focus on Chapter 4 & 5 practice problems.",
  "Your Chemistry score improved 6 points! Keep reviewing your lab notes.",
  "English essay due June 16 — you haven't started yet.",
  "Your attendance streak is 12 days! Great consistency.",
];
