"use client";
import { useState } from "react";
import {
  Megaphone, Pin, Clock, Users, Paperclip, Plus,
  Eye, Search, Filter, Calendar, Tag, AlertCircle,
  Globe, GraduationCap, Heart, BookOpen,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { announcements, getAnnouncementsForRole, type Announcement, type AnnouncementCategory } from "@/lib/mockData/announcements";
import { useRoleStore } from "@/store/useRoleStore";
import { cn } from "@/lib/utils";

const categoryStyle: Record<AnnouncementCategory, { color: string; icon: React.ElementType; label: string }> = {
  academic: { color: "bg-blue-100 text-blue-700", icon: BookOpen, label: "Academic" },
  event: { color: "bg-violet-100 text-violet-700", icon: Calendar, label: "Event" },
  administrative: { color: "bg-slate-100 text-slate-700", icon: Tag, label: "Admin" },
  urgent: { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "Urgent" },
  holiday: { color: "bg-green-100 text-green-700", icon: Calendar, label: "Holiday" },
  sports: { color: "bg-amber-100 text-amber-700", icon: Globe, label: "Sports" },
  achievement: { color: "bg-yellow-100 text-yellow-700", icon: GraduationCap, label: "Achievement" },
};

const audienceLabel: Record<string, string> = {
  school_wide: "🌐 School Wide",
  teachers: "👨‍🏫 Teachers",
  parents: "👨‍👩‍👧 Parents",
  students: "🎓 Students",
  grade_specific: "📚 Grade Specific",
  department: "🏛 Department",
};

export default function AnnouncementsPage() {
  const { activeRole } = useRoleStore();
  const roleAnnouncements = getAnnouncementsForRole(activeRole);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<AnnouncementCategory | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = roleAnnouncements.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.body.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.includes(search.toLowerCase()));
    const matchCat = catFilter === "all" || a.category === catFilter;
    return matchSearch && matchCat;
  });

  const pinned = filtered.filter((a) => a.isPinned && !a.isScheduled);
  const scheduled = filtered.filter((a) => a.isScheduled);
  const regular = filtered.filter((a) => !a.isPinned && !a.isScheduled);

  const cats: (AnnouncementCategory | "all")[] = ["all", "urgent", "academic", "event", "sports", "achievement", "administrative"];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Announcements Hub"
        description={`${roleAnnouncements.filter((a) => !a.isScheduled).length} published · ${roleAnnouncements.filter((a) => a.isScheduled).length} scheduled`}
        breadcrumbs={[{ label: "Communication" }, { label: "Announcements" }]}
        actions={
          (activeRole === "admin" || activeRole === "teacher") && (
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> New Announcement
            </Button>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Published", value: roleAnnouncements.filter((a) => !a.isScheduled).length, color: "bg-blue-50 text-blue-700" },
          { label: "Pinned", value: roleAnnouncements.filter((a) => a.isPinned).length, color: "bg-amber-50 text-amber-700" },
          { label: "Scheduled", value: roleAnnouncements.filter((a) => a.isScheduled).length, color: "bg-violet-50 text-violet-700" },
          { label: "Total Reach", value: "1,247", color: "bg-emerald-50 text-emerald-700" },
        ].map((s) => (
          <Card key={s.label} className={s.color}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search announcements..." className="pl-9 h-9" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap capitalize border transition-all",
                catFilter === cat ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"
              )}
            >
              {cat === "all" ? "All" : categoryStyle[cat as AnnouncementCategory]?.label || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Pin className="h-4 w-4 text-amber-500 fill-amber-400" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pinned Announcements</p>
          </div>
          <div className="space-y-3">
            {pinned.map((a) => <AnnouncementCard key={a.id} a={a} expanded={expanded} setExpanded={setExpanded} />)}
          </div>
        </div>
      )}

      {/* Scheduled */}
      {scheduled.length > 0 && (activeRole === "admin" || activeRole === "teacher") && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-violet-500" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Scheduled</p>
          </div>
          <div className="space-y-3">
            {scheduled.map((a) => <AnnouncementCard key={a.id} a={a} expanded={expanded} setExpanded={setExpanded} isScheduled />)}
          </div>
        </div>
      )}

      {/* Regular */}
      {regular.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="h-4 w-4 text-slate-500" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">All Announcements</p>
          </div>
          <div className="space-y-3">
            {regular.map((a) => <AnnouncementCard key={a.id} a={a} expanded={expanded} setExpanded={setExpanded} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Megaphone className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No announcements found</p>
        </div>
      )}
    </div>
  );
}

function AnnouncementCard({ a, expanded, setExpanded, isScheduled }: {
  a: Announcement;
  expanded: string | null;
  setExpanded: (id: string | null) => void;
  isScheduled?: boolean;
}) {
  const isOpen = expanded === a.id;
  const cat = categoryStyle[a.category];
  const Icon = cat.icon;
  const pct = a.totalAudience > 0 ? Math.round((a.readCount / a.totalAudience) * 100) : 0;

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      a.isPinned && "border-amber-200 bg-amber-50/30",
      a.category === "urgent" && "border-red-200 bg-red-50/20",
      isScheduled && "border-violet-200 bg-violet-50/20 opacity-80"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className={cn("p-2.5 rounded-xl shrink-0", cat.color)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                {a.isPinned && <Pin className="h-3.5 w-3.5 text-amber-500 fill-amber-400 shrink-0" />}
                {isScheduled && <Clock className="h-3.5 w-3.5 text-violet-500 shrink-0" />}
                <h3 className="font-semibold text-sm">{a.title}</h3>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                {isScheduled ? `Scheduled: ${a.scheduledFor}` : a.publishedAt}
              </span>
            </div>

            <div className={cn("text-sm text-muted-foreground leading-relaxed", !isOpen && "line-clamp-2")}>
              {a.body}
            </div>

            {a.body.length > 200 && (
              <button
                onClick={() => setExpanded(isOpen ? null : a.id)}
                className="text-xs text-primary font-medium mt-1 hover:underline"
              >
                {isOpen ? "Show less" : "Read more"}
              </button>
            )}

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <div className="flex items-center gap-1 flex-wrap">
                {a.audience.map((aud) => (
                  <Badge key={aud} variant="secondary" className="text-[10px]">{audienceLabel[aud] || aud}</Badge>
                ))}
                {a.gradeFilter && a.gradeFilter.map((g) => (
                  <Badge key={g} className="text-[10px] bg-blue-50 text-blue-700">{g}</Badge>
                ))}
              </div>

              <div className="ml-auto flex items-center gap-3">
                {!isScheduled && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{a.readCount.toLocaleString()}/{a.totalAudience.toLocaleString()}</span>
                    <div className="w-16 bg-muted rounded-full h-1">
                      <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span>{pct}%</span>
                  </div>
                )}
                {a.attachments && a.attachments.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Paperclip className="h-3 w-3" />
                    <span>{a.attachments.length}</span>
                  </div>
                )}
              </div>
            </div>

            {a.tags.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {a.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
