"use client";
import { useState } from "react";
import {
  CalendarDays, Clock, CheckCircle, XCircle, Users,
  Search, MessageSquare, Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDataStore } from "@/store/useDataStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRoleStore } from "@/store/useRoleStore";
import { LEAVE_TYPE_LABELS, type LeaveStatus } from "@/lib/mockData/leaves";
import { cn } from "@/lib/utils";

type TabFilter = "all" | LeaveStatus;

const statusConfig: Record<LeaveStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending:  { label: "Pending",  icon: Clock,       color: "text-amber-700",   bg: "bg-amber-50 border-amber-200" },
  approved: { label: "Approved", icon: CheckCircle, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  rejected: { label: "Rejected", icon: XCircle,     color: "text-red-700",     bg: "bg-red-50 border-red-200" },
};

export default function VPLeavePage() {
  const { user } = useAuthStore();
  const { activeRole } = useRoleStore();
  const { leaveRequests, approveLeaveRequest, rejectLeaveRequest } = useDataStore();

  const vpRole = (["vp1", "vp2", "vp3"].includes(activeRole) ? activeRole : "vp3") as "vp1" | "vp2" | "vp3";
  const vpGradeGroup: 1 | 5 | 9 = vpRole === "vp1" ? 1 : vpRole === "vp2" ? 5 : 9;

  const scopedRequests = leaveRequests.filter((r) => (r.gradeGroup ?? 9) === vpGradeGroup);

  const [tab, setTab]         = useState<TabFilter>("pending");
  const [search, setSearch]   = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [remarks, setRemarks] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const filtered = scopedRequests.filter((r) => {
    const matchTab    = tab === "all" || r.status === tab;
    const matchSearch = !search || r.teacherName.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = {
    all:      scopedRequests.length,
    pending:  scopedRequests.filter((r) => r.status === "pending").length,
    approved: scopedRequests.filter((r) => r.status === "approved").length,
    rejected: scopedRequests.filter((r) => r.status === "rejected").length,
  };

  const openAction = (id: string, type: "approve" | "reject") => {
    setActionId(id);
    setActionType(type);
    setRemarks("");
    setDone(false);
  };

  const closeAction = () => {
    setActionId(null);
    setActionType(null);
    setRemarks("");
    setDone(false);
  };

  const handleConfirm = async () => {
    if (!actionId || !actionType) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    const reviewerName = user?.name ?? "VP";
    if (actionType === "approve") {
      approveLeaveRequest(actionId, reviewerName, remarks);
    } else {
      rejectLeaveRequest(actionId, reviewerName, remarks);
    }
    setProcessing(false);
    setDone(true);
    setTimeout(() => closeAction(), 1500);
  };

  const actionRequest = actionId ? scopedRequests.find((r) => r.id === actionId) : null;

  const tabs: { value: TabFilter; label: string; count: number }[] = [
    { value: "pending",  label: "Pending",  count: counts.pending  },
    { value: "approved", label: "Approved", count: counts.approved },
    { value: "rejected", label: "Rejected", count: counts.rejected },
    { value: "all",      label: "All",      count: counts.all      },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leave Management"
        description={`${counts.pending} pending review · ${counts.all} total requests`}
        breadcrumbs={[{ label: "VP" }, { label: "Leave" }]}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total",    value: counts.all,      icon: Users,       color: "bg-slate-50 text-slate-700" },
          { label: "Pending",  value: counts.pending,  icon: Clock,       color: "bg-amber-50 text-amber-700" },
          { label: "Approved", value: counts.approved, icon: CheckCircle, color: "bg-emerald-50 text-emerald-700" },
          { label: "Rejected", value: counts.rejected, icon: XCircle,     color: "bg-red-50 text-red-700" },
        ].map((s) => (
          <Card key={s.label} className={s.color}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className="h-6 w-6" />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs font-medium">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5",
                tab === t.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-muted text-muted-foreground"
              )}
            >
              {t.label}
              <span className={cn("h-4 min-w-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center",
                tab === t.value ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              )}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            className="pl-8 h-8 text-xs w-44"
            placeholder="Search teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Request list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Clock className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No requests found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const cfg = statusConfig[req.status];
            const Icon = cfg.icon;
            return (
              <Card key={req.id} className={cn("border", req.status === "pending" && "border-amber-200")}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                        {req.teacherAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-semibold text-sm">{req.teacherName}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <Badge variant="secondary" className="text-[10px]">{LEAVE_TYPE_LABELS[req.leaveType]}</Badge>
                            <div className={cn("flex items-center gap-1 text-xs font-medium", cfg.color)}>
                              <Icon className="h-3 w-3" /> {cfg.label}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3" />
                            <span className="font-medium">
                              {req.fromDate === req.toDate ? req.fromDate : `${req.fromDate} – ${req.toDate}`}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">Submitted {req.submittedAt}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{req.reason}</p>
                      {req.remarks && (
                        <div className={cn("mt-2 rounded-lg px-3 py-2 text-xs border flex items-start gap-2",
                          req.status === "approved" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
                        )}>
                          <MessageSquare className="h-3 w-3 shrink-0 mt-0.5" />
                          <span><span className="font-semibold">{req.reviewedBy}:</span> {req.remarks}</span>
                        </div>
                      )}
                      {req.status === "pending" && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="gap-1.5 h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => openAction(req.id, "approve")}
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => openAction(req.id, "reject")}
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Approve / Reject Dialog */}
      <Dialog open={!!actionId} onOpenChange={(v) => { if (!v) closeAction(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className={cn("flex items-center gap-2", actionType === "approve" ? "text-emerald-700" : "text-red-700")}>
              {actionType === "approve"
                ? <><CheckCircle className="h-5 w-5" /> Approve Leave Request</>
                : <><XCircle className="h-5 w-5" /> Reject Leave Request</>
              }
            </DialogTitle>
            {actionRequest && (
              <DialogDescription>
                {LEAVE_TYPE_LABELS[actionRequest.leaveType]} for <strong>{actionRequest.teacherName}</strong> —{" "}
                {actionRequest.fromDate === actionRequest.toDate
                  ? actionRequest.fromDate
                  : `${actionRequest.fromDate} to ${actionRequest.toDate}`}
              </DialogDescription>
            )}
          </DialogHeader>

          {done ? (
            <div className="py-8 text-center">
              {actionType === "approve"
                ? <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                : <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
              }
              <p className="font-semibold">
                {actionType === "approve" ? "Request Approved" : "Request Rejected"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Teacher has been notified.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Remarks <span className="normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={
                    actionType === "approve"
                      ? "e.g. Please arrange a substitute teacher."
                      : "e.g. Insufficient coverage available on this date."
                  }
                  rows={3}
                  className="w-full text-sm bg-muted/30 rounded-xl p-3 resize-none border border-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeAction}>Cancel</Button>
                <Button
                  onClick={handleConfirm}
                  disabled={processing}
                  className={cn("gap-2", actionType === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700")}
                >
                  {processing
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                    : actionType === "approve" ? "Confirm Approve" : "Confirm Reject"
                  }
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
