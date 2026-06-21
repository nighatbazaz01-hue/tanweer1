export type LeaveType = "sick" | "casual" | "emergency" | "half_day" | "other";
export type LeaveStatus = "pending" | "approved" | "rejected";

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  sick:      "Sick Leave",
  casual:    "Casual Leave",
  emergency: "Emergency Leave",
  half_day:  "Half Day",
  other:     "Other",
};

export interface LeaveRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  remarks?: string;
  gradeGroup?: 1 | 5 | 9;
}

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: "LVR-001",
    teacherId: "TCH-003",
    teacherName: "Dr. Priya Sharma",
    teacherAvatar: "PS",
    leaveType: "sick",
    fromDate: "Jun 17, 2026",
    toDate: "Jun 18, 2026",
    reason: "Recovering from flu — doctor recommends 2 days rest.",
    status: "pending",
    submittedAt: "Jun 14, 2026",
    gradeGroup: 9,
  },
  {
    id: "LVR-002",
    teacherId: "TCH-007",
    teacherName: "Mr. Imran Khan",
    teacherAvatar: "IK",
    leaveType: "casual",
    fromDate: "Jun 20, 2026",
    toDate: "Jun 20, 2026",
    reason: "Family commitment — attending a relative's graduation ceremony.",
    status: "pending",
    submittedAt: "Jun 13, 2026",
    gradeGroup: 9,
  },
  {
    id: "LVR-003",
    teacherId: "TCH-012",
    teacherName: "Ms. Neha Gupta",
    teacherAvatar: "NG",
    leaveType: "emergency",
    fromDate: "Jun 15, 2026",
    toDate: "Jun 15, 2026",
    reason: "Medical emergency — parent hospitalized, needs family support.",
    status: "approved",
    submittedAt: "Jun 14, 2026",
    reviewedAt: "Jun 14, 2026",
    reviewedBy: "Mr. Irfan Wani",
    remarks: "Approved. Please arrange a substitute teacher for Grade 10-A.",
    gradeGroup: 9,
  },
  {
    id: "LVR-004",
    teacherId: "TCH-019",
    teacherName: "Mr. Vikram Singh",
    teacherAvatar: "VS",
    leaveType: "casual",
    fromDate: "Jun 12, 2026",
    toDate: "Jun 12, 2026",
    reason: "Personal administrative matters that cannot be postponed.",
    status: "rejected",
    submittedAt: "Jun 11, 2026",
    reviewedAt: "Jun 11, 2026",
    reviewedBy: "Ms. Rubina Bhat",
    remarks: "Insufficient coverage available on this date. Please reschedule.",
    gradeGroup: 1,
  },
  {
    id: "LVR-005",
    teacherId: "TCH-025",
    teacherName: "Dr. Sunita Rao",
    teacherAvatar: "SR",
    leaveType: "half_day",
    fromDate: "Jun 16, 2026",
    toDate: "Jun 16, 2026",
    reason: "Medical appointment in the morning — will attend from 11am.",
    status: "pending",
    submittedAt: "Jun 13, 2026",
    gradeGroup: 5,
  },
];
