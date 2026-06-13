const FIRST_NAMES_MALE = [
  "Ahmed", "Mohammed", "Omar", "Yusuf", "Hassan", "Ali", "Rayan", "Khalid",
  "Tariq", "Faris", "Ibrahim", "Salman", "Nasser", "Hamad", "Waleed", "Ziad",
  "Majed", "Saad", "Fahad", "Turki", "Bandar", "Sultan", "Nawaf", "Muteb",
  "Mansour", "Abdulaziz", "Abdulrahman", "Saud", "Badr", "Talal",
];

const FIRST_NAMES_FEMALE = [
  "Fatima", "Nora", "Sara", "Lina", "Reem", "Hessa", "Maha", "Dana",
  "Nouf", "Reema", "Dina", "Rana", "Lama", "Shahad", "Arwa", "Maryam",
  "Ghada", "Hind", "Abeer", "Najla", "Latifa", "Wafa", "Amal", "Samira",
  "Hajer", "Joud", "Rawan", "Basma", "Wedad", "Afnan",
];

const LAST_NAMES = [
  "Al-Rashidi", "Al-Ghamdi", "Al-Zahrani", "Al-Otaibi", "Al-Shehri",
  "Al-Mutairi", "Al-Dosari", "Al-Qahtani", "Al-Harbi", "Al-Anazi",
  "Al-Shamri", "Al-Barrak", "Al-Khalidi", "Al-Mansouri", "Al-Yami",
  "Al-Hamdan", "Al-Balawi", "Al-Maliki", "Al-Ruwaili", "Al-Juhani",
  "Al-Subai", "Al-Enezi", "Al-Dawsari", "Al-Bishi", "Al-Zahrani",
  "Al-Qahtani", "Al-Saidi", "Al-Thubaiti", "Al-Asiri", "Al-Shahrani",
];

const SUBJECTS = [
  "Mathematics", "English", "Arabic", "Physics", "Chemistry",
  "Biology", "Computer Science", "Islamic Studies", "History",
  "Geography", "Physical Education", "Art", "Social Studies",
];

