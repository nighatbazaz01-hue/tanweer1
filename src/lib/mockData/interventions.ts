/**
 * Interventions mock data — Tanweer Platform Phase 6
 * All records reference real student IDs from population store.
 */

export type InterventionType =
  | "Academic Support"
  | "Attendance Concern"
  | "Wellbeing Support"
  | "Behaviour Support"
  | "Parent Meeting"
  | "Leadership Development"
  | "Health Follow-Up"
  | "Counselling";

export type InterventionStatus =
  | "Open"
  | "In Progress"
  | "Pending Parent"
  | "Completed"
  | "Escalated";

export type InterventionPriority = "Low" | "Medium" | "High" | "Critical";

export interface InterventionNote {
  id: string;
  author: string;
  authorRole: string;
  body: string;
  timestamp: string;
}

export interface Intervention {
  id: string;
  studentId: string;
  studentName: string;
  studentGrade: number;
  studentSection: string;
  type: InterventionType;
  title: string;
  description: string;
  priority: InterventionPriority;
  status: InterventionStatus;
  responsibleStaff: string;
  createdBy: string;
  createdByRole: string;
  createdAt: string;
  dueDate: string;
  notes: InterventionNote[];
  parentAcknowledged: boolean;
  parentComment?: string;
  meetingRequested: boolean;
  updatedAt: string;
}

