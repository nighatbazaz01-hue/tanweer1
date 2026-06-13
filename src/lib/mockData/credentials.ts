import type { AppRole } from "@/store/useRoleStore";
import type { UserRole } from "@/store/useAuthStore";

export interface MockCredential {
  id: string;
  email: string;
  password: string;
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
    name: "Dr. Khalid Al-Mansouri",
    role: "school_admin",
    appRole: "admin",
    schoolId: "school-1",
    schoolName: "Al-Noor Academy",
    targetRoute: "/admin",
  },
  {
    id: "user-vp1",
    email: "vp1@school.edu",
    password: "VP1pass!",
    name: "Dr. Khalid Al-Otaibi",
    role: "school_admin",
    appRole: "vp1",
    schoolId: "school-1",
    schoolName: "Al-Noor Academy",
    targetRoute: "/vp",
  },
  {
    id: "user-vp2",
    email: "vp2@school.edu",
    password: "VP2pass!",
    name: "Ms. Nora Al-Zahrani",
    role: "school_admin",
    appRole: "vp2",
    schoolId: "school-1",
    schoolName: "Al-Noor Academy",
    targetRoute: "/vp",
  },
  {
    id: "user-vp3",
    email: "vp3@school.edu",
    password: "VP3pass!",
    name: "Mr. Faris Al-Mutairi",
    role: "school_admin",
    appRole: "vp3",
    schoolId: "school-1",
    schoolName: "Al-Noor Academy",
    targetRoute: "/vp",
  },
  {
    id: "user-teacher",
    email: "teacher@school.edu",
    password: "Teacher123!",
    name: "Dr. Sarah Al-Hamdan",
    role: "teacher",
    appRole: "teacher",
    schoolId: "school-1",
    schoolName: "Al-Noor Academy",
    targetRoute: "/teacher",
  },
  {
    id: "user-parent",
    email: "parent@school.edu",
    password: "Parent123!",
    name: "Mohammed Al-Rashidi",
    role: "parent",
    appRole: "parent",
    schoolId: "school-1",
    schoolName: "Al-Noor Academy",
    targetRoute: "/parent",
  },
  {
    id: "user-student",
    email: "student@school.edu",
    password: "Student123!",
    name: "Ahmed Al-Rashidi",
    role: "student",
    appRole: "student",
    schoolId: "school-1",
    schoolName: "Al-Noor Academy",
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
