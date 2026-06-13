"use client";
import { useState } from "react";
import {
  Bell, BookOpen, ClipboardList, DollarSign, Megaphone,
  Calendar, FileText, Mail, AlertTriangle, Award,
  CheckCheck, Eye,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/store/useDataStore";
import { useRoleStore } from "@/store/useRoleStore";
import { type NotifType } from "@/lib/mockData/notifications";
import { cn } from "@/lib/utils";

const typeIcon: Record<NotifType, React.ElementType> = {
  homework:     BookOpen,
  attendance:   ClipboardList,
  fee:          DollarSign,
  announcement: Megaphone,
  meeting:      Calendar,
  exam:         FileText,
  message:      Mail,
  alert:        AlertTriangle,
  achievement:  Award,
};

const typeColor: Record<NotifType, string> = {
  homework:     "bg-blue-100 text-blue-600",
  attendance:   "bg-emerald-100 text-emerald-600",
  fee:          "bg-violet-100 text-violet-600",
  announcement: "bg-amber-100 text-amber-600",
  meeting:      "bg-indigo-100 text-indigo-600",
  exam:         "bg-orange-100 text-orange-600",
  message:      "bg-sky-100 text-sky-600",
  alert:        "bg-red-100 text-red-600",
  achievement:  "bg-yellow-100 text-yellow-700",
};

const priorityDot: Record<string, string> = {
  urgent: "bg-red-500",
  high:   "bg-amber-500",
  normal: "bg-slate-300",
};

const filterOptions: { id: NotifType | "all"; label: string }[] = [
  { id: "all",          label: "All" },
  { id: "alert",        label: "Alerts" },
  { id: "message",      label: "Messages" },
  { id: "homework",     label: "Homework" },
  { id: "exam",         label: "Exams" },
  { id: "attendance",   label: "Attendance" },
  { id: "fee",          label: "Finance" },
  { id: "meeting",      label: "Meetings" },
  { id: "announcement", label: "Announcements" },
  { id: "achievement",  label: "Achievements" },
];

export default function NotificationsPage() {
  const { activeRole } = useRoleStore();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useDataStore();
  const [filter, setFilter] = useState<NotifType | "all">("all");

  const roleNotifs = notifications.filter((n) => n.roles.includes(activeRole));
  const filtered = filter === "all" ? roleNotifs : roleNotifs.filter((n) => n.type === filter);
  const unread = roleNotifs.filter((n) => !n.isRead).length;

  const grouped = {
    today: filtered.filter((n) =>
      ["2 min ago", "18 min ago", "35 min ago", "1 hr ago", "2 hrs ago", "3 hrs ago", "5 hrs ago"].some((t) =>
        n.timestamp.includes(t.replace(" ago", ""))
      )
    ),
    yesterday: filtered.filter((n) => n.timestamp === "Yesterday"),
    earlier: filtered.filter((n) =>
      !["2 min ago", "18 min ago", "35 min ago", "1 hr ago", "2 hrs ago", "3 hrs ago", "5 hrs ago", "Yesterday"].some(
        (t) => n.timestamp === t || n.timestamp.startsWith(t.split(" ")[0])
      )
    ),
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notification Center"
        description={`${unread} unread · ${roleNotifs.length} total`}
        breadcrumbs={[{ label: "Communication" }, { label: "Notifications" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 text-xs"
              onClick={() => markAllNotificationsRead(activeRole)}
              disabled={unread === 0}>
              <CheckCheck className="h-4 w-4" /> Mark All Read
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Unread",  value: unread,                                                 color: "text-red-600 bg-red-50",     icon: Bell },
          { label: "Urgent",  value: roleNotifs.filter((n) => n.priority === "urgent").length, color: "text-amber-600 bg-amber-50", icon: AlertTriangle },
          { label: "Today",   value: roleNotifs.filter((n) => n.timestamp.includes("ago") || n.timestamp.includes("hr")).length, color: "text-blue-600 bg-blue-50", icon: Eye },
          { label: "Total",   value: roleNotifs.length,                                       color: "text-violet-600 bg-violet-50", icon: CheckCheck },
        ].map((s) => (
          <Card key={s.label} className={s.color}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className="h-6 w-6" />
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs font-medium">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filterOptions.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id as NotifType | "all")}
            className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
              filter === f.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"
            )}>
            {f.label}
            {f.id !== "all" && (
              <span className="ml-1 opacity-70">({roleNotifs.filter((n) => n.type === f.id).length})</span>
            )}
          </button>
        ))}
      </div>

      {[
        { title: "Today",     items: grouped.today },
        { title: "Yesterday", items: grouped.yesterday },
        { title: "Earlier",   items: grouped.earlier },
      ].map((group) => group.items.length > 0 && (
        <div key={group.title}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{group.title}</p>
          <div className="space-y-2">
            {group.items.map((notif) => {
              const Icon = typeIcon[notif.type];
              return (
                <Card key={notif.id}
                  className={cn("transition-all hover:shadow-sm cursor-pointer",
                    !notif.isRead && "ring-1 ring-primary/20 bg-primary/5"
                  )}
                  onClick={() => markNotificationRead(notif.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2.5 rounded-xl shrink-0", typeColor[notif.type])}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <p className={cn("text-sm font-semibold truncate", !notif.isRead && "text-foreground")}>
                              {notif.title}
                            </p>
                            {!notif.isRead && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={cn("h-2 w-2 rounded-full shrink-0", priorityDot[notif.priority])} title={notif.priority} />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{notif.timestamp}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{notif.body}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {notif.actor && <Badge variant="secondary" className="text-[10px]">By {notif.actor}</Badge>}
                          <Badge className={cn("text-[10px] capitalize", typeColor[notif.type])}>{notif.type}</Badge>
                          <Badge className={cn("text-[10px]",
                            notif.priority === "urgent" ? "bg-red-100 text-red-700" :
                            notif.priority === "high" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                          )}>
                            {notif.priority}
                          </Badge>
                          {notif.link && (
                            <Button variant="ghost" size="sm" className="text-xs h-5 px-2 ml-auto">View →</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No notifications in this category</p>
        </div>
      )}
    </div>
  );
}
