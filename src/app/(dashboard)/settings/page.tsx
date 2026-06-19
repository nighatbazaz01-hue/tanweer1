"use client";
import { useState } from "react";
import { Settings, School, Bell, Shield, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/useAuthStore";
import { useRoleStore } from "@/store/useRoleStore";
import { useDataStore } from "@/store/useDataStore";
import { cn } from "@/lib/utils";

const defaultPrefs = [
  { id: "fee_alerts", label: "Email alerts for overdue fees", enabled: true },
  { id: "attendance", label: "Daily attendance summary", enabled: true },
  { id: "admission", label: "New admission lead notifications", enabled: false },
  { id: "ai_insights", label: "AI insight alerts", enabled: true },
];

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { setRole } = useRoleStore();

  const { schoolConfig, updateSchoolConfig } = useDataStore();
  const [schoolName, setSchoolName] = useState(schoolConfig.name);
  const [address, setAddress]       = useState(schoolConfig.address);
  const [email, setEmail]           = useState(schoolConfig.email);
  const [phone, setPhone]           = useState(schoolConfig.phone);
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    updateSchoolConfig({ name: schoolName, address, email, phone });
    showToast("School information saved successfully!");
  };

  const handleToggle = (id: string) => {
    setPrefs((prev) => prev.map((p) => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const handleChangePassword = () => showToast("A password reset link has been sent to your email.");
  const handleEnable2FA = () => showToast("Two-factor authentication setup initiated. Check your email.");

  const handleLogout = () => {
    logout();
    setRole("admin");
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-xs">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span className="text-sm">{toast}</span>
        </div>
      )}

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
                <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">School ID</label>
                <Input defaultValue="SCH-2024-001" disabled />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Address</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Contact Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Phone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <Button size="sm" onClick={handleSave}>Save Changes</Button>
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
          <CardContent className="space-y-1">
            {prefs.map((pref) => (
              <div key={pref.id} className="flex items-center justify-between py-2.5 border-b last:border-0">
                <p className="text-sm">{pref.label}</p>
                <button
                  onClick={() => handleToggle(pref.id)}
                  className={cn(
                    "h-5 w-9 rounded-full relative transition-colors duration-200 focus:outline-none",
                    pref.enabled ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 h-3 w-3 rounded-full bg-white shadow transition-transform duration-200",
                    pref.enabled ? "translate-x-5" : "translate-x-1"
                  )} />
                </button>
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
            <Button variant="outline" size="sm" className="w-full" onClick={handleChangePassword}>
              Change Password
            </Button>
            <Button variant="outline" size="sm" className="w-full" onClick={handleEnable2FA}>
              Enable Two-Factor Authentication
            </Button>
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
