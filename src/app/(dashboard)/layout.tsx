import { Sidebar } from "@/components/common/Sidebar";
import { Topbar } from "@/components/common/Topbar";
import { AIDrawer } from "@/components/common/AIDrawer";
import { StartupValidator } from "@/components/common/StartupValidator";
import { WelcomePanel } from "@/components/common/WelcomePanel";
import { AuthGuard } from "@/components/common/AuthGuard";
import { RouteGuard } from "@/components/common/RouteGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">
            <WelcomePanel />
            <RouteGuard>
              {children}
            </RouteGuard>
          </main>
        </div>
        <AIDrawer />
        <StartupValidator />
      </div>
    </AuthGuard>
  );
}
