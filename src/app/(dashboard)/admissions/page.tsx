"use client";
import { useState } from "react";
import { Plus, Phone, Mail, User, X, Check, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useDataStore } from "@/store/useDataStore";
import type { AdmissionLead } from "@/types";

const statusConfig: Record<
  AdmissionLead["status"],
  { label: string; variant: "info" | "warning" | "secondary" | "success" | "destructive" }
> = {
  new:                  { label: "New Lead",            variant: "info" },
  contacted:            { label: "Contacted",           variant: "warning" },
  interview_scheduled:  { label: "Interview Scheduled", variant: "secondary" },
  enrolled:             { label: "Enrolled",            variant: "success" },
  rejected:             { label: "Rejected",            variant: "destructive" },
};

const pipelineStages = [
  { key: "new", label: "New Leads" },
  { key: "contacted", label: "Contacted" },
  { key: "interview_scheduled", label: "Interview" },
  { key: "enrolled", label: "Enrolled" },
];

const STATUS_ORDER: AdmissionLead["status"][] = ["new", "contacted", "interview_scheduled", "enrolled", "rejected"];

export default function AdmissionsPage() {
  const { admissionLeads: leads, updateLeadStatus } = useDataStore();

  const [newOpen, setNewOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newGrade, setNewGrade] = useState("Grade 1");
  const [newParentName, setNewParentName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [viewLead, setViewLead] = useState<AdmissionLead | null>(null);

  const getLeadsByStatus = (status: string) => leads.filter((l) => l.status === status);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddLead = () => {
    if (!newStudentName.trim() || !newParentName.trim()) return;
    const name = newStudentName.trim();
    setNewOpen(false);
    setNewStudentName(""); setNewGrade("Grade 1"); setNewParentName(""); setNewPhone(""); setNewEmail("");
    showToast(`Lead for "${name}" added to the pipeline`);
  };

  const handleAdvanceStatus = (lead: AdmissionLead) => {
    const idx = STATUS_ORDER.indexOf(lead.status);
    if (idx < STATUS_ORDER.length - 1) {
      const nextStatus = STATUS_ORDER[idx + 1];
      updateLeadStatus(lead.id, nextStatus);
      showToast(`${lead.studentName} moved to: ${statusConfig[nextStatus].label}`);
    }
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
        title="Admissions"
        description="Manage prospective student leads and enrollment pipeline"
        breadcrumbs={[{ label: "Home" }, { label: "Admissions" }]}
        actions={
          <Button size="sm" className="gap-2" onClick={() => setNewOpen(true)}>
            <Plus className="h-4 w-4" />
            New Lead
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {pipelineStages.map((stage) => {
          const count = getLeadsByStatus(stage.key).length;
          return (
            <Card key={stage.key} className="text-center">
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground mt-1">{stage.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          All Leads ({leads.length})
        </h2>
        {leads.map((lead) => {
          const status = statusConfig[lead.status];
          const canAdvance = STATUS_ORDER.indexOf(lead.status) < STATUS_ORDER.length - 1;
          return (
            <Card key={lead.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{lead.studentName}</p>
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <span className="text-xs text-muted-foreground ml-auto">{lead.leadId}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applying for: <span className="font-medium">{lead.gradeApplied}</span>
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" /> {lead.parentName}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" /> {lead.parentPhone}
                      </span>
                      {lead.parentEmail && (
                        <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" /> {lead.parentEmail}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {canAdvance && (
                      <Button variant="outline" size="sm" className="text-xs gap-1"
                        onClick={() => handleAdvanceStatus(lead)}>
                        Advance <ChevronRight className="h-3 w-3" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-xs"
                      onClick={() => setViewLead(lead)}>
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* New Lead Dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> New Admission Lead
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Student Name *</label>
              <Input value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} placeholder="e.g. Lina Al-Otaibi" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Applying for Grade</label>
              <select className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={newGrade} onChange={(e) => setNewGrade(e.target.value)}>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
                  <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Parent / Guardian Name *</label>
              <Input value={newParentName} onChange={(e) => setNewParentName(e.target.value)} placeholder="e.g. Khalid Al-Otaibi" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Parent Phone</label>
              <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+966 5xxxxxxxx" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Parent Email</label>
              <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="parent@email.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)} className="gap-1">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleAddLead} disabled={!newStudentName.trim() || !newParentName.trim()} className="gap-1">
              <Check className="h-4 w-4" /> Add Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Lead Dialog */}
      <Dialog open={!!viewLead} onOpenChange={(o) => !o && setViewLead(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Lead Details
            </DialogTitle>
          </DialogHeader>
          {viewLead && (
            <div className="space-y-4 py-1">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">{viewLead.studentName}</p>
                  <p className="text-xs text-muted-foreground">{viewLead.leadId} · {viewLead.gradeApplied}</p>
                  <Badge variant={statusConfig[viewLead.status].variant} className="mt-1 text-xs">
                    {statusConfig[viewLead.status].label}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Parent / Guardian</p>
                <div className="flex items-center gap-2 text-sm"><User className="h-3.5 w-3.5 text-muted-foreground" /> {viewLead.parentName}</div>
                <div className="flex items-center gap-2 text-sm"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {viewLead.parentPhone}</div>
                {viewLead.parentEmail && (
                  <div className="flex items-center gap-2 text-sm"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {viewLead.parentEmail}</div>
                )}
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pipeline Progress</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {STATUS_ORDER.slice(0, 4).map((s) => {
                    const curr = STATUS_ORDER.indexOf(viewLead.status);
                    const sIdx = STATUS_ORDER.indexOf(s);
                    return (
                      <div key={s} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${sIdx <= curr ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"}`}>
                        {sIdx <= curr && <Check className="h-3 w-3" />}
                        {statusConfig[s].label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {viewLead && STATUS_ORDER.indexOf(viewLead.status) < STATUS_ORDER.length - 1 && (
              <Button onClick={() => { if (viewLead) { handleAdvanceStatus(viewLead); setViewLead(null); } }} className="gap-1">
                <ChevronRight className="h-4 w-4" /> Advance to Next Stage
              </Button>
            )}
            <Button variant="outline" onClick={() => setViewLead(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
