"use client";
import { useState } from "react";
import { Bus, Plus, Edit2, ShieldOff, CheckCircle, Wrench, XCircle, ArrowLeft, Fuel, Hash } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRoleStore } from "@/store/useRoleStore";
import { useDataStore } from "@/store/useDataStore";
import type { VehicleRecord, VehicleStatus, VehicleType, FuelType } from "@/lib/mockData/transport";
import { cn } from "@/lib/utils";

const statusConfig: Record<VehicleStatus, { label: string; cls: string; icon: React.ElementType }> = {
  active:      { label: "Active",      cls: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  maintenance: { label: "Maintenance", cls: "bg-amber-100 text-amber-700",   icon: Wrench },
  inactive:    { label: "Inactive",    cls: "bg-red-100 text-red-700",        icon: XCircle },
};

const BUS_COLORS: Record<string, string> = {
  "Bus 01": "bg-blue-100 text-blue-700",
  "Bus 02": "bg-violet-100 text-violet-700",
  "Bus 03": "bg-emerald-100 text-emerald-700",
  "Bus 04": "bg-amber-100 text-amber-700",
  "Bus 05": "bg-rose-100 text-rose-700",
  "Bus 06": "bg-sky-100 text-sky-700",
};

const BLANK: Omit<VehicleRecord, "id"> = {
  busNumber: "Bus 01", vehicleType: "Coach", capacity: 50, fuelType: "Diesel",
  registrationNumber: "", insuranceExpiry: "", fitnessExpiry: "", pollutionExpiry: "",
  status: "active", driverName: "", conductorName: "", routeCode: "RT-01",
};

export default function VehiclesPage() {
  const { activeRole } = useRoleStore();
  const isAdmin = activeRole === "admin" || activeRole === "vp1" || activeRole === "vp2" || activeRole === "vp3";

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader title="Vehicles" description="Fleet management" breadcrumbs={[{ label: "Transport", href: "/transport" }, { label: "Vehicles" }]} />
        <Card><CardContent className="py-16 flex flex-col items-center gap-3 text-center">
          <ShieldOff className="h-10 w-10 text-muted-foreground opacity-40" />
          <p className="font-semibold text-muted-foreground">Access Restricted</p>
          <p className="text-sm text-muted-foreground max-w-xs">Vehicle management is available to Admins and Vice Principals only.</p>
        </CardContent></Card>
      </div>
    );
  }

  return <VehiclesContent />;
}