export const initialInterventions: Intervention[] = [
  {
    id: "INT-001",
    studentId: "STU-0451",
    studentName: "Aarav Sharma",
    studentGrade: 10,
    studentSection: "A",
    type: "Academic Support",
    title: "Mathematics Performance Decline",
    description: "Student has shown a 12-point drop in Mathematics over the last two assessments. Requires structured revision plan and additional support sessions.",
    priority: "High",
    status: "In Progress",
    responsibleStaff: "Dr. Priya Sharma",
    createdBy: "Dr. Priya Sharma",
    createdByRole: "teacher",
    createdAt: "Jun 5, 2026",
    dueDate: "Jun 30, 2026",
    notes: [
      {
        id: "NOTE-001",
        author: "Dr. Priya Sharma",
        authorRole: "Teacher",
        body: "Initiated extra support sessions on Tuesdays and Thursdays. Student is responsive but needs consistent reinforcement.",
        timestamp: "Jun 6, 2026",
      },
      {
        id: "NOTE-002",
        author: "Mr. Bilal Khan",
        authorRole: "VP",
        body: "Reviewed intervention plan. Approved additional resource allocation. Please update progress by Jun 20.",
        timestamp: "Jun 8, 2026",
      },
    ],
    parentAcknowledged: true,
    parentComment: "We are supporting Aarav at home with daily revision. Thank you for the update.",
    meetingRequested: false,
    updatedAt: "Jun 8, 2026",
  },
  {
    id: "INT-002",
    studentId: "STU-0452",
    studentName: "Fatima Bhat",
    studentGrade: 10,
    studentSection: "A",
    type: "Attendance Concern",
    title: "Irregular Attendance — 7 Absences in 3 Weeks",
    description: "Student has been absent 7 times in the last 3 weeks without adequate explanation. Risk of falling below 75% attendance threshold.",
    priority: "Critical",
    status: "Pending Parent",
    responsibleStaff: "Dr. Priya Sharma",
    createdBy: "Dr. Priya Sharma",
    createdByRole: "teacher",
    createdAt: "Jun 3, 2026",
    dueDate: "Jun 20, 2026",
    notes: [
      {
        id: "NOTE-003",
        author: "Dr. Priya Sharma",
        authorRole: "Teacher",
        body: "Parent has been notified via message. Awaiting response. Will escalate to VP if no response by Jun 10.",
        timestamp: "Jun 4, 2026",
      },
    ],
    parentAcknowledged: false,
    meetingRequested: true,
    updatedAt: "Jun 4, 2026",
  },
  {
    id: "INT-003",
    studentId: "STU-0455",
    studentName: "Omar Wani",
    studentGrade: 10,
    studentSection: "A",
    type: "Wellbeing Support",
    title: "Social Withdrawal and Reduced Engagement",
    description: "Student has become increasingly withdrawn over the past month. Participation in class has dropped significantly. Peer interactions appear strained.",
    priority: "Medium",
    status: "Open",
    responsibleStaff: "Dr. Priya Sharma",
    createdBy: "Dr. Priya Sharma",
    createdByRole: "teacher",
    createdAt: "Jun 10, 2026",
    dueDate: "Jul 5, 2026",
    notes: [],
    parentAcknowledged: false,
    meetingRequested: false,
    updatedAt: "Jun 10, 2026",
  },
  {
    id: "INT-004",
    studentId: "STU-0458",
    studentName: "Hassan Koul",
    studentGrade: 10,
    studentSection: "A",
    type: "Parent Meeting",
    title: "Parent Engagement — Academic Progress Review",
    description: "Parent meeting scheduled to discuss overall academic progress, attendance trends, and upcoming exam preparation strategy.",
    priority: "Low",
    status: "Completed",
    responsibleStaff: "Dr. Priya Sharma",
    createdBy: "Dr. Priya Sharma",
    createdByRole: "teacher",
    createdAt: "May 28, 2026",
    dueDate: "Jun 5, 2026",
    notes: [
      {
        id: "NOTE-004",
        author: "Dr. Priya Sharma",
        authorRole: "Teacher",
        body: "Meeting completed successfully. Parents are engaged and supportive. Agreed on daily study schedule.",
        timestamp: "Jun 4, 2026",
      },
    ],
    parentAcknowledged: true,
    parentComment: "The meeting was very helpful. We have a clear plan now.",
    meetingRequested: false,
    updatedAt: "Jun 4, 2026",
  },
  {
    id: "INT-005",
    studentId: "STU-0001",
    studentName: "Aarav Sharma",
    studentGrade: 1,
    studentSection: "A",
    type: "Behaviour Support",
    title: "Classroom Disruption — Repeated Incidents",
    description: "Student has been involved in 3 classroom disruption incidents this week. Behaviour plan needs to be implemented with parental cooperation.",
    priority: "High",
    status: "Escalated",
    responsibleStaff: "Mr. Irfan Wani",
    createdBy: "Ms. Neha Gupta",
    createdByRole: "teacher",
    createdAt: "Jun 9, 2026",
    dueDate: "Jun 18, 2026",
    notes: [
      {
        id: "NOTE-005",
        author: "Ms. Neha Gupta",
        authorRole: "Teacher",
        body: "Escalated to VP after parent did not respond to initial contact.",
        timestamp: "Jun 11, 2026",
      },
      {
        id: "NOTE-006",
        author: "Mr. Irfan Wani",
        authorRole: "VP",
        body: "VP review initiated. Parent meeting scheduled for Jun 14. Behaviour support plan to be formalised.",
        timestamp: "Jun 12, 2026",
      },
    ],
    parentAcknowledged: false,
    meetingRequested: true,
    updatedAt: "Jun 12, 2026",
  },
  {
    id: "INT-006",
    studentId: "STU-0201",
    studentName: "Riya Shah",
    studentGrade: 5,
    studentSection: "A",
    type: "Counselling",
    title: "Exam Anxiety — Counselling Referral",
    description: "Student has expressed significant exam anxiety. Referred to school counsellor for structured support sessions prior to mid-term exams.",
    priority: "Medium",
    status: "In Progress",
    responsibleStaff: "Ms. Rubina Bhat",
    createdBy: "Mr. Ravi Sharma",
    createdByRole: "teacher",
    createdAt: "Jun 7, 2026",
    dueDate: "Jun 25, 2026",
    notes: [
      {
        id: "NOTE-007",
        author: "Mr. Ravi Sharma",
        authorRole: "Teacher",
        body: "Two counselling sessions completed. Student is showing improvement in confidence.",
        timestamp: "Jun 13, 2026",
      },
    ],
    parentAcknowledged: true,
    meetingRequested: false,
    updatedAt: "Jun 13, 2026",
  },
  {
    id: "INT-007",
    studentId: "STU-0453",
    studentName: "Ali Dar",
    studentGrade: 10,
    studentSection: "A",
    type: "Leadership Development",
    title: "Leadership Mentoring — Student Council Candidate",
    description: "Student shows exceptional leadership potential. Enrolling in leadership mentoring track and student council preparation programme.",
    priority: "Low",
    status: "In Progress",
    responsibleStaff: "Dr. Priya Sharma",
    createdBy: "Dr. Priya Sharma",
    createdByRole: "teacher",
    createdAt: "Jun 1, 2026",
    dueDate: "Jul 15, 2026",
    notes: [
      {
        id: "NOTE-008",
        author: "Dr. Priya Sharma",
        authorRole: "Teacher",
        body: "First mentoring session completed. Student is enthusiastic and prepared a strong proposal.",
        timestamp: "Jun 8, 2026",
      },
    ],
    parentAcknowledged: true,
    parentComment: "Very happy about this opportunity for our child.",
    meetingRequested: false,
    updatedAt: "Jun 8, 2026",
  },
];
