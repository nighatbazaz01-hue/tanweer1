export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  grade: string;
  section: string;
  status: "active" | "inactive" | "graduated" | "transferred";
  gender: "male" | "female";
  dateOfBirth: string;
  bloodGroup?: string;
  address?: string;
  phone?: string;
  email?: string;
  parentName?: string;
  parentPhone?: string;
  enrollmentDate: string;
  avatar?: string;
  schoolId: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  status: "active" | "inactive";
  joinDate: string;
  schoolId: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  feeType: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: "paid" | "partial" | "overdue" | "pending";
  schoolId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  schoolId: string;
}

export interface AdmissionLead {
  id: string;
  leadId: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  gradeApplied: string;
  status: "new" | "contacted" | "interview_scheduled" | "enrolled" | "rejected";
  createdAt: string;
  schoolId: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  attendanceRate: number;
  feeCollectionRate: number;
  newAdmissions: number;
  pendingFees: number;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  action?: { type: string; detail?: string };
}
