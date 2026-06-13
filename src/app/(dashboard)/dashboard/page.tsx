"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/store/useRoleStore";

const roleRoutes = {
  admin: "/admin",
  teacher: "/teacher",
  parent: "/parent",
  student: "/student-view",
};

export default function DashboardPage() {
  const { activeRole } = useRoleStore();
  const router = useRouter();
  useEffect(() => {
    router.replace(roleRoutes[activeRole]);
  }, [activeRole, router]);
  return null;
}
