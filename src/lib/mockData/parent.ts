export const childProfile = {
  id: "1",
  name: "Ahmed Al-Rashidi",
  studentId: "STU-2024-001",
  grade: "Grade 10-A",
  age: 15,
  photo: "AA",
  classTeacher: "Dr. Sarah Al-Hamdan",
  rollNumber: 7,
  overallGrade: "B+",
  gpa: 3.4,
};

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

export const childMarksTrend = [
  { month: "Sep", math: 78, english: 85, science: 80, arabic: 88, avg: 82 },
  { month: "Oct", math: 82, english: 83, science: 85, arabic: 86, avg: 84 },
  { month: "Nov", math: 75, english: 88, science: 78, arabic: 90, avg: 82 },
  { month: "Dec", math: 85, english: 90, science: 82, arabic: 88, avg: 86 },
  { month: "Jan", math: 80, english: 87, science: 88, arabic: 85, avg: 85 },
  { month: "Feb", math: 88, english: 84, science: 86, arabic: 89, avg: 87 },
];

export const weeklyTimetable = {
  Sunday: [
    { time: "07:30", subject: "Mathematics", teacher: "Dr. Sarah Al-Hamdan", room: "204" },
    { time: "09:15", subject: "English", teacher: "Ms. Reem Al-Harbi", room: "105" },
    { time: "11:00", subject: "Physics", teacher: "Mr. Khalid Al-Mutairi", room: "Lab 2" },
    { time: "13:00", subject: "Arabic", teacher: "Mr. Hassan Al-Shehri", room: "201" },
  ],
  Monday: [
    { time: "07:30", subject: "Chemistry", teacher: "Dr. Layla Al-Anazi", room: "Lab 1" },
    { time: "09:15", subject: "Mathematics", teacher: "Dr. Sarah Al-Hamdan", room: "204" },
    { time: "11:00", subject: "Islamic Studies", teacher: "Sheikh Omar Al-Farsi", room: "103" },
    { time: "13:00", subject: "PE", teacher: "Mr. Faris Al-Shammari", room: "Gym" },
  ],
  Tuesday: [
    { time: "07:30", subject: "English", teacher: "Ms. Reem Al-Harbi", room: "105" },
    { time: "09:15", subject: "Physics", teacher: "Mr. Khalid Al-Mutairi", room: "Lab 2" },
    { time: "11:00", subject: "Mathematics", teacher: "Dr. Sarah Al-Hamdan", room: "204" },
    { time: "13:00", subject: "Computer Science", teacher: "Mr. Tariq Al-Yami", room: "CS Lab" },
  ],
  Wednesday: [
    { time: "07:30", subject: "Arabic", teacher: "Mr. Hassan Al-Shehri", room: "201" },
    { time: "09:15", subject: "Chemistry", teacher: "Dr. Layla Al-Anazi", room: "Lab 1" },
    { time: "11:00", subject: "English", teacher: "Ms. Reem Al-Harbi", room: "105" },
    { time: "13:00", subject: "Art", teacher: "Ms. Noura Al-Zaid", room: "Art Room" },
  ],
  Thursday: [
    { time: "07:30", subject: "Mathematics", teacher: "Dr. Sarah Al-Hamdan", room: "204" },
    { time: "09:15", subject: "Arabic", teacher: "Mr. Hassan Al-Shehri", room: "201" },
    { time: "11:00", subject: "Physics", teacher: "Mr. Khalid Al-Mutairi", room: "Lab 2" },
    { time: "13:00", subject: "Computer Science", teacher: "Mr. Tariq Al-Yami", room: "CS Lab" },
  ],
};

export const subjectTeachers = [
  { name: "Dr. Sarah Al-Hamdan", subject: "Mathematics", qualification: "PhD Mathematics", experience: "12 yrs", photo: "SA", rating: 4.8, email: "sarah@school.edu" },
  { name: "Ms. Reem Al-Harbi", subject: "English", qualification: "MA English Literature", experience: "8 yrs", photo: "RA", rating: 4.6, email: "reem@school.edu" },
  { name: "Mr. Khalid Al-Mutairi", subject: "Physics", qualification: "MSc Physics", experience: "9 yrs", photo: "KA", rating: 4.5, email: "khalid@school.edu" },
  { name: "Dr. Layla Al-Anazi", subject: "Chemistry", qualification: "PhD Chemistry", experience: "7 yrs", photo: "LA", rating: 4.7, email: "layla@school.edu" },
  { name: "Mr. Hassan Al-Shehri", subject: "Arabic", qualification: "MA Arabic Language", experience: "15 yrs", photo: "HA", rating: 4.9, email: "hassan@school.edu" },
  { name: "Mr. Tariq Al-Yami", subject: "Computer Science", qualification: "BSc Computer Science", experience: "5 yrs", photo: "TA", rating: 4.4, email: "tariq@school.edu" },
];

export const teacherReviews = [
  { id: 1, teacher: "Dr. Sarah Al-Hamdan", subject: "Mathematics", month: "May 2024", rating: 5, review: "Excellent teaching! Ahmed has shown great improvement in algebra. Very patient and explains concepts clearly." },
  { id: 2, teacher: "Ms. Reem Al-Harbi", subject: "English", month: "May 2024", rating: 4, review: "Good engagement in class discussions. Would appreciate more writing practice assignments." },
  { id: 3, teacher: "Mr. Khalid Al-Mutairi", subject: "Physics", month: "April 2024", rating: 4, review: "Excellent lab sessions. Ahmed enjoys the practical experiments. Keep up the great work." },
  { id: 4, teacher: "Dr. Layla Al-Anazi", subject: "Chemistry", month: "April 2024", rating: 5, review: "Amazing dedication! The extra study materials provided are very helpful for exam prep." },
];

export const todayChildSchedule = [
  { time: "07:30", subject: "Mathematics", teacher: "Dr. Sarah Al-Hamdan", room: "204", status: "completed" },
  { time: "09:15", subject: "English", teacher: "Ms. Reem Al-Harbi", room: "105", status: "ongoing" },
  { time: "11:00", subject: "Physics", teacher: "Mr. Khalid Al-Mutairi", room: "Lab 2", status: "upcoming" },
  { time: "13:00", subject: "Arabic", teacher: "Mr. Hassan Al-Shehri", room: "201", status: "upcoming" },
];

export const feeStatus = {
  totalFee: 15000,
  paid: 15000,
  balance: 0,
  nextDue: "Oct 30, 2024",
  nextAmount: 15000,
  history: [
    { date: "Sep 5, 2024", amount: 15000, type: "Semester 1", status: "paid" },
    { date: "Jan 8, 2024", amount: 15000, type: "Semester 2", status: "paid" },
  ],
};
