import type { AppRole } from "@/store/useRoleStore";
import type { UserRole } from "@/store/useAuthStore";

export interface MockCredential {
  id: string;
  email: string;
  password: string;
  pin?: string;
  name: string;
  role: UserRole;
  appRole: AppRole;
  schoolId: string;
  schoolName: string;
  targetRoute: string;
}

export const MOCK_CREDENTIALS: MockCredential[] = [
  {
    id: "user-admin",
    email: "admin@school.edu",
    password: "Admin123!",
    pin: "1234",
    name: "Dr. Mushtaq Ahmed",
    role: "school_admin",
    appRole: "admin",
    schoolId: "school-1",
    schoolName: "Foundation School Humhama",
    targetRoute: "/admin",
  },
  {
    id: "user-vp1",
    email: "vp1@school.edu",
    password: "VP1pass!",
    pin: "5678",
    name: "Mr. Irfan Wani",
    role: "school_admin",
    appRole: "vp1",
    schoolId: "school-1",
    schoolName: "Foundation School Humhama",
    targetRoute: "/vp",
  },
  {
    id: "user-vp2",
    email: "vp2@school.edu",
    password: "VP2pass!",
    pin: "9012",
    name: "Ms. Rubina Bhat",
    role: "school_admin",
    appRole: "vp2",
    schoolId: "school-1",
    schoolName: "Foundation School Humhama",
    targetRoute: "/vp",
  },
  {
    id: "user-vp3",
    email: "vp3@school.edu",
    password: "VP3pass!",
    pin: "3456",
    name: "Mr. Bilal Khan",
    role: "school_admin",
    appRole: "vp3",
    schoolId: "school-1",
    schoolName: "Foundation School Humhama",
    targetRoute: "/vp",
  },
  {
    id: "user-teacher",
    email: "teacher@school.edu",
    password: "Teacher123!",
    name: "Dr. Priya Sharma",
    role: "teacher",
    appRole: "teacher",
    schoolId: "school-1",
    schoolName: "Foundation School Humhama",
    targetRoute: "/teacher",
  },
  {
    id: "user-parent",
    email: "parent@school.edu",
    password: "Parent123!",
    name: "Arjun Sharma",
    role: "parent",
    appRole: "parent",
    schoolId: "school-1",
    schoolName: "Foundation School Humhama",
    targetRoute: "/parent",
  },
  {
    id: "user-student",
    email: "student@school.edu",
    password: "Student123!",
    name: "Aarav Sharma",
    role: "student",
    appRole: "student",
    schoolId: "school-1",
    schoolName: "Foundation School Humhama",
    targetRoute: "/student-view",
  },
];

export function findCredential(email: string, password: string): MockCredential | null {
  return (
    MOCK_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    ) ?? null
  );
}

export function getPinForRole(appRole: AppRole): string | undefined {
  return MOCK_CREDENTIALS.find((c) => c.appRole === appRole)?.pin;
}
