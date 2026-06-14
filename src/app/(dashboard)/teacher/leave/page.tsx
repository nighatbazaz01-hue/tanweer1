"use client";
import { useState } from "react";
import {
  CalendarDays, Clock, CheckCircle, XCircle, Plus, FileText,
  AlertTriangle, Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useDataStore } from "@/store/useDataStore";
import { useAuthStore } from "@/store/useAuthStore";
import { DEMO_TEACHER_ID, DEMO_TEACHER_NAME } from "@/lib/permissions";
import { LEAVE_TYPE_LABELS, type LeaveType, type LeaveStatus } from "@/lib/mockData/leaves";
import { cn } from "@/lib/utils";

const LEAVE_TYPES: { value: LeaveType; label: string }[] = [
  { value: "sick",      label: "Sick Leave" },
  { value: "casual",    label: "Casual Leave" },
  { value: "emergency", label: "Emergency Leave" },
  { value: "half_day",  label: "Half Day" },
  { value: "other",     label: "Other" },
];

const statusConfig: Record<LeaveStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending:  { label: "Pending",  icon: Clock,         color: "text-amber-700",   bg: "bg-amber-50 border-amber-200" },
  approved: { label: "Approved", icon: CheckCircle,   color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  rejected: { label: "Rejected", icon: XCircle,       color: "text-red-700",     bg: "bg-red-50 border-red-200" },
};

export default function TeacherLeavePage() {
  const { user } = useAuthStore();
  const { leaveRequests, submitLeaveRequest } = useDataStore();

  const myRequests = leaveRequests.filter((r) => r.teacherId === DEMO_TEACHER_ID);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    leaveType: "sick" as LeaveType,
    fromDate:  "",
    toDate:    "",
    reason:    "",
  });
  const [submitted, setSubmitted] = useState(false);

  const counts = {
    pending:  myRequests.filter((r) => r.status === "pending").length,
    approved: myRequests.filter((r) => r.status === "approved").length,
    rejected: myRequests.filter((r) => r.status === "rejected").length,
  };

  const handleSubmit = async () => {
    if (!form.fromDate || !form.toDate || !form.reason.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    submitLeaveRequest(
      DEMO_TEACHER_ID,
      user?.name ?? DEMO_TEACHER_NAME,
      (user?.name ?? DEMO_TEACHER_NAME).split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
      form.leaveType,
      new Date(form.fromDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      new Date(form.toDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      form.reason,
    );
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setOpen(false);
      setForm({ leaveType: "sick", fromDate: "", toDate: "", reason: "" });
    }, 1500);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Leave Requests"
        description={`${myRequests.length} total · ${counts.pending} pending`}
        breadcrumbs={[{ label: "Teacher" }, { label: "Leave" }]}
        actions={
          <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Request Leave
          </Button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
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

      {/* Request list */}
      {myRequests.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FileText className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No leave requests yet</p>
          <p className="text-xs mt-1">Click "Request Leave" to submit your first request.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myRequests.map((req) => {
            const cfg = statusConfig[req.status];
            const Icon = cfg.icon;
            return (
              <Card key={req.id} className={cn("border", cfg.bg)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={cn("p-2 rounded-lg shrink-0", req.status === "approved" ? "bg-emerald-100" : req.status === "rejected" ? "bg-red-100" : "bg-amber-100")}>
                        <Icon className={cn("h-4 w-4", cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{LEAVE_TYPE_LABELS[req.leaveType]}</p>
                          <Badge className={cn("text-xs border", cfg.bg, cfg.color)}>{cfg.label}</Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <CalendarDays className="h-3 w-3" />
                          <span>{req.fromDate === req.toDate ? req.fromDate : `${req.fromDate} – ${req.toDate}`}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{req.reason}</p>
                        {req.remarks && (
                          <div className={cn("mt-2 rounded-lg px-3 py-2 text-xs border", req.status === "approved" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800")}>
                            <span className="font-semibold">{req.reviewedBy}:</span> {req.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-muted-foreground">Submitted</p>
                      <p className="text-xs font-medium">{req.submittedAt}</p>
                      {req.reviewedAt && (
                        <>
                          <p className="text-[10px] text-muted-foreground mt-1">Reviewed</p>
                          <p className="text-xs font-medium">{req.reviewedAt}</p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Request Dialog */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); setSubmitted(false); } else setOpen(true); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" /> Request Leave
            </DialogTitle>
          </DialogHeader>

          {submitted ? (
            <div className="py-8 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
              <p className="font-semibold">Request Submitted</p>
              <p className="text-sm text-muted-foreground mt-1">Your VP will be notified for review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Leave Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {LEAVE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setForm((p) => ({ ...p, leaveType: t.value }))}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all",
                        form.leaveType === t.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-muted text-muted-foreground"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">From Date</label>
                  <Input type="date" value={form.fromDate} onChange={(e) => setForm((p) => ({ ...p, fromDate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">To Date</label>
                  <Input type="date" value={form.toDate} onChange={(e) => setForm((p) => ({ ...p, toDate: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Reason</label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                  placeholder="Briefly describe the reason for your leave request..."
                  rows={3}
                  className="w-full text-sm bg-muted/30 rounded-xl p-3 resize-none border border-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {form.leaveType === "emergency" && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>Emergency leave requests are prioritized for same-day review.</p>
                </div>
              )}
            </div>
          )}

          {!submitted && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || !form.fromDate || !form.toDate || !form.reason.trim()}
                className="gap-2"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Request"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
