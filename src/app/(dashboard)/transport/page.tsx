"use client";
import { useState, useMemo } from "react";
import { Bus, Search, MapPin, Phone, User, ChevronLeft, ChevronRight, X, Check, Edit2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { generateTransportRecords, type TransportRecord } from "@/lib/mockData/transport";
import { useRoleStore } from "@/store/useRoleStore";
import { cn } from "@/lib/utils";

const BUS_COLORS: Record<string, string> = {
  "Bus 01": "bg-blue-100 text-blue-700",
  "Bus 02": "bg-violet-100 text-violet-700",
  "Bus 03": "bg-emerald-100 text-emerald-700",
  "Bus 04": "bg-amber-100 text-amber-700",
  "Bus 05": "bg-rose-100 text-rose-700",
  "Bus 06": "bg-sky-100 text-sky-700",
};

const PAGE_SIZE = 30;

export default function TransportPage() {
  const { activeRole } = useRoleStore();
  const allRecords = useMemo(() => generateTransportRecords(), []);

  // Parent sees only their child's record
  const records = useMemo(() => {
    if (activeRole === "parent") return allRecords.slice(0, 1);
    return allRecords;
  }, [allRecords, activeRole]);

  const [search, setSearch] = useState("");
  const [busFilter, setBusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [detailRecord, setDetailRecord] = useState<TransportRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [editStop, setEditStop] = useState("");
  const [editContact, setEditContact] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const busNumbers = useMemo(() => Array.from(new Set(allRecords.map((r) => r.busNumber))).sort(), [allRecords]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter((r) => {
      const matchSearch = !q
        || r.studentName.toLowerCase().includes(q)
        || r.busNumber.toLowerCase().includes(q)
        || r.stopLocation.toLowerCase().includes(q)
        || r.parentName.toLowerCase().includes(q);
      const matchBus = busFilter === "all" || r.busNumber === busFilter;
      return matchSearch && matchBus;
    });
  }, [records, search, busFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const busCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach((r) => { counts[r.busNumber] = (counts[r.busNumber] || 0) + 1; });
    return counts;
  }, [records]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const openEdit = (rec: TransportRecord) => {
    setEditAddress(rec.address);
    setEditStop(rec.stopLocation);
    setEditContact(rec.parentContact);
    setDetailRecord(rec);
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!detailRecord) return;
    showToast(`Transport details updated for ${detailRecord.studentName}`);
    setEditOpen(false);
    setDetailRecord(null);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white rounded-xl px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 shrink-0" />
          {toastMsg}
        </div>
      )}

      <PageHeader
        title="Transport"
        description={
          activeRole === "parent"
            ? "Your child's bus route and pickup details"
            : `School bus routes and student transport assignments`
        }
        breadcrumbs={[{ label: "Home" }, { label: "Transport" }]}
      />

      {/* Stats */}
      {activeRole !== "parent" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {busNumbers.map((bus) => (
            <Card
              key={bus}
              className={cn("cursor-pointer transition-all hover:shadow-md", busFilter === bus && "ring-2 ring-primary")}
              onClick={() => { setBusFilter(busFilter === bus ? "all" : bus); setPage(1); }}
            >
              <CardContent className="p-3 flex items-center gap-2">
                <span className={cn("px-2 py-0.5 rounded-md text-xs font-bold", BUS_COLORS[bus] || "bg-muted text-muted-foreground")}>
                  {bus}
                </span>
                <div>
                  <p className="text-lg font-bold">{busCounts[bus] || 0}</p>
                  <p className="text-[10px] text-muted-foreground">students</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters — only for non-parent */}
      {activeRole !== "parent" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student, bus, or stop..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => { setBusFilter("all"); setPage(1); }}
              className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all",
                busFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"
              )}>
              All Buses
            </button>
            {busNumbers.map((bus) => (
              <button key={bus}
                onClick={() => { setBusFilter(bus); setPage(1); }}
                className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all",
                  busFilter === bus ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"
                )}>
                {bus}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground ml-auto whitespace-nowrap">{filtered.length.toLocaleString()} students</p>
        </div>
      )}

      {/* Parent: single card view */}
      {activeRole === "parent" && records.length > 0 && (
        <Card className="max-w-lg">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary text-base font-bold">{records[0].avatar}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-base">{records[0].studentName}</p>
                <p className="text-sm text-muted-foreground">Grade {records[0].grade}-{records[0].section}</p>
              </div>
              <Badge className={cn("ml-auto text-xs", BUS_COLORS[records[0].busNumber])}>{records[0].busNumber}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Route</p>
                <p className="font-medium text-xs">{records[0].route}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Pickup Stop</p>
                <p className="font-medium text-xs">{records[0].stopLocation}</p>
              </div>
              <div className="col-span-2 bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Home Address</p>
                <p className="font-medium text-xs">{records[0].address}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => openEdit(records[0])}>
              <Edit2 className="h-3.5 w-3.5" /> Update Address / Contact
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Table view for admin/vp */}
      {activeRole !== "parent" && (
        <>
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
                    <Badge className={cn("w-fit text-xs", BUS_COLORS[record.busNumber] || "bg-muted text-muted-foreground")}>
                      {record.busNumber}
                    </Badge>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{record.stopLocation}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{record.route}</p>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-xs">
                        <User className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <span className="truncate">{record.parentName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span className="truncate">{record.parentContact}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs shrink-0"
                      onClick={() => setDetailRecord(record)}>
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">No transport records found.</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">Page {page} of {totalPages} · {paginated.length} of {filtered.length}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="gap-1">
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="gap-1">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Dialog (admin/vp) */}
      <Dialog open={!!detailRecord && !editOpen} onOpenChange={(o) => !o && setDetailRecord(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" /> Transport Details
            </DialogTitle>
          </DialogHeader>
          {detailRecord && (
            <div className="space-y-4 py-1">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{detailRecord.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{detailRecord.studentName}</p>
                  <p className="text-xs text-muted-foreground">{detailRecord.studentId} · Grade {detailRecord.grade}-{detailRecord.section}</p>
                </div>
                <Badge className={cn("text-xs", BUS_COLORS[detailRecord.busNumber])}>{detailRecord.busNumber}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Bus Number</p>
                  <p className="font-semibold">{detailRecord.busNumber}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Pickup Stop</p>
                  <p className="font-semibold text-xs">{detailRecord.stopLocation}</p>
                </div>
                <div className="col-span-2 bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Route</p>
                  <p className="font-semibold text-xs">{detailRecord.route}</p>
                </div>
                <div className="col-span-2 bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Home Address</p>
                  <p className="font-semibold text-xs">{detailRecord.address}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Parent / Guardian</p>
                <div className="flex items-center gap-2 text-sm"><User className="h-3.5 w-3.5 text-muted-foreground" /> {detailRecord.parentName}</div>
                <div className="flex items-center gap-2 text-sm mt-1"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {detailRecord.parentContact}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { if (detailRecord) openEdit(detailRecord); }} className="gap-1">
              <Edit2 className="h-4 w-4" /> Edit Details
            </Button>
            <Button variant="ghost" onClick={() => setDetailRecord(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(o) => !o && setEditOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-primary" /> Edit Transport Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Pickup Stop</label>
              <Input value={editStop} onChange={(e) => setEditStop(e.target.value)} placeholder="Pickup stop location" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Home Address</label>
              <Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} placeholder="Full home address" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Parent Contact Number</label>
              <Input value={editContact} onChange={(e) => setEditContact(e.target.value)} placeholder="+966 5xxxxxxxx" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="gap-1">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="gap-1">
              <Check className="h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