function VehiclesContent() {
  const { vehicles, addVehicle, updateVehicle, transportRecords } = useDataStore();
  const [addOpen, setAddOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<VehicleRecord | null>(null);
  const [form, setForm] = useState<Omit<VehicleRecord, "id">>(BLANK);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const busCounts: Record<string, number> = {};
  transportRecords.forEach((r) => { busCounts[r.busNumber] = (busCounts[r.busNumber] || 0) + 1; });

  const totalCapacity = vehicles.reduce((s, v) => s + v.capacity, 0);
  const active = vehicles.filter((v) => v.status === "active").length;
  const maintenance = vehicles.filter((v) => v.status === "maintenance").length;
  const inactive = vehicles.filter((v) => v.status === "inactive").length;

  const openAdd = () => { setForm(BLANK); setAddOpen(true); };
  const openEdit = (v: VehicleRecord) => { setForm({ ...v }); setEditVehicle(v); };

  const handleAdd = () => {
    if (!form.registrationNumber.trim() || !form.driverName.trim()) return;
    addVehicle(form, "Admin");
    setAddOpen(false);
    showToast(`Vehicle ${form.registrationNumber} added successfully!`);
  };

  const handleEdit = () => {
    if (!editVehicle) return;
    updateVehicle(editVehicle.id, form, "Admin");
    setEditVehicle(null);
    showToast(`Vehicle ${form.registrationNumber} updated successfully!`);
  };

  const f = (field: keyof Omit<VehicleRecord, "id">, val: string | number) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />{toast}
        </div>
      )}

      <PageHeader
        title="Vehicle Management"
        description="Fleet status, registration, and driver assignments"
        breadcrumbs={[{ label: "Transport", href: "/transport" }, { label: "Vehicles" }]}
        actions={
          <div className="flex gap-2">
            <Link href="/transport"><Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Transport Hub</Button></Link>
            <Button size="sm" className="gap-2" onClick={openAdd}><Plus className="h-4 w-4" />Add Vehicle</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Vehicles", value: vehicles.length, color: "blue" },
          { label: "Active", value: active, color: "emerald" },
          { label: "Maintenance", value: maintenance, color: "amber" },
          { label: "Total Capacity", value: `${totalCapacity} seats`, color: "purple" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {vehicles.map((v) => {
          const sCfg = statusConfig[v.status];
          const Icon = sCfg.icon;
          const studentCount = busCounts[v.busNumber] || 0;
          const utilization = Math.round((studentCount / v.capacity) * 100);
          return (
            <Card key={v.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs font-bold", BUS_COLORS[v.busNumber])}>{v.busNumber}</Badge>
                    <Badge className={cn("text-xs", sCfg.cls)}><Icon className="h-3 w-3 mr-1" />{sCfg.label}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(v)} className="h-7 px-2">
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Registration</p>
                    <p className="font-semibold text-xs">{v.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-semibold text-xs">{v.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Capacity</p>
                    <p className="font-semibold text-xs">{v.capacity} seats</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fuel</p>
                    <p className="font-semibold text-xs flex items-center gap-1"><Fuel className="h-3 w-3" />{v.fuelType}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Driver</p>
                    <p className="font-semibold text-xs">{v.driverName}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Conductor</p>
                    <p className="font-semibold text-xs">{v.conductorName}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Seat Utilization</span>
                    <span className="font-medium">{studentCount}/{v.capacity} ({utilization}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full", utilization >= 90 ? "bg-red-500" : utilization >= 70 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.min(100, utilization)}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground border-t pt-2">
                  <div><p className="text-[10px]">Insurance</p><p className="font-medium text-[11px]">{v.insuranceExpiry}</p></div>
                  <div><p className="text-[10px]">Fitness</p><p className="font-medium text-[11px]">{v.fitnessExpiry}</p></div>
                  <div><p className="text-[10px]">Pollution</p><p className="font-medium text-[11px]">{v.pollutionExpiry}</p></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <VehicleDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Vehicle"
        form={form}
        onChange={f}
        onSubmit={handleAdd}
        submitLabel="Add Vehicle"
      />

      <VehicleDialog
        open={!!editVehicle}
        onOpenChange={(o) => !o && setEditVehicle(null)}
        title="Edit Vehicle"
        form={form}
        onChange={f}
        onSubmit={handleEdit}
        submitLabel="Save Changes"
      />
    </div>
  );
}

function VehicleDialog({
  open, onOpenChange, title, form, onChange, onSubmit, submitLabel,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  form: Omit<VehicleRecord, "id">;
  onChange: (field: keyof Omit<VehicleRecord, "id">, val: string | number) => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Bus className="h-5 w-5 text-primary" />{title}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-2">
          <div>
            <label className="text-xs font-medium mb-1 block">Bus Number</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm bg-background" value={form.busNumber} onChange={(e) => onChange("busNumber", e.target.value)}>
              {["Bus 01","Bus 02","Bus 03","Bus 04","Bus 05","Bus 06"].map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Route Code</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm bg-background" value={form.routeCode} onChange={(e) => onChange("routeCode", e.target.value)}>
              {["RT-01","RT-02","RT-03","RT-04","RT-05","RT-06"].map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Vehicle Type</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm bg-background" value={form.vehicleType} onChange={(e) => onChange("vehicleType", e.target.value as VehicleType)}>
              {["Coach","Mini-Bus","Van"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Capacity</label>
            <Input type="number" value={form.capacity} onChange={(e) => onChange("capacity", parseInt(e.target.value) || 0)} min={1} max={60} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Fuel Type</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm bg-background" value={form.fuelType} onChange={(e) => onChange("fuelType", e.target.value as FuelType)}>
              {["Diesel","Petrol","CNG"].map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Status</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm bg-background" value={form.status} onChange={(e) => onChange("status", e.target.value as VehicleStatus)}>
              {["active","inactive","maintenance"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium mb-1 block">Registration Number</label>
            <Input placeholder="e.g. RYD-1045-A" value={form.registrationNumber} onChange={(e) => onChange("registrationNumber", e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium mb-1 block">Driver Name</label>
            <Input placeholder="Full name" value={form.driverName} onChange={(e) => onChange("driverName", e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium mb-1 block">Conductor Name</label>
            <Input placeholder="Full name" value={form.conductorName} onChange={(e) => onChange("conductorName", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Insurance Expiry</label>
            <Input placeholder="e.g. Dec 2025" value={form.insuranceExpiry} onChange={(e) => onChange("insuranceExpiry", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Fitness Expiry</label>
            <Input placeholder="e.g. Nov 2025" value={form.fitnessExpiry} onChange={(e) => onChange("fitnessExpiry", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Pollution Expiry</label>
            <Input placeholder="e.g. Oct 2025" value={form.pollutionExpiry} onChange={(e) => onChange("pollutionExpiry", e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSubmit} disabled={!form.registrationNumber.trim() || !form.driverName.trim()}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
