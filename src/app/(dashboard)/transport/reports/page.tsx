"use client";
import { useState, useMemo } from "react";
import { BarChart2, Bus, Users, Download, ShieldOff, ArrowLeft, Search, CheckCircle } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoleStore } from "@/store/useRoleStore";
import { useDataStore } from "@/store/useDataStore";
import { BUS_ROUTES } from "@/lib/mockData/transport";
import { cn } from "@/lib/utils";

const TABS = ["Route Utilization", "Vehicle Report", "Student Transport"] as const;
type TabLabel = typeof TABS[number];

const BUS_COLORS: Record<string, string> = {
  "Bus 01": "bg-blue-100 text-blue-700",
  "Bus 02": "bg-violet-100 text-violet-700",
  "Bus 03": "bg-emerald-100 text-emerald-700",
  "Bus 04": "bg-amber-100 text-amber-700",
  "Bus 05": "bg-rose-100 text-rose-700",
  "Bus 06": "bg-sky-100 text-sky-700",
};

export default function TransportReportsPage() {
  const { activeRole } = useRoleStore();
  const isAdmin = ["admin", "vp1", "vp2", "vp3"].includes(activeRole);

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader title="Transport Reports" description="Fleet and route reports" breadcrumbs={[{ label: "Transport", href: "/transport" }, { label: "Reports" }]} />
        <Card><CardContent className="py-16 flex flex-col items-center gap-3 text-center">
          <ShieldOff className="h-10 w-10 text-muted-foreground opacity-40" />
          <p className="font-semibold text-muted-foreground">Access Restricted</p>
          <p className="text-sm text-muted-foreground max-w-xs">Transport reports are available to Admins and Vice Principals only.</p>
        </CardContent></Card>
      </div>
    );
  }

  return <ReportsContent />;
}

