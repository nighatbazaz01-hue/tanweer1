import { Sidebar } from "@/components/common/Sidebar";
import { Topbar } from "@/components/common/Topbar";
import { AIDrawer } from "@/components/common/AIDrawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <AIDrawer />
    </div>
  );
}