const QUALIFICATIONS = [
  "B.Ed. Mathematics", "M.Sc. Physics", "Ph.D. Chemistry", "B.Ed. English",
  "M.A. Arabic Literature", "B.Sc. Computer Science", "M.Ed. Educational Leadership",
  "B.Ed. Biology", "M.Sc. Mathematics", "B.Ed. Islamic Studies",
  "M.A. History", "B.Ed. Physical Education", "M.Sc. Geography",
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function seededPick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

export interface Student {
  id: string;
  name: string;
  gender: "male" | "female";
  grade: number;
  section: "A" | "B" | "C" | "D";
  attendanceRate: number;
  performanceTier: "top" | "average" | "at-risk";
  gpa: number;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  avatar: string;
  enrolledYear: number;
}

export interface Teacher {
  id: string;
  name: string;
  gender: "male" | "female";
  subject: string;
  qualification: string;
  assignedGrades: number[];
  assignedSections: string[];
  employeeId: string;
  phone: string;
  email: string;
  avatar: string;
  yearsExperience: number;
}

export interface Parent {
  id: string;
  name: string;
  childName: string;
  childId: string;
  childGrade: number;
  childSection: "A" | "B" | "C" | "D";
  phone: string;
  email: string;
  lastContact: string;
  avatar: string;
}

export interface VPProfile {
  role: "vp1" | "vp2" | "vp3";
  name: string;
  gradeRange: [number, number];
  gradeGroupLabel: string;
}

let _students: Student[] | null = null;
let _teachers: Teacher[] | null = null;

export function getAllStudents(): Student[] {
  if (_students) return _students;

  const sections: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
  const result: Student[] = [];
  let idx = 0;

  for (let grade = 1; grade <= 12; grade++) {
    const studentsPerGrade = 50;
    for (let s = 0; s < studentsPerGrade; s++) {
      const seed = grade * 1000 + s * 7 + 13;
      const isMale = seededRandom(seed * 3) > 0.48;
      const firstName = isMale
        ? seededPick(FIRST_NAMES_MALE, seed + 1)
        : seededPick(FIRST_NAMES_FEMALE, seed + 1);
      const lastName = seededPick(LAST_NAMES, seed + 2);
      const fullName = `${firstName} ${lastName}`;
      const section = sections[Math.floor(s / (studentsPerGrade / 4))] as "A" | "B" | "C" | "D";
      const attRaw = seededRandom(seed + 4);
      const attendanceRate = Math.round((75 + attRaw * 25) * 10) / 10;
      let performanceTier: "top" | "average" | "at-risk";
      const perfRaw = seededRandom(seed + 5);
      if (perfRaw > 0.75) performanceTier = "top";
      else if (perfRaw > 0.25) performanceTier = "average";
      else performanceTier = "at-risk";
      const gpaBase = performanceTier === "top" ? 3.5 : performanceTier === "average" ? 2.5 : 1.8;
      const gpa = Math.round((gpaBase + seededRandom(seed + 6) * 0.9) * 10) / 10;
      const parentFName = isMale
        ? seededPick(FIRST_NAMES_MALE, seed + 7)
        : seededPick(FIRST_NAMES_MALE, seed + 7);
      const parentName = `${parentFName} ${lastName}`;
      const phoneDigits = Math.floor(50000000 + seededRandom(seed + 8) * 49999999);
      const enrolledYear = 2024 - (grade - 1);

      result.push({
        id: `STU-${String(idx + 1).padStart(4, "0")}`,
        name: fullName,
        gender: isMale ? "male" : "female",
        grade,
        section,
        attendanceRate,
        performanceTier,
        gpa: Math.min(4.0, gpa),
        parentName,
        parentPhone: `+966 5${String(phoneDigits).slice(0, 8)}`,
        parentEmail: `${parentFName.toLowerCase()}.${lastName.replace("Al-", "").toLowerCase()}@email.com`,
        avatar: `${firstName[0]}${lastName[0]}`,
        enrolledYear,
      });
      idx++;
    }
  }

  _students = result;
  return result;
}

export function getAllTeachers(): Teacher[] {
  if (_teachers) return _teachers;

  const result: Teacher[] = [];

  for (let i = 0; i < 50; i++) {
    // ── Demo teacher persona: always TCH-003, Dr. Sarah Al-Hamdan ─────────────
    // i=2 → gradeGroupIdx=2 → grades 9–12 (includes Grade 10-A). Pinned so
    // filterTeachersForRole('teacher') can reliably match by ID = "TCH-003".
    if (i === 2) {
      result.push({
        id: "TCH-003",
        name: "Dr. Sarah Al-Hamdan",
        gender: "female",
        subject: "Mathematics",
        qualification: "Ph.D. Mathematics",
        assignedGrades: [9, 10, 11, 12],
        assignedSections: ["9-A", "9-B", "10-A", "10-B", "11-A", "11-B", "12-A", "12-B"],
        employeeId: "TCH-003",
        phone: "+966 512345678",
        email: "sarah.hamdan@tanweer.edu",
        avatar: "SH",
        yearsExperience: 15,
      });
      continue;
    }

    const seed = i * 31 + 7;
    const isMale = seededRandom(seed * 2) > 0.45;
    const firstName = isMale
      ? seededPick(FIRST_NAMES_MALE, seed + 1)
      : seededPick(FIRST_NAMES_FEMALE, seed + 1);
    const lastName = seededPick(LAST_NAMES, seed + 2);
    const subject = seededPick(SUBJECTS, seed + 3);
    const qual = seededPick(QUALIFICATIONS, seed + 4);

    const gradeGroupIdx = i % 3;
    let assignedGrades: number[];
    if (gradeGroupIdx === 0) assignedGrades = [1, 2, 3, 4];
    else if (gradeGroupIdx === 1) assignedGrades = [5, 6, 7, 8];
    else assignedGrades = [9, 10, 11, 12];

    const sections = ["A", "B"];
    if (seededRandom(seed + 5) > 0.5) sections.push("C");
    const assignedSections = assignedGrades.flatMap((g) =>
      sections.map((sec) => `${g}-${sec}`)
    );

    const phoneDigits = Math.floor(50000000 + seededRandom(seed + 8) * 49999999);
    const yearsExp = Math.floor(1 + seededRandom(seed + 9) * 24);

    result.push({
      id: `TCH-${String(i + 1).padStart(3, "0")}`,
      name: `${isMale ? (yearsExp > 10 ? "Dr. " : "Mr. ") : yearsExp > 10 ? "Dr. " : "Ms. "}${firstName} ${lastName}`,
      gender: isMale ? "male" : "female",
      subject,
      qualification: qual,
      assignedGrades,
      assignedSections,
      employeeId: `TCH-${String(i + 1).padStart(3, "0")}`,
      phone: `+966 5${String(phoneDigits).slice(0, 8)}`,
      email: `${firstName.toLowerCase()}.${lastName.replace("Al-", "").toLowerCase()}@tanweer.edu`,
      avatar: `${firstName[0]}${lastName[0]}`,
      yearsExperience: yearsExp,
    });
  }

  _teachers = result;
  return result;
}

export function getAllParents(): Parent[] {
  return getAllStudents().map((s) => ({
    id: `PAR-${s.id}`,
    name: s.parentName,
    childName: s.name,
    childId: s.id,
    childGrade: s.grade,
    childSection: s.section,
    phone: s.parentPhone,
    email: s.parentEmail,
    lastContact: getLastContact(s.id),
    avatar: s.parentName.split(" ").map((p) => p[0]).join("").slice(0, 2),
  }));
}

function getLastContact(id: string): string {
  const num = parseInt(id.replace("STU-", ""), 10);
  const days = Math.floor(seededRandom(num * 13) * 30);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export function getStudentsByGrade(grade: number): Student[] {
  return getAllStudents().filter((s) => s.grade === grade);
}

export function getStudentsByGradeGroup(startGrade: 1 | 5 | 9): Student[] {
  const endGrade = startGrade + 3;
  return getAllStudents().filter((s) => s.grade >= startGrade && s.grade <= endGrade);
}

export function getTeachersByGradeGroup(startGrade: 1 | 5 | 9): Teacher[] {
  return getAllTeachers().filter((t) => t.assignedGrades.includes(startGrade));
}

export function getVPProfile(role: "vp1" | "vp2" | "vp3"): VPProfile {
  const profiles: Record<string, VPProfile> = {
    vp1: { role: "vp1", name: "Dr. Khalid Al-Otaibi", gradeRange: [1, 4], gradeGroupLabel: "Grades 1–4" },
    vp2: { role: "vp2", name: "Ms. Nora Al-Zahrani", gradeRange: [5, 8], gradeGroupLabel: "Grades 5–8" },
    vp3: { role: "vp3", name: "Mr. Faris Al-Mutairi", gradeRange: [9, 12], gradeGroupLabel: "Grades 9–12" },
  };
  return profiles[role];
}

export interface GradeGroupStats {
  studentCount: number;
  teacherCount: number;
  attendanceRate: number;
  atRiskCount: number;
  topCount: number;
  avgGpa: number;
  gradeBreakdown: { grade: number; count: number; attendanceRate: number }[];
}

export function getGradeGroupStats(startGrade: 1 | 5 | 9): GradeGroupStats {
  const students = getStudentsByGradeGroup(startGrade);
  const teachers = getTeachersByGradeGroup(startGrade);
  const avgAtt = students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length;
  const atRisk = students.filter((s) => s.performanceTier === "at-risk").length;
  const top = students.filter((s) => s.performanceTier === "top").length;
  const avgGpa = students.reduce((sum, s) => sum + s.gpa, 0) / students.length;

  const gradeBreakdown = [];
  for (let g = startGrade; g <= startGrade + 3; g++) {
    const gs = students.filter((s) => s.grade === g);
    gradeBreakdown.push({
      grade: g,
      count: gs.length,
      attendanceRate: Math.round((gs.reduce((sum, s) => sum + s.attendanceRate, 0) / gs.length) * 10) / 10,
    });
  }

  return {
    studentCount: students.length,
    teacherCount: teachers.length,
    attendanceRate: Math.round(avgAtt * 10) / 10,
    atRiskCount: atRisk,
    topCount: top,
    avgGpa: Math.round(avgGpa * 100) / 100,
    gradeBreakdown,
  };
}

export type FeeStatus = "paid" | "partial" | "overdue" | "pending";

export interface PopulationFeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: number;
  section: string;
  feeType: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: FeeStatus;
  avatar: string;
}

const FEE_TYPES = [
  "Tuition Fee — Semester 1",
  "Tuition Fee — Semester 2",
  "Activity Fee",
  "Lab Fee",
  "Transport Fee",
  "Library Fee",
];

const DUE_DATES = [
  "Jun 30, 2026", "Jul 15, 2026", "May 31, 2026", "Aug 1, 2026",
  "Apr 30, 2026", "Jun 15, 2026",
];

let _feeRecords: PopulationFeeRecord[] | null = null;

export function generateFeeRecords(): PopulationFeeRecord[] {
  if (_feeRecords) return _feeRecords;
  const students = getAllStudents();
  _feeRecords = students.map((s, i) => {
    const seed = i * 17 + 3;
    const r1 = seededRandom(seed);
    const r2 = seededRandom(seed + 1);
    const r3 = seededRandom(seed + 2);
    const baseAmount = 8000 + Math.floor(seededRandom(seed + 3) * 14000);
    const feeType = FEE_TYPES[Math.floor(r1 * FEE_TYPES.length)];
    const dueDate = DUE_DATES[Math.floor(r2 * DUE_DATES.length)];
    let status: FeeStatus;
    let paidAmount: number;
    if (r3 < 0.55) { status = "paid"; paidAmount = baseAmount; }
    else if (r3 < 0.73) { status = "partial"; paidAmount = Math.floor(baseAmount * (0.3 + seededRandom(seed + 4) * 0.5)); }
    else if (r3 < 0.88) { status = "overdue"; paidAmount = 0; }
    else { status = "pending"; paidAmount = 0; }
    return {
      id: `FEE-${s.id}`,
      studentId: s.id,
      studentName: s.name,
      grade: s.grade,
      section: s.section,
      feeType,
      amount: baseAmount,
      paidAmount,
      dueDate,
      status,
      avatar: s.avatar,
    };
  });
  return _feeRecords;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface PopulationAttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: number;
  section: string;
  status: AttendanceStatus;
  date: string;
  avatar: string;
}

let _attendanceRecords: PopulationAttendanceRecord[] | null = null;

export function generateAttendanceRecords(date = "Jun 13, 2026"): PopulationAttendanceRecord[] {
  if (_attendanceRecords) return _attendanceRecords;
  const students = getAllStudents();
  _attendanceRecords = students.map((s, i) => {
    const seed = i * 23 + 7;
    const r = seededRandom(seed);
    let status: AttendanceStatus;
    if (r < 0.82) status = "present";
    else if (r < 0.91) status = "absent";
    else if (r < 0.96) status = "late";
    else status = "excused";
    return {
      id: `ATT-${s.id}`,
      studentId: s.id,
      studentName: s.name,
      grade: s.grade,
      section: s.section,
      status,
      date,
      avatar: s.avatar,
    };
  });
  return _attendanceRecords;
}
