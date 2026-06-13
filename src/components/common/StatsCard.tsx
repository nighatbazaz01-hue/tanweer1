import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  iconClassName?: string;
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, iconClassName }: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {trend && (
              <p className={cn("text-xs font-medium", trend.positive ? "text-green-600" : "text-red-600")}>
                {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% from last month
              </p>
            )}
          </div>
          <div className={cn("rounded-xl p-3", iconClassName || "bg-primary/10")}>
            <Icon className={cn("h-5 w-5", iconClassName ? "text-white" : "text-primary")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
