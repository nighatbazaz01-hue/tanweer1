"use client";
import { useState, useMemo } from "react";
import { DollarSign, AlertCircle, CheckCircle, Clock, Search, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { type PopulationFeeRecord, type FeeStatus } from "@/lib/mockData/population";
import { useRoleStore } from "@/store/useRoleStore";
import { useDataStore } from "@/store/useDataStore";
import { filterFeesForRole, getRoleScopeLabel } from "@/lib/permissions";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const statusConfig: Record<FeeStatus, {
  label: string; variant: "success" | "warning" | "destructive" | "secondary"; icon: React.ElementType;
}> = {
  paid:    { label: "Paid",    variant: "success",     icon: CheckCircle },
  partial: { label: "Partial", variant: "warning",     icon: Clock },
  overdue: { label: "Overdue", variant: "destructive", icon: AlertCircle },
  pending: { label: "Pending", variant: "secondary",   icon: Clock },
};

const PAGE_SIZE = 30;

export default function FeesPage() {
  const { activeRole } = useRoleStore();
  const { feeRecords: storeRecords, recordFeePayment } = useDataStore();
  const baseRecords = useMemo(() => filterFeesForRole(storeRecords, activeRole), [storeRecords, activeRole]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FeeStatus | "all">("all");
  const [gradeFilter, setGradeFilter] = useState<number | "all">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PopulationFeeRecord | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [paying, setPaying] = useState(false);

  const totalAmount = useMemo(() => baseRecords.reduce((s, r) => s + r.amount, 0), [baseRecords]);
  const totalPaid   = useMemo(() => baseRecords.reduce((s, r) => s + r.paidAmount, 0), [baseRecords]);
  const totalOverdue = useMemo(() => baseRecords.filter((r) => r.status === "overdue").reduce((s, r) => s + r.amount, 0), [baseRecords]);
  const collectionRate = Math.round((totalPaid / totalAmount) * 100);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return baseRecords.filter((r) => {
      const matchSearch = !q || r.studentName.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      const matchGrade = gradeFilter === "all" || r.grade === gradeFilter;
      return matchSearch && matchStatus && matchGrade;
    });
  }, [baseRecords, search, statusFilter, gradeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRecordPayment = () => {
    if (!selected) return;
    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) return;
    recordFeePayment(selected.id, amt, "Admin");
    setSelected(null);
    setPayAmount("");
    setPaying(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Management"
        description={`Fee records · ${getRoleScopeLabel(activeRole)}`}
        breadcrumbs={[{ label: "Home" }, { label: "Finance" }, { label: "Fees" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatsCard title="Total Billed"   value={formatCurrency(totalAmount)}  subtitle="All students"        icon={DollarSign}   iconClassName="bg-blue-500" />
        <StatsCard title="Collected"      value={formatCurrency(totalPaid)}    subtitle={`${collectionRate}% rate`} icon={CheckCircle} iconClassName="bg-green-500" />
        <StatsCard title="Overdue"        value={formatCurrency(totalOverdue)} subtitle={`${baseRecords.filter((r) => r.status === "overdue").length} accounts`} icon={AlertCircle} iconClassName="bg-red-500" />
        <StatsCard title="Collection Rate" value={`${collectionRate}%`}        subtitle="This semester"       icon={TrendingUp}   iconClassName="bg-violet-500" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or ID..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-9" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "paid", "partial", "overdue", "pending"] as const).map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={cn("px-3 py-1 rounded-full text-xs font-medium border capitalize transition-all",
                statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"
              )}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground self-center">Grade:</span>
          {(["all", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map((g) => (
            <button key={g} onClick={() => { setGradeFilter(g); setPage(1); }}
              className={cn("px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                gradeFilter === g ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"
              )}>
              {g === "all" ? "All" : `G${g}`}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground ml-auto whitespace-nowrap">{filtered.length.toLocaleString()} records</p>
      </div>

      <div className="space-y-2.5">
        {paginated.map((record) => {
          const status = statusConfig[record.status];
          const Icon = status.icon;
          const balance = record.amount - record.paidAmount;
          return (
            <Card key={record.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground">{record.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{record.studentName}</p>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {record.feeType} · Grade {record.grade}-{record.section}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(record.paidAmount / record.amount) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatCurrency(record.paidAmount)} / {formatCurrency(record.amount)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {balance > 0 ? (
                      <>
                        <p className="text-sm font-semibold text-red-600">{formatCurrency(balance)}</p>
                        <p className="text-xs text-muted-foreground">Due: {record.dueDate}</p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-green-600">Cleared</p>
                    )}
                    <Button variant="ghost" size="sm" className="text-xs mt-1" onClick={() => { setSelected(record); setPaying(false); }}>
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No fee records found.</div>
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

      {/* Details Modal */}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) { setSelected(null); setPaying(false); setPayAmount(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Fee Record Details</DialogTitle>
            <DialogDescription>Student payment information and status</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-xl">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-base bg-primary/10 text-primary font-bold">{selected.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selected.studentName}</p>
                  <p className="text-sm text-muted-foreground">{selected.studentId} · Grade {selected.grade}-{selected.section}</p>
                </div>
                <Badge variant={statusConfig[selected.status].variant} className="ml-auto">
                  {statusConfig[selected.status].label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Fee Type</p>
                  <p className="font-medium mt-0.5">{selected.feeType}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="font-medium mt-0.5">{selected.dueDate}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="font-semibold mt-0.5">{formatCurrency(selected.amount)}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Amount Paid</p>
                  <p className="font-semibold text-green-600 mt-0.5">{formatCurrency(selected.paidAmount)}</p>
                </div>
                {selected.amount - selected.paidAmount > 0 && (
                  <div className="col-span-2 bg-red-50 rounded-xl p-3">
                    <p className="text-xs text-red-600">Outstanding Balance</p>
                    <p className="font-bold text-red-700 mt-0.5 text-lg">{formatCurrency(selected.amount - selected.paidAmount)}</p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Payment Progress</span>
                  <span>{Math.round((selected.paidAmount / selected.amount) * 100)}%</span>
                </div>
                <div className="bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(selected.paidAmount / selected.amount) * 100}%` }} />
                </div>
              </div>

              {paying && (
                <div className="space-y-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm font-medium text-blue-800">Record Payment Amount (SAR)</p>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder={`Max: ${selected.amount - selected.paidAmount}`}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setSelected(null); setPaying(false); setPayAmount(""); }}>Close</Button>
            {selected && selected.paidAmount < selected.amount && !paying && (
              <Button onClick={() => setPaying(true)} className="gap-2">
                <DollarSign className="h-4 w-4" /> Record Payment
              </Button>
            )}
            {paying && (
              <Button onClick={handleRecordPayment} disabled={!payAmount || parseFloat(payAmount) <= 0} className="gap-2">
                <CheckCircle className="h-4 w-4" /> Confirm Payment
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
