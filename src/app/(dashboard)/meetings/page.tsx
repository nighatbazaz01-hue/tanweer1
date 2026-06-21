"use client";
import { useState } from "react";
import {
  Calendar, Clock, MapPin, Users, Plus, CheckCircle,
  XCircle, HelpCircle, ChevronDown, FileText, Repeat,
  AlertCircle, ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useDataStore } from "@/store/useDataStore";
import { useRoleStore } from "@/store/useRoleStore";
import { useAuthStore } from "@/store/useAuthStore";
import { type Meeting, type RSVPStatus } from "@/lib/mockData/meetings";
import { filterMeetingsForRole, hasPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const typeColor: Record<string, string> = {
  parent_teacher: "bg-emerald-100 text-emerald-700",
  department:     "bg-blue-100 text-blue-700",
  staff:          "bg-violet-100 text-violet-700",
  one_on_one:     "bg-amber-100 text-amber-700",
  board:          "bg-slate-100 text-slate-700",
  emergency:      "bg-red-100 text-red-700",
};

const typeLabel: Record<string, string> = {
  parent_teacher: "Parent-Teacher",
  department:     "Department",
  staff:          "Staff",
  one_on_one:     "1-on-1",
  board:          "Board",
  emergency:      "🚨 Emergency",
};

const rsvpConfig: Record<RSVPStatus, { label: string; color: string; icon: React.ElementType }> = {
  accepted: { label: "Accepted", color: "text-emerald-600", icon: CheckCircle },
  declined: { label: "Declined", color: "text-red-500",     icon: XCircle },
  pending:  { label: "Pending",  color: "text-amber-600",   icon: HelpCircle },
  maybe:    { label: "Maybe",    color: "text-blue-500",    icon: HelpCircle },
};

const statusStyle: Record<string, string> = {
  upcoming:  "bg-blue-100 text-blue-700 border-blue-200",
  ongoing:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-red-100 text-red-500 border-red-200",
};

const ROOMS = ["Main Conference Room", "Board Room", "Hall A", "Room 201", "Room 305", "Online — Zoom", "Library Meeting Room"];

const STAFF_ROSTER = [
  { name: "Dr. Priya Sharma",  role: "Math Teacher",      avatar: "PS" },
  { name: "Mr. Imran Khan",    role: "Physics Teacher",   avatar: "IK" },
  { name: "Ms. Neha Gupta",    role: "English Teacher",   avatar: "NG" },
  { name: "Dr. Sunita Rao",    role: "Urdu Teacher",      avatar: "SR" },
  { name: "Mr. Vikram Singh",  role: "Chemistry Teacher", avatar: "VS" },
  { name: "Mr. Aaqib Wani",    role: "CS Teacher",        avatar: "AW" },
];

export default function MeetingsPage() {
  const { activeRole } = useRoleStore();
  const { user } = useAuthStore();
  const { meetings, addMeeting, updateRSVP } = useDataStore();

  const roleMeetings = filterMeetingsForRole(meetings, activeRole);

  const [selected, setSelected] = useState<Meeting | null>(null);
  const [viewFilter, setViewFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [scheduling, setScheduling] = useState(false);
  const [form, setForm] = useState({
    title: "", date: "", time: "09:00 AM", endTime: "10:00 AM",
    room: ROOMS[0], description: "", type: "staff" as Meeting["type"],
  });
  const [myRSVP, setMyRSVP] = useState<Record<string, RSVPStatus>>({});
  const [formAttendees, setFormAttendees] = useState<string[]>([]);

  const filtered = roleMeetings.filter((m) => {
    if (viewFilter === "upcoming") return ["upcoming", "ongoing"].includes(m.status);
    if (viewFilter === "completed") return m.status === "completed";
    return true;
  });

  const upcoming = roleMeetings.filter((m) => m.status === "upcoming").length;
  const pending  = roleMeetings.flatMap((m) => m.attendees).filter((a) => a.rsvp === "pending").length;

  const handleRSVP = (meetingId: string, status: RSVPStatus) => {
    const myName = user?.name || "Current User";
    updateRSVP(meetingId, myName, status);
    setMyRSVP((p) => ({ ...p, [meetingId]: status }));
    if (selected?.id === meetingId) {
      setSelected((prev) => prev ? {
        ...prev,
        attendees: prev.attendees.map((a) => a.name === myName ? { ...a, rsvp: status } : a),
      } : null);
    }
  };

  const handleSchedule = () => {
    if (!form.title.trim() || !form.date.trim()) return;
    const myName = user?.name || "Admin";
    const myAttendee = { name: myName, role: activeRole, avatar: myName.slice(0, 2).toUpperCase(), rsvp: "accepted" as RSVPStatus };
    const extraAttendees = formAttendees
      .map((n) => {
        const s = STAFF_ROSTER.find((sr) => sr.name === n);
        return s ? { name: s.name, role: s.role, avatar: s.avatar, rsvp: "pending" as RSVPStatus } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    addMeeting({
      title: form.title,
      date: form.date,
      time: form.time,
      endTime: form.endTime,
      room: form.room,
      description: form.description,
      type: form.type,
      status: "upcoming",
      organizer: { name: myName, role: activeRole, avatar: myName.slice(0, 2).toUpperCase() },
      attendees: [myAttendee, ...extraAttendees],
      agenda: [form.description || "Meeting agenda to be confirmed"],
      isRecurring: false,
      attachments: [],
    });
    setScheduling(false);
    setFormAttendees([]);
    setForm({ title: "", date: "", time: "09:00 AM", endTime: "10:00 AM", room: ROOMS[0], description: "", type: "staff" });
  };

  if (selected) {
    const acceptedCount = selected.attendees.filter((a) => a.rsvp === "accepted").length;
    const declinedCount = selected.attendees.filter((a) => a.rsvp === "declined").length;
    const pendingCount  = selected.attendees.filter((a) => a.rsvp === "pending").length;
    const currentRSVP   = myRSVP[selected.id];

    return (
      <div className="space-y-5">
        <PageHeader
          title={selected.title}
          description={`${selected.date} · ${selected.time} — ${selected.endTime}`}
          breadcrumbs={[{ label: "Meetings" }, { label: selected.title.slice(0, 30) + "…" }]}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelected(null)} size="sm">← Back</Button>
              {selected.status === "upcoming" && (
                <div className="flex gap-1">
                  {(["accepted", "maybe", "declined"] as RSVPStatus[]).map((s) => {
                    const cfg = rsvpConfig[s];
                    const Icon = cfg.icon;
                    return (
                      <Button key={s} size="sm" variant={currentRSVP === s ? "default" : "outline"}
                        className={cn("gap-1.5 text-xs", currentRSVP === s && "bg-emerald-600 hover:bg-emerald-700")}
                        onClick={() => handleRSVP(selected.id, s)}>
                        <Icon className="h-3.5 w-3.5" />
                        {cfg.label}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3 flex-wrap">
                  <Badge className={cn("capitalize", typeColor[selected.type])}>{typeLabel[selected.type]}</Badge>
                  <Badge className={cn("capitalize border", statusStyle[selected.status])}>{selected.status}</Badge>
                  {selected.isRecurring && (
                    <Badge variant="secondary" className="gap-1"><Repeat className="h-3 w-3" />{selected.recurringPattern}</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 shrink-0" /><span>{selected.date}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 shrink-0" /><span>{selected.time} — {selected.endTime}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" /><span>{selected.room}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4 shrink-0" /><span>{selected.attendees.length} attendees</span></div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.description}</p>
                </div>
                {selected.grades && (
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">Grades:</p>
                    {selected.grades.map((g) => <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Meeting Agenda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selected.agenda.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
                    <p className="text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {selected.notes && (
              <Card className="border-amber-200 bg-amber-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-amber-800">Meeting Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-amber-900 leading-relaxed">{selected.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Attendees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                  <div className="bg-emerald-50 rounded-lg p-2"><p className="font-bold text-emerald-700 text-lg">{acceptedCount}</p><p className="text-emerald-600">Accepted</p></div>
                  <div className="bg-red-50 rounded-lg p-2"><p className="font-bold text-red-600 text-lg">{declinedCount}</p><p className="text-red-500">Declined</p></div>
                  <div className="bg-amber-50 rounded-lg p-2"><p className="font-bold text-amber-600 text-lg">{pendingCount}</p><p className="text-amber-600">Pending</p></div>
                </div>
                <div className="space-y-2">
                  {selected.attendees.map((att, i) => {
                    const rsvp = rsvpConfig[att.rsvp];
                    const RsvpIcon = rsvp.icon;
                    return (
                      <div key={i} className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-blue-100 text-blue-700">{att.avatar}</AvatarFallback></Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{att.name}</p>
                          <p className="text-xs text-muted-foreground">{att.role}</p>
                        </div>
                        <div className={cn("flex items-center gap-1 text-xs shrink-0", rsvp.color)}>
                          <RsvpIcon className="h-3.5 w-3.5" />
                          <span className="hidden sm:block">{rsvp.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Organizer</CardTitle></CardHeader>
              <CardContent className="flex items-center gap-3">
                <Avatar className="h-10 w-10"><AvatarFallback className="bg-violet-100 text-violet-700 font-bold">{selected.organizer.avatar}</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold text-sm">{selected.organizer.name}</p>
                  <p className="text-xs text-muted-foreground">{selected.organizer.role}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Meetings"
        description={`${upcoming} upcoming · ${roleMeetings.filter((m) => m.status === "completed").length} completed`}
        breadcrumbs={[{ label: "Communication" }, { label: "Meetings" }]}
        actions={
          hasPermission(activeRole, "canScheduleMeetings") && (
            <Button size="sm" className="gap-2" onClick={() => setScheduling(true)}>
              <Plus className="h-4 w-4" /> Schedule Meeting
            </Button>
          )
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Upcoming",      value: upcoming,                                                        color: "bg-blue-50 text-blue-700",    icon: Calendar },
          { label: "Pending RSVPs", value: pending,                                                         color: "bg-amber-50 text-amber-700",  icon: HelpCircle },
          { label: "Completed",     value: roleMeetings.filter((m) => m.status === "completed").length,     color: "bg-emerald-50 text-emerald-700", icon: CheckCircle },
          { label: "Total",         value: roleMeetings.length,                                             color: "bg-slate-50 text-slate-700",  icon: Users },
        ].map((s) => (
          <Card key={s.label} className={s.color}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className="h-6 w-6" />
              <div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs font-medium">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        {(["all", "upcoming", "completed"] as const).map((f) => (
          <button key={f} onClick={() => setViewFilter(f)}
            className={cn("px-4 py-1.5 rounded-full text-xs font-medium capitalize border transition-all",
              viewFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"
            )}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((meeting) => {
          const accepted = meeting.attendees.filter((a) => a.rsvp === "accepted").length;
          const pct = Math.round((accepted / meeting.attendees.length) * 100);
          return (
            <Card key={meeting.id}
              className={cn("cursor-pointer hover:shadow-md transition-all",
                meeting.type === "emergency" && "border-red-200 bg-red-50/20",
                meeting.status === "upcoming" && "border-l-4 border-l-blue-400"
              )}
              onClick={() => setSelected(meeting)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="text-center min-w-[56px] shrink-0">
                    <div className={cn("rounded-xl p-2", typeColor[meeting.type])}>
                      <Calendar className="h-5 w-5 mx-auto" />
                    </div>
                    <p className="text-[10px] mt-1 text-muted-foreground font-medium">{typeLabel[meeting.type]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm">{meeting.title}</p>
                      <Badge className={cn("text-xs border shrink-0 capitalize", statusStyle[meeting.status])}>{meeting.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{meeting.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{meeting.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{meeting.room}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex -space-x-2">
                        {meeting.attendees.slice(0, 5).map((a, i) => (
                          <Avatar key={i} className="h-6 w-6 ring-2 ring-background">
                            <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700">{a.avatar}</AvatarFallback>
                          </Avatar>
                        ))}
                        {meeting.attendees.length > 5 && (
                          <div className="h-6 w-6 rounded-full bg-muted ring-2 ring-background flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                            +{meeting.attendees.length - 5}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-16 bg-muted rounded-full h-1">
                          <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span>{accepted}/{meeting.attendees.length} RSVPed</span>
                      </div>
                      {meeting.isRecurring && (
                        <Badge variant="secondary" className="text-[10px] gap-1 ml-auto">
                          <Repeat className="h-2.5 w-2.5" />Recurring
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No meetings found</p>
          </div>
        )}
      </div>

      {/* Schedule Meeting Dialog */}
      <Dialog open={scheduling} onOpenChange={setScheduling}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Meeting Title</label>
              <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="E.g. Grade 10 Parent-Teacher Meeting" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Date</label>
                <Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Room / Location</label>
                <select value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {ROOMS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Meeting Type</label>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(typeLabel) as [Meeting["type"], string][]).map(([t, label]) => (
                  <button key={t} onClick={() => setForm((p) => ({ ...p, type: t }))}
                    className={cn("px-3 py-1.5 rounded-full text-xs font-medium border capitalize transition-all",
                      form.type === t ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"
                    )}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Description / Agenda</label>
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="What will be discussed?"
                rows={3}
                className="w-full text-sm bg-muted/30 rounded-xl p-3 resize-none border border-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Invite Staff {formAttendees.length > 0 && <span className="text-primary">({formAttendees.length} selected)</span>}
              </label>
              <div className="space-y-1 max-h-36 overflow-y-auto border rounded-lg p-2 bg-muted/20">
                {STAFF_ROSTER.map((s) => (
                  <label key={s.name} className="flex items-center gap-2.5 cursor-pointer px-2 py-1.5 rounded hover:bg-muted/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={formAttendees.includes(s.name)}
                      onChange={(e) => setFormAttendees((prev) =>
                        e.target.checked ? [...prev, s.name] : prev.filter((n) => n !== s.name)
                      )}
                      className="h-3.5 w-3.5 rounded accent-primary"
                    />
                    <Avatar className="h-6 w-6 shrink-0">
                      <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">{s.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground">{s.role}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduling(false)}>Cancel</Button>
            <Button onClick={handleSchedule} disabled={!form.title.trim() || !form.date.trim()} className="gap-2">
              <Calendar className="h-4 w-4" /> Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
