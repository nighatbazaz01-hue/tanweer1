"use client";
import { Settings, School, Bell, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/useAuthStore";
import { useRoleStore } from "@/store/useRoleStore";

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { setRole } = useRoleStore();

  const handleLogout = () => {
    logout();
    setRole("admin");
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage school configuration, preferences, and system settings"
        breadcrumbs={[{ label: "Home" }, { label: "Settings" }]}
      />

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">School Information</CardTitle>
            </div>
            <CardDescription>Update your school&apos;s basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">School Name</label>
                <Input defaultValue="Al-Noor Academy" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">School ID</label>
                <Input defaultValue="SCH-2024-001" disabled />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Address</label>
              <Input defaultValue="123 Education District, Riyadh, Saudi Arabia" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Contact Email</label>
                <Input defaultValue="admin@alnoor.edu.sa" type="email" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Phone</label>
                <Input defaultValue="+966 11 123 4567" />
              </div>
            </div>
            <Button size="sm">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Notifications</CardTitle>
            </div>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Email alerts for overdue fees",
              "Daily attendance summary",
              "New admission lead notifications",
              "AI insight alerts",
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <p className="text-sm">{item}</p>
                <div className="h-5 w-9 rounded-full bg-primary cursor-pointer relative">
                  <div className="absolute right-1 top-1 h-3 w-3 rounded-full bg-white" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" className="w-full">Change Password</Button>
            <Button variant="outline" size="sm" className="w-full">Enable Two-Factor Authentication</Button>
            <Separator />
            <Button variant="destructive" size="sm" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
