"use client";
import { useState } from "react";
import { Plus, Phone, Mail, User } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAdmissionLeads } from "@/lib/mockData";
import type { AdmissionLead } from "@/types";

const statusConfig: Record<
  AdmissionLead["status"],
  { label: string; variant: "info" | "warning" | "secondary" | "success" | "destructive" }
> = {
  new: { label: "New Lead", variant: "info" },
  contacted: { label: "Contacted", variant: "warning" },
  interview_scheduled: { label: "Interview Scheduled", variant: "secondary" },
  enrolled: { label: "Enrolled", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
};

const pipelineStages = [
  { key: "new", label: "New Leads" },
  { key: "contacted", label: "Contacted" },
  { key: "interview_scheduled", label: "Interview" },
  { key: "enrolled", label: "Enrolled" },
];

export default function AdmissionsPage() {
  const leads = mockAdmissionLeads;

  const getLeadsByStatus = (status: string) =>
    leads.filter((l) => l.status === status);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions"
        description="Manage prospective student leads and enrollment pipeline"
        breadcrumbs={[{ label: "Home" }, { label: "Admissions" }]}
        actions={
          <Button size="sm" className="gap-2">
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
                      <span className="text-xs text-muted-foreground ml-auto">
                        {lead.leadId}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applying for: <span className="font-medium">{lead.gradeApplied}</span>
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {lead.parentName}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {lead.parentPhone}
                      </span>
                      {lead.parentEmail && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground hidden sm:flex">
                          <Mail className="h-3 w-3" />
                          {lead.parentEmail}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="text-xs">
                      Update
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