function ReportsContent() {
  const { transportRecords, vehicles } = useDataStore();
  const [activeTab, setActiveTab] = useState<TabLabel>("Route Utilization");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const busCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    transportRecords.forEach((r) => { counts[r.busNumber] = (counts[r.busNumber] || 0) + 1; });
    return counts;
  }, [transportRecords]);

  const vehicleByBus = useMemo(() => {
    const map: Record<string, typeof vehicles[0]> = {};
    vehicles.forEach((v) => { map[v.busNumber] = v; });
    return map;
  }, [vehicles]);

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return transportRecords;
    const q = search.toLowerCase();
    return transportRecords.filter((r) =>
      r.studentName.toLowerCase().includes(q) ||
      r.busNumber.toLowerCase().includes(q) ||
      r.route.toLowerCase().includes(q) ||
      r.stopLocation.toLowerCase().includes(q) ||
      String(r.grade).includes(q)
    );
  }, [transportRecords, search]);

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />{toast}
        </div>
      )}

      <PageHeader
        title="Transport Reports"
        description="Route utilization, vehicle status, and student transport reports"
        breadcrumbs={[{ label: "Transport", href: "/transport" }, { label: "Reports" }]}
        actions={
          <div className="flex gap-2">
            <Link href="/transport"><Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Transport Hub</Button></Link>
            <Button size="sm" variant="outline" className="gap-2" onClick={() => showToast(`${activeTab} exported successfully (CSV)`)}>
              <Download className="h-4 w-4" />Export
            </Button>
          </div>
        }
      />

      <div className="flex gap-2 border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px", activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Route Utilization" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Routes</p><p className="text-2xl font-bold">{BUS_ROUTES.length}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Students</p><p className="text-2xl font-bold">{transportRecords.length}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Avg Utilization</p>
              <p className="text-2xl font-bold">
                {Math.round(BUS_ROUTES.reduce((s, r) => {
                  const v = vehicleByBus[r.bus];
                  const cap = v?.capacity ?? 50;
                  return s + ((busCounts[r.bus] || 0) / cap) * 100;
                }, 0) / BUS_ROUTES.length)}%
              </p>
            </CardContent></Card>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Route Utilization Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="text-left py-2 pr-4">Bus</th>
                      <th className="text-left py-2 pr-4">Route</th>
                      <th className="text-left py-2 pr-4">Code</th>
                      <th className="text-right py-2 pr-4">Capacity</th>
                      <th className="text-right py-2 pr-4">Assigned</th>
                      <th className="text-left py-2">Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BUS_ROUTES.map((route) => {
                      const count = busCounts[route.bus] || 0;
                      const vehicle = vehicleByBus[route.bus];
                      const cap = vehicle?.capacity ?? 50;
                      const util = Math.round((count / cap) * 100);
                      return (
                        <tr key={route.routeCode} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="py-3 pr-4"><Badge className={cn("text-xs", BUS_COLORS[route.bus])}>{route.bus}</Badge></td>
                          <td className="py-3 pr-4 text-xs font-medium">{route.route}</td>
                          <td className="py-3 pr-4 text-xs text-muted-foreground">{route.routeCode}</td>
                          <td className="py-3 pr-4 text-right text-xs">{cap}</td>
                          <td className="py-3 pr-4 text-right text-xs font-semibold">{count}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                                <div className={cn("h-full rounded-full", util >= 90 ? "bg-red-500" : util >= 70 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.min(100, util)}%` }} />
                              </div>
                              <span className={cn("text-xs font-medium", util >= 90 ? "text-red-600" : util >= 70 ? "text-amber-600" : "text-emerald-600")}>{util}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "Vehicle Report" && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Fleet Status Report</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="text-left py-2 pr-4">Bus</th>
                    <th className="text-left py-2 pr-4">Registration</th>
                    <th className="text-left py-2 pr-4">Type</th>
                    <th className="text-right py-2 pr-4">Capacity</th>
                    <th className="text-left py-2 pr-4">Status</th>
                    <th className="text-left py-2 pr-4">Insurance</th>
                    <th className="text-left py-2 pr-4">Fitness</th>
                    <th className="text-left py-2">Pollution</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-3 pr-4"><Badge className={cn("text-xs", BUS_COLORS[v.busNumber])}>{v.busNumber}</Badge></td>
                      <td className="py-3 pr-4 text-xs font-medium">{v.registrationNumber}</td>
                      <td className="py-3 pr-4 text-xs">{v.vehicleType}</td>
                      <td className="py-3 pr-4 text-right text-xs">{v.capacity}</td>
                      <td className="py-3 pr-4">
                        <Badge className={cn("text-xs", v.status === "active" ? "bg-emerald-100 text-emerald-700" : v.status === "maintenance" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700")}>{v.status}</Badge>
                      </td>
                      <td className="py-3 pr-4 text-xs">{v.insuranceExpiry}</td>
                      <td className="py-3 pr-4 text-xs">{v.fitnessExpiry}</td>
                      <td className="py-3 text-xs">{v.pollutionExpiry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "Student Transport" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search student, bus, route, stop..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
            </div>
            <p className="text-sm text-muted-foreground">{filteredStudents.length.toLocaleString()} records</p>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background border-b">
                    <tr className="text-xs text-muted-foreground">
                      <th className="text-left py-2 px-4">Student</th>
                      <th className="text-left py-2 pr-4">Grade</th>
                      <th className="text-left py-2 pr-4">Bus</th>
                      <th className="text-left py-2 pr-4">Route</th>
                      <th className="text-left py-2 pr-4">Pickup Stop</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.slice(0, 200).map((r) => (
                      <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-2 px-4">
                          <p className="font-medium text-xs">{r.studentName}</p>
                          <p className="text-xs text-muted-foreground">{r.studentId}</p>
                        </td>
                        <td className="py-2 pr-4 text-xs">G{r.grade}-{r.section}</td>
                        <td className="py-2 pr-4"><Badge className={cn("text-xs", BUS_COLORS[r.busNumber])}>{r.busNumber}</Badge></td>
                        <td className="py-2 pr-4 text-xs text-muted-foreground max-w-[160px] truncate">{r.route}</td>
                        <td className="py-2 pr-4 text-xs">{r.stopLocation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredStudents.length > 200 && (
                  <div className="text-center py-3 text-xs text-muted-foreground border-t">Showing first 200 of {filteredStudents.length} — use search to filter</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
