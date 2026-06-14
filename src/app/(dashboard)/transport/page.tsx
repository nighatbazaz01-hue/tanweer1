"use client";
import { useState, useMemo } from "react";
import {
  Bus, Search, MapPin, Phone, User, ChevronLeft, ChevronRight,
  X, Check, Edit2, ShieldOff, Truck, Route, BarChart2, Plus,
  Clock, CheckCircle, XCircle, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { type TransportRecord, type TransportRequestType } from "@/lib/mockData/transport";
import { useRoleStore } from "@/store/useRoleStore";
import { useDataStore } from "@/store/useDataStore";
import { DEMO_CHILD_ID } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const BUS_COLORS: Record<string, string> = {
  "Bus 01": "bg-blue-100 text-blue-700",
  "Bus 02": "bg-violet-100 text-violet-700",
  "Bus 03": "bg-emerald-100 text-emerald-700",
  "Bus 04": "bg-amber-100 text-amber-700",
  "Bus 05": "bg-rose-100 text-rose-700",
  "Bus 06": "bg-sky-100 text-sky-700",
};

const REQUEST_TYPE_LABELS: Record<TransportRequestType, string> = {
  change_stop:    "Change Stop",
  change_address: "Change Address",
  temporary:      "Temporary Arrangement",
};

const PAGE_SIZE = 30;

export default function TransportPage() {
  const { activeRole } = useRoleStore();

  if (activeRole === "teacher") {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Transport"
          description="School bus routes and student transport assignments"
          breadcrumbs={[{ label: "Home" }, { label: "Transport" }]}
        />
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
            <ShieldOff className="h-10 w-10 text-muted-foreground opacity-40" />
            <p className="font-semibold text-muted-foreground">Access Restricted</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Transport information is available to Admins, Vice Principals, Parents, and Students only.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <TransportContent activeRole={activeRole} />;
}

// ─── Admin / VP Hub ─────────────────────────────────────────────────────────

type AdminTab = "overview" | "requests";

function AdminTransportHub() {
  const {
    transportRecords, updateTransportRecord,
    transportRequests, approveTransportRequest, rejectTransportRequest,
    vehicles,
  } = useDataStore();

  const [tab, setTab] = useState<AdminTab>("overview");
  const [search, setSearch] = useState("");
  const [busFilter, setBusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [detailRecord, setDetailRecord] = useState<TransportRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [editStop, setEditStop] = useState("");
  const [editContact, setEditContact] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000); };

  const busNumbers = useMemo(() => Array.from(new Set(transportRecords.map((r) => r.busNumber))).sort(), [transportRecords]);
  const busCounts = useMemo(() => {
    const c: Record<string, number> = {};
    transportRecords.forEach((r) => { c[r.busNumber] = (c[r.busNumber] || 0) + 1; });
    return c;
  }, [transportRecords]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return transportRecords.filter((r) => {
      const matchSearch = !q || r.studentName.toLowerCase().includes(q) || r.busNumber.toLowerCase().includes(q) || r.stopLocation.toLowerCase().includes(q) || r.parentName.toLowerCase().includes(q);
      return matchSearch && (busFilter === "all" || r.busNumber === busFilter);
    });
  }, [transportRecords, search, busFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pendingRequests = transportRequests.filter((r) => r.status === "pending");
  const allRequests = [...transportRequests].sort((a, b) => (a.status === "pending" ? -1 : b.status === "pending" ? 1 : 0));

  const openEdit = (rec: TransportRecord) => {
    setEditAddress(rec.address);
    setEditStop(rec.stopLocation);
    setEditContact(rec.parentContact);
    setDetailRecord(rec);
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!detailRecord) return;
    updateTransportRecord(detailRecord.id, editAddress, editStop, editContact, "Admin");
    showToast(`Transport details updated for ${detailRecord.studentName}`);
    setEditOpen(false);
    setDetailRecord(null);
  };

  const handleApprove = (id: string, name: string) => {
    approveTransportRequest(id, "Admin");
    showToast(`Request for ${name} approved.`);
  };

  const handleReject = (id: string, name: string) => {
    rejectTransportRequest(id, "Admin");
    showToast(`Request for ${name} rejected.`);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white rounded-xl px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 shrink-0" />{toastMsg}
        </div>
      )}

      <PageHeader
        title="Transport"
        description="School bus routes, vehicle fleet, and student transport management"
        breadcrumbs={[{ label: "Home" }, { label: "Transport" }]}
      />

      {/* Quick-link cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/transport/vehicles" className="block">
          <Card className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Truck className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="font-semibold text-sm">Vehicle Management</p>
                <p className="text-xs text-muted-foreground">{vehicles.length} vehicles · {vehicles.filter((v) => v.status === "active").length} active</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/transport/routes" className="block">
          <Card className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Route className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="font-semibold text-sm">Route Management</p>
                <p className="text-xs text-muted-foreground">6 routes · stops, times &amp; allocation</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/transport/reports" className="block">
          <Card className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                <BarChart2 className="h-5 w-5 text-violet-700" />
              </div>
              <div>
                <p className="font-semibold text-sm">Reports</p>
                <p className="text-xs text-muted-foreground">Utilization, fleet &amp; student reports</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b">
        {(["overview", "requests"] as AdminTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px capitalize relative",
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "overview" ? "Student Overview" : "Requests"}
            {t === "requests" && pendingRequests.length > 0 && (
              <span className="ml-1.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {busNumbers.map((bus) => (
              <Card
                key={bus}
                className={cn("cursor-pointer transition-all hover:shadow-md", busFilter === bus && "ring-2 ring-primary")}
                onClick={() => { setBusFilter(busFilter === bus ? "all" : bus); setPage(1); }}
              >
                <CardContent className="p-3 flex items-center gap-2">
                  <span className={cn("px-2 py-0.5 rounded-md text-xs font-bold", BUS_COLORS[bus] || "bg-muted text-muted-foreground")}>{bus}</span>
                  <div><p className="text-lg font-bold">{busCounts[bus] || 0}</p><p className="text-[10px] text-muted-foreground">students</p></div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by student, bus, or stop..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-9" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => { setBusFilter("all"); setPage(1); }} className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all", busFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground")}>All Buses</button>
              {busNumbers.map((bus) => (
                <button key={bus} onClick={() => { setBusFilter(bus); setPage(1); }} className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all", busFilter === bus ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground")}>{bus}</button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground ml-auto whitespace-nowrap">{filtered.length.toLocaleString()} students</p>
          </div>

          <div className="space-y-2">
            {paginated.map((record) => (
              <Card key={record.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground">{record.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[2fr_1fr_2fr_1.5fr_auto] gap-2 sm:gap-4 items-center">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{record.studentName}</p>
                      <p className="text-xs text-muted-foreground">Grade {record.grade}-{record.section}</p>
                    </div>
                    <Badge className={cn("w-fit text-xs", BUS_COLORS[record.busNumber] || "bg-muted text-muted-foreground")}>{record.busNumber}</Badge>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3 shrink-0" /><span className="truncate">{record.stopLocation}</span></div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{record.route}</p>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-xs"><User className="h-3 w-3 shrink-0 text-muted-foreground" /><span className="truncate">{record.parentName}</span></div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3 shrink-0" /><span className="truncate">{record.parentContact}</span></div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs shrink-0" onClick={() => setDetailRecord(record)}>Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground text-sm">No transport records found.</div>}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">Page {page} of {totalPages} · {paginated.length} of {filtered.length}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="gap-1"><ChevronLeft className="h-4 w-4" />Prev</Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="gap-1">Next<ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* REQUESTS TAB */}
      {tab === "requests" && (
        <div className="space-y-3">
          {allRequests.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">No transport requests yet.</div>
          )}
          {allRequests.map((req) => (
            <Card key={req.id} className={cn("transition-all", req.status === "pending" && "border-amber-200 bg-amber-50/30")}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{req.studentName}</p>
                      <Badge className="text-xs bg-blue-100 text-blue-700">{REQUEST_TYPE_LABELS[req.requestType]}</Badge>
                      <Badge className={cn("text-xs flex items-center gap-1",
                        req.status === "pending"  ? "bg-amber-100 text-amber-700" :
                        req.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {req.status === "pending"  && <Clock className="h-3 w-3" />}
                        {req.status === "approved" && <CheckCircle className="h-3 w-3" />}
                        {req.status === "rejected" && <XCircle className="h-3 w-3" />}
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Parent: {req.parentName} · Submitted: {req.submittedAt}</p>
                    <p className="text-sm">{req.details}</p>
                    {req.reviewedBy && (
                      <p className="text-xs text-muted-foreground">Reviewed by {req.reviewedBy} on {req.reviewedAt}</p>
                    )}
                  </div>
                  {req.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApprove(req.id, req.studentName)}>
                        <Check className="h-3.5 w-3.5" />Approve
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleReject(req.id, req.studentName)}>
                        <X className="h-3.5 w-3.5" />Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!detailRecord && !editOpen} onOpenChange={(o) => !o && setDetailRecord(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Bus className="h-5 w-5 text-primary" />Transport Details</DialogTitle></DialogHeader>
          {detailRecord && (
            <div className="space-y-4 py-1">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <Avatar className="h-11 w-11"><AvatarFallback className="bg-primary/10 text-primary font-bold">{detailRecord.avatar}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{detailRecord.studentName}</p>
                  <p className="text-xs text-muted-foreground">{detailRecord.studentId} · Grade {detailRecord.grade}-{detailRecord.section}</p>
                </div>
                <Badge className={cn("text-xs", BUS_COLORS[detailRecord.busNumber])}>{detailRecord.busNumber}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground mb-0.5">Bus Number</p><p className="font-semibold">{detailRecord.busNumber}</p></div>
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground mb-0.5">Pickup Stop</p><p className="font-semibold text-xs">{detailRecord.stopLocation}</p></div>
                <div className="col-span-2 bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground mb-0.5">Route</p><p className="font-semibold text-xs">{detailRecord.route}</p></div>
                <div className="col-span-2 bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground mb-0.5">Home Address</p><p className="font-semibold text-xs">{detailRecord.address}</p></div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Parent / Guardian</p>
                <div className="flex items-center gap-2 text-sm"><User className="h-3.5 w-3.5 text-muted-foreground" />{detailRecord.parentName}</div>
                <div className="flex items-center gap-2 text-sm mt-1"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{detailRecord.parentContact}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { if (detailRecord) openEdit(detailRecord); }} className="gap-1"><Edit2 className="h-4 w-4" />Edit Details</Button>
            <Button variant="ghost" onClick={() => setDetailRecord(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(o) => !o && setEditOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Edit2 className="h-5 w-5 text-primary" />Edit Transport Details</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Pickup Stop</label><Input value={editStop} onChange={(e) => setEditStop(e.target.value)} placeholder="Pickup stop location" /></div>
            <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Home Address</label><Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} placeholder="Full home address" /></div>
            <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Parent Contact Number</label><Input value={editContact} onChange={(e) => setEditContact(e.target.value)} placeholder="+966 5xxxxxxxx" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="gap-1"><X className="h-4 w-4" />Cancel</Button>
            <Button onClick={handleSaveEdit} className="gap-1"><Check className="h-4 w-4" />Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Parent / Student View ────────────────────────────────────────────────────

function TransportContent({ activeRole }: { activeRole: string }) {
  const isAdmin = activeRole === "admin" || activeRole === "vp1" || activeRole === "vp2" || activeRole === "vp3";
  if (isAdmin) return <AdminTransportHub />;

  const { transportRecords, updateTransportRecord, submitTransportRequest } = useDataStore();

  const records = useMemo(() => {
    const match = transportRecords.find((r) => r.studentId === DEMO_CHILD_ID);
    return match ? [match] : transportRecords.slice(0, 1);
  }, [transportRecords]);

  const [editOpen, setEditOpen] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [editStop, setEditStop] = useState("");
  const [editContact, setEditContact] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestType, setRequestType] = useState<TransportRequestType>("change_stop");
  const [requestDetails, setRequestDetails] = useState("");
  const [proposedStop, setProposedStop] = useState("");
  const [proposedAddress, setProposedAddress] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000); };

  const openEdit = (rec: TransportRecord) => {
    setEditAddress(rec.address);
    setEditStop(rec.stopLocation);
    setEditContact(rec.parentContact);
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!records[0]) return;
    updateTransportRecord(records[0].id, editAddress, editStop, editContact, "Parent");
    showToast("Transport details updated successfully.");
    setEditOpen(false);
  };

  const handleSubmitRequest = () => {
    if (!records[0] || !requestDetails.trim()) return;
    submitTransportRequest(
      records[0].studentId,
      records[0].studentName,
      records[0].parentName,
      requestType,
      requestDetails,
      "RT-01",
      "Parent",
      proposedStop.trim() || undefined,
      proposedAddress.trim() || undefined,
    );
    showToast("Request submitted. Admin will review shortly.");
    setRequestOpen(false);
    setRequestDetails("");
    setProposedStop("");
    setProposedAddress("");
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white rounded-xl px-4 py-3 shadow-lg text-sm font-medium">
          <Check className="h-4 w-4 shrink-0" />{toastMsg}
        </div>
      )}

      <PageHeader
        title="Transport"
        description={activeRole === "parent" ? "Your child's bus route and pickup details" : "Your bus route and pickup details"}
        breadcrumbs={[{ label: "Home" }, { label: "Transport" }]}
      />

      {records.length > 0 && (
        <Card className="max-w-lg">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary/10 text-primary text-base font-bold">{records[0].avatar}</AvatarFallback></Avatar>
              <div><p className="font-semibold text-base">{records[0].studentName}</p><p className="text-sm text-muted-foreground">Grade {records[0].grade}-{records[0].section}</p></div>
              <Badge className={cn("ml-auto text-xs", BUS_COLORS[records[0].busNumber])}>{records[0].busNumber}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground mb-0.5">Route</p><p className="font-medium text-xs">{records[0].route}</p></div>
              <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground mb-0.5">Pickup Stop</p><p className="font-medium text-xs">{records[0].stopLocation}</p></div>
              <div className="col-span-2 bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground mb-0.5">Home Address</p><p className="font-medium text-xs">{records[0].address}</p></div>
            </div>
            {activeRole === "parent" && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => openEdit(records[0])}>
                  <Edit2 className="h-3.5 w-3.5" />Update Address / Contact
                </Button>
                <Button size="sm" className="flex-1 gap-2" onClick={() => setRequestOpen(true)}>
                  <Plus className="h-3.5 w-3.5" />Submit Request
                </Button>
              </div>
            )}
            {activeRole === "student" && (
              <p className="text-xs text-muted-foreground text-center">Contact your parent to update transport details.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(o) => !o && setEditOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Edit2 className="h-5 w-5 text-primary" />Edit Transport Details</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Pickup Stop</label><Input value={editStop} onChange={(e) => setEditStop(e.target.value)} /></div>
            <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Home Address</label><Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} /></div>
            <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Parent Contact</label><Input value={editContact} onChange={(e) => setEditContact(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}><Check className="h-4 w-4 mr-1" />Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Request Dialog */}
      <Dialog open={requestOpen} onOpenChange={(o) => !o && setRequestOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-primary" />Submit Transport Request</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">Request Type</label>
              <div className="space-y-2">
                {(["change_stop", "change_address", "temporary"] as TransportRequestType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setRequestType(type)}
                    className={cn("w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-all",
                      requestType === type ? "border-primary bg-primary/5" : "hover:border-primary/50"
                    )}
                  >
                    <p className="font-medium">{REQUEST_TYPE_LABELS[type]}</p>
                    <p className="text-xs text-muted-foreground">
                      {type === "change_stop" && "Request a permanent change to your child's pickup/drop stop"}
                      {type === "change_address" && "Update your home address for transport purposes"}
                      {type === "temporary" && "Arrange temporary transport from a different location"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            {requestType === "change_stop" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">New Pickup Stop</label>
                <Input placeholder="e.g. Malaz Square" value={proposedStop} onChange={(e) => setProposedStop(e.target.value)} />
              </div>
            )}
            {requestType === "change_address" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">New Home Address</label>
                <Input placeholder="e.g. Villa 45, Al-Ruwais District, Riyadh" value={proposedAddress} onChange={(e) => setProposedAddress(e.target.value)} />
              </div>
            )}
            {requestType === "temporary" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Temporary Pickup Location</label>
                <Input placeholder="e.g. Prince Fawwaz Road (Grandmother's house)" value={proposedStop} onChange={(e) => setProposedStop(e.target.value)} />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Additional Details</label>
              <textarea
                className="w-full rounded-md border px-3 py-2 text-sm bg-background resize-none min-h-[80px]"
                placeholder="Please describe your request in detail..."
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitRequest}
              disabled={
                !requestDetails.trim() ||
                (requestType === "change_stop" && !proposedStop.trim()) ||
                (requestType === "change_address" && !proposedAddress.trim()) ||
                (requestType === "temporary" && !proposedStop.trim())
              }
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
