"use client";
import { DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockFeeRecords } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import type { FeeRecord } from "@/types";

const statusConfig: Record<
  FeeRecord["status"],
  { label: string; variant: "success" | "warning" | "destructive" | "secondary"; icon: React.ElementType }
> = {
  paid: { label: "Paid", variant: "success", icon: CheckCircle },
  partial: { label: "Partial", variant: "warning", icon: Clock },
  overdue: { label: "Overdue", variant: "destructive", icon: AlertCircle },
  pending: { label: "Pending", variant: "secondary", icon: Clock },
};

export default function FeesPage() {
  const totalAmount = mockFeeRecords.reduce((s, r) => s + r.amount, 0);
  const totalPaid = mockFeeRecords.reduce((s, r) => s + r.paidAmount, 0);
  const totalOverdue = mockFeeRecords
    .filter((r) => r.status === "overdue")
    .reduce((s, r) => s + (r.amount - r.paidAmount), 0);
  const collectionRate = Math.round((totalPaid / totalAmount) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Management"
        description="Track fee collection, payments, and outstanding balances"
        breadcrumbs={[{ label: "Home" }, { label: "Finance" }, { label: "Fees" }]}
        actions={
          <Button size="sm" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Record Payment
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Billed"
          value={formatCurrency(totalAmount)}
          subtitle="This semester"
          icon={DollarSign}
          iconClassName="bg-blue-500"
        />
        <StatsCard
          title="Collected"
          value={formatCurrency(totalPaid)}
          subtitle={`${collectionRate}% collection rate`}
          icon={CheckCircle}
          iconClassName="bg-green-500"
        />
        <StatsCard
          title="Overdue"
          value={formatCurrency(totalOverdue)}
          subtitle={`${mockFeeRecords.filter((r) => r.status === "overdue").length} accounts`}
          icon={AlertCircle}
          iconClassName="bg-red-500"
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Fee Records
        </h2>
        {mockFeeRecords.map((record) => {
          const status = statusConfig[record.status];
          const Icon = status.icon;
          const balance = record.amount - record.paidAmount;
          return (
            <Card key={record.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{record.studentName}</p>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {record.feeType} · {record.grade}
                    </p>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${(record.paidAmount / record.amount) * 100}%` }}
                        />
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
                    <Button variant="ghost" size="sm" className="text-xs mt-1">
                      Details
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
