"use client";
import { useState, useMemo } from "react";
import { MapPin, Bus, Users, ChevronDown, ChevronUp, ShieldOff, ArrowLeft, Clock, Check, CheckCircle } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRoleStore } from "@/store/useRoleStore";
import { useDataStore } from "@/store/useDataStore";
import { BUS_ROUTES } from "@/lib/mockData/transport";
import { cn } from "@/lib/utils";

const BUS_COLORS: Record<string, string> = {
  "Bus 01": "bg-blue-100 text-blue-700 border-blue-200",
  "Bus 02": "bg-violet-100 text-violet-700 border-violet-200",
  "Bus 03": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Bus 04": "bg-amber-100 text-amber-700 border-amber-200",
  "Bus 05": "bg-rose-100 text-rose-700 border-rose-200",
  "Bus 06": "bg-sky-100 text-sky-700 border-sky-200",
};

export default function RoutesPage() {
  const { activeRole } = useRoleStore();
  const isAdmin = ["admin", "vp1", "vp2", "vp3"].includes(activeRole);

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader title="Routes" description="Bus route management" breadcrumbs={[{ label: "Transport", href: "/transport" }, { label: "Routes" }]} />
        <Card><CardContent className="py-16 flex flex-col items-center gap-3 text-center">
          <ShieldOff className="h-10 w-10 text-muted-foreground opacity-40" />
          <p className="font-semibold text-muted-foreground">Access Restricted</p>
          <p className="text-sm text-muted-foreground max-w-xs">Route management is available to Admins and Vice Principals only.</p>
        </CardContent></Card>
      </div>
    );
  }

  return <RoutesContent />;
}

function RoutesContent() {
  const { transportRecords, vehicles, assignVehicleToRoute } = useDataStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const busCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    transportRecords.forEach((r) => { counts[r.busNumber] = (counts[r.busNumber] || 0) + 1; });
    return counts;
  }, [transportRecords]);

  const vehicleByRouteCode = useMemo(() => {
    const map: Record<string, typeof vehicles[0]> = {};
    vehicles.forEach((v) => { if (v.routeCode) map[v.routeCode] = v; });
    return map;
  }, [vehicles]);

  const handleAssign = () => {
    if (!assignOpen || !selectedVehicle) return;
    const route = BUS_ROUTES.find((r) => r.routeCode === assignOpen);
    if (!route) return;
    assignVehicleToRoute(route.routeCode, route.bus, selectedVehicle, "Admin");
    showToast(`Vehicle ${selectedVehicle} assigned to ${route.route}`);
    setAssignOpen(null);
    setSelectedVehicle("");
  };

  const totalStudents = transportRecords.length;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />{toast}
        </div>
      )}

      <PageHeader
        title="Route Management"
        description="Bus routes, stops, and student allocation"
        breadcrumbs={[{ label: "Transport", href: "/transport" }, { label: "Routes" }]}
        actions={
          <Link href="/transport">
            <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Transport Hub</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Routes", value: BUS_ROUTES.length },
          { label: "Total Students", value: totalStudents },
          { label: "Avg Per Route", value: Math.round(totalStudents / BUS_ROUTES.length) },
          { label: "Active Vehicles", value: vehicles.filter((v) => v.status === "active").length },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {BUS_ROUTES.map((route) => {
          const studentCount = busCounts[route.bus] || 0;
          const vehicle = vehicleByRouteCode[route.routeCode];
          const capacity = vehicle?.capacity ?? 50;
          const utilization = Math.round((studentCount / capacity) * 100);
          const isExpanded = expanded === route.routeCode;
          const students = transportRecords.filter((r) => r.busNumber === route.bus);

          return (
            <Card key={route.routeCode} className={cn("transition-all", isExpanded && "shadow-md")}>
              <CardContent className="p-0">
                <button
                  className="w-full text-left p-4 flex items-start gap-4"
                  onClick={() => setExpanded(isExpanded ? null : route.routeCode)}
                >
                  <Badge className={cn("text-xs font-bold shrink-0 mt-0.5", BUS_COLORS[route.bus])}>{route.bus}</Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{route.route}</p>
                      <Badge variant="outline" className="text-xs">{route.routeCode}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{studentCount} students</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{route.stops.length} stops</span>
                      {vehicle && <span className="flex items-center gap-1"><Bus className="h-3 w-3" />{vehicle.registrationNumber} ({vehicle.vehicleType})</span>}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className={cn("h-full rounded-full", utilization >= 90 ? "bg-red-500" : utilization >= 70 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.min(100, utilization)}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{utilization}% full</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={(e) => { e.stopPropagation(); setAssignOpen(route.routeCode); setSelectedVehicle(vehicle?.registrationNumber ?? ""); }}>
                      Assign Vehicle
                    </Button>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t px-4 pb-4 pt-3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Stops & Times</p>
                        <div className="space-y-2">
                          {route.stops.map((stop, i) => (
                            <div key={stop} className="flex items-center gap-3 text-sm">
                              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{stop}</p>
                                <div className="flex gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Pick: {route.pickupTimes[i]}</span>
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Drop: {route.dropTimes[i]}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Vehicle Info</p>
                        {vehicle ? (
                          <div className="rounded-lg border p-3 space-y-1.5 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground text-xs">Registration</span><span className="font-semibold text-xs">{vehicle.registrationNumber}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground text-xs">Type</span><span className="font-semibold text-xs">{vehicle.vehicleType}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground text-xs">Capacity</span><span className="font-semibold text-xs">{vehicle.capacity} seats</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground text-xs">Driver</span><span className="font-semibold text-xs">{vehicle.driverName}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground text-xs">Conductor</span><span className="font-semibold text-xs">{vehicle.conductorName}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground text-xs">Status</span>
                              <Badge className={cn("text-xs", vehicle.status === "active" ? "bg-emerald-100 text-emerald-700" : vehicle.status === "maintenance" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700")}>{vehicle.status}</Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-lg border p-3 text-sm text-muted-foreground text-center">No vehicle assigned</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Students ({students.length})</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {students.map((s) => (
                          <div key={s.id} className="flex items-center gap-2 rounded-lg border px-3 py-2">
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarFallback className="text-xs">{s.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate">{s.studentName}</p>
                              <p className="text-xs text-muted-foreground">Grade {s.grade}-{s.section} · {s.stopLocation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!assignOpen} onOpenChange={(o) => !o && setAssignOpen(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Bus className="h-5 w-5 text-primary" />Assign Vehicle</DialogTitle></DialogHeader>
          <div className="py-3 space-y-3">
            <p className="text-sm text-muted-foreground">Select a vehicle to assign to route <strong>{BUS_ROUTES.find((r) => r.routeCode === assignOpen)?.route}</strong>:</p>
            <div className="space-y-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.registrationNumber)}
                  className={cn("w-full text-left rounded-lg border px-3 py-2.5 flex items-center justify-between transition-all", selectedVehicle === v.registrationNumber ? "border-primary bg-primary/5" : "hover:border-primary/50")}
                >
                  <div>
                    <p className="text-sm font-semibold">{v.registrationNumber}</p>
                    <p className="text-xs text-muted-foreground">{v.vehicleType} · {v.capacity} seats · {v.driverName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", v.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>{v.status}</Badge>
                    {selectedVehicle === v.registrationNumber && <Check className="h-4 w-4 text-primary" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(null)}>Cancel</Button>
            <Button onClick={handleAssign} disabled={!selectedVehicle}>Assign Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
