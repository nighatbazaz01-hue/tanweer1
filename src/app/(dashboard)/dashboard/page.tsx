"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useRoleStore } from "@/store/useRoleStore";

const roleRoutes: Record<string, string> = {
  admin: "/admin",
  vp1: "/vp",
  vp2: "/vp",
  vp3: "/vp",
  teacher: "/teacher",
  parent: "/parent",
  student: "/student-view",
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { activeRole } = useRoleStore();
  const router = useRouter();

  useEffect(() => {
    const role = user?.appRole ?? activeRole;
    router.replace(roleRoutes[role] ?? "/admin");
  }, [user, activeRole, router]);

  return null;
}
