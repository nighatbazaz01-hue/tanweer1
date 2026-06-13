"use client";
import { useState, useRef } from "react";
import {
  Search, Star, Paperclip, ChevronRight, ArrowLeft,
  Plus, Inbox, Send, Archive, Tag,
  Mail, Reply, Forward, Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDataStore } from "@/store/useDataStore";
import { useRoleStore } from "@/store/useRoleStore";
import { useAuthStore } from "@/store/useAuthStore";
import { mockInboxStats, type Thread, type Message } from "@/lib/mockData/messages";
import { cn } from "@/lib/utils";

const priorityStyle: Record<string, string> = {
  urgent: "bg-red-100 text-red-700 border-red-200",
  high:   "bg-amber-100 text-amber-700 border-amber-200",
  normal: "bg-slate-100 text-slate-600 border-slate-200",
  low:    "bg-slate-50 text-slate-400 border-slate-100",
};

const labelColor: Record<string, string> = {
  academic:   "bg-blue-100 text-blue-700",
  homework:   "bg-violet-100 text-violet-700",
  finance:    "bg-emerald-100 text-emerald-700",
  meeting:    "bg-amber-100 text-amber-700",
  attendance: "bg-red-100 text-red-700",
};

const roleAvatar: Record<string, string> = {
  admin: "AD", teacher: "TC", vp1: "VP", vp2: "VP", vp3: "VP", parent: "PR", student: "ST",
};

const roleName: Record<string, string> = {
  admin: "School Admin", teacher: "Teacher", vp1: "Vice Principal", vp2: "Vice Principal",
  vp3: "Vice Principal", parent: "Parent", student: "Student",
};

const folders = [
  { id: "inbox",    label: "Inbox",    icon: Inbox,   count: 0 },
  { id: "sent",     label: "Sent",     icon: Send,    count: 0 },
  { id: "starred",  label: "Starred",  icon: Star,    count: 0 },
  { id: "archived", label: "Archived", icon: Archive, count: 0 },
];

export default function MessagesPage() {
  const { activeRole } = useRoleStore();
  const { user } = useAuthStore();
  const { threads, sendReply, createThread, toggleStar } = useDataStore();

  const [activeFolder, setActiveFolder] = useState("inbox");
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [search, setSearch] = useState("");
  const [composing, setComposing] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [composeData, setComposeData] = useState({ to: "", subject: "", body: "", priority: "normal" as "urgent" | "high" | "normal" | "low" });

  const fromSender = {
    name: user?.name || roleName[activeRole] || "User",
    role: roleName[activeRole] || "User",
    avatar: roleAvatar[activeRole] || "U",
  };

  const displayedThreads = threads.filter((t) => {
    if (activeFolder === "starred") return t.isStarred;
    if (activeFolder === "archived") return t.isArchived;
    return !t.isArchived;
  });

  const filtered = displayedThreads.filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.participants.some((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const totalUnread = threads.reduce((acc, t) => acc + t.unreadCount, 0);
  const starredCount = threads.filter((t) => t.isStarred).length;

  const handleSendReply = () => {
    if (!selectedThread || !replyBody.trim()) return;
    sendReply(selectedThread.id, replyBody, fromSender);
    const updated = useDataStore.getState().threads.find((t) => t.id === selectedThread.id);
    if (updated) setSelectedThread({ ...updated });
    setReplyBody("");
  };

  const handleCompose = () => {
    if (!composeData.to.trim() || !composeData.body.trim()) return;
    createThread(
      composeData.subject || "(No subject)",
      composeData.to,
      composeData.body,
      composeData.priority,
      fromSender
    );
    setComposing(false);
    setComposeData({ to: "", subject: "", body: "", priority: "normal" });
  };

  if (composing) {
    return (
      <div className="space-y-5">
        <PageHeader
          title="New Message"
          breadcrumbs={[{ label: "Messages" }, { label: "Compose" }]}
          actions={
            <Button variant="outline" onClick={() => setComposing(false)} size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          }
        />
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 border-b pb-3">
                <span className="text-sm font-medium text-muted-foreground w-16">To:</span>
                <Input value={composeData.to} onChange={(e) => setComposeData((p) => ({ ...p, to: e.target.value }))}
                  placeholder="Recipient name or role..." className="border-0 shadow-none focus-visible:ring-0 flex-1" />
              </div>
              <div className="flex items-center gap-3 border-b pb-3">
                <span className="text-sm font-medium text-muted-foreground w-16">Subject:</span>
                <Input value={composeData.subject} onChange={(e) => setComposeData((p) => ({ ...p, subject: e.target.value }))}
                  placeholder="Message subject..." className="border-0 shadow-none focus-visible:ring-0 flex-1" />
              </div>
              <div className="flex items-center gap-3 border-b pb-3">
                <span className="text-sm font-medium text-muted-foreground w-16">Priority:</span>
                <div className="flex gap-2">
                  {(["urgent", "high", "normal", "low"] as const).map((p) => (
                    <button key={p} onClick={() => setComposeData((prev) => ({ ...prev, priority: p }))}
                      className={cn("px-3 py-1 rounded-full text-xs font-medium border capitalize", priorityStyle[p],
                        composeData.priority === p && "ring-2 ring-primary/40"
                      )}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <textarea
              value={composeData.body}
              onChange={(e) => setComposeData((p) => ({ ...p, body: e.target.value }))}
              placeholder="Write your message here..."
              rows={12}
              className="w-full text-sm bg-muted/30 rounded-xl p-4 resize-none border border-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="flex items-center justify-between pt-2 border-t">
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <Paperclip className="h-3.5 w-3.5" /> Attach File
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setComposing(false)}>Cancel</Button>
                <Button size="sm" className="gap-2 bg-primary" onClick={handleCompose}
                  disabled={!composeData.to.trim() || !composeData.body.trim()}>
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedThread) {
    return (
      <div className="space-y-5">
        <PageHeader
          title={selectedThread.subject}
          breadcrumbs={[{ label: "Messages" }, { label: "Thread" }]}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setSelectedThread(null)} size="sm" className="gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => {
                toggleStar(selectedThread.id);
                setSelectedThread((t) => t ? { ...t, isStarred: !t.isStarred } : null);
              }}>
                <Star className={cn("h-4 w-4", selectedThread.isStarred && "fill-amber-400 text-amber-400")} />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9"><Archive className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500"><Trash2 className="h-4 w-4" /></Button>
            </div>
          }
        />

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={cn("text-xs capitalize", priorityStyle[selectedThread.priority])}>
            {selectedThread.priority} priority
          </Badge>
          {selectedThread.label && (
            <Badge className={cn("text-xs capitalize", labelColor[selectedThread.label] || "bg-slate-100")}>
              {selectedThread.label}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {selectedThread.messages.length} message{selectedThread.messages.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-4">
          {selectedThread.messages.map((msg: Message, i: number) => (
            <Card key={msg.id} className={cn("transition-all", msg.status === "unread" && "ring-2 ring-primary/20 bg-primary/5")}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-sm font-bold bg-indigo-100 text-indigo-700">{msg.from.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{msg.from.name}</p>
                      <p className="text-xs text-muted-foreground">{msg.from.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {msg.status === "unread" && <Badge className="text-xs bg-primary text-primary-foreground">New</Badge>}
                    <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                  </div>
                </div>

                {msg.to.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span>To:</span>
                    {msg.to.map((r) => (
                      <Badge key={r.name} variant="secondary" className="text-xs">{r.name}</Badge>
                    ))}
                  </div>
                )}

                <div className="text-sm leading-relaxed whitespace-pre-line text-slate-700 bg-muted/30 rounded-xl p-4">
                  {msg.body}
                </div>

                {msg.hasAttachment && msg.attachmentName && (
                  <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100 w-fit">
                    <Paperclip className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">{msg.attachmentName}</span>
                    <Button variant="ghost" size="sm" className="text-xs h-6 text-blue-600">Download</Button>
                  </div>
                )}

                {i === selectedThread.messages.length - 1 && (
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button size="sm" className="gap-2"><Reply className="h-3.5 w-3.5" /> Reply</Button>
                    <Button variant="outline" size="sm" className="gap-2"><Forward className="h-3.5 w-3.5" /> Forward</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-4">
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Write a reply..."
              rows={3}
              className="w-full text-sm bg-muted/30 rounded-xl p-3 resize-none border border-muted focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
            />
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" className="gap-2 text-xs"><Paperclip className="h-3.5 w-3.5" /> Attach</Button>
              <Button size="sm" className="gap-2" onClick={handleSendReply} disabled={!replyBody.trim()}>
                <Send className="h-3.5 w-3.5" /> Send Reply
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Messages"
        description={`${totalUnread} unread · ${mockInboxStats.total.toLocaleString()} total messages`}
        breadcrumbs={[{ label: "Communication" }, { label: "Messages" }]}
        actions={
          <Button onClick={() => setComposing(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Compose
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="space-y-2">
          {folders.map((f) => {
            const Icon = f.icon;
            const cnt = f.id === "inbox" ? totalUnread : f.id === "starred" ? starredCount : 0;
            return (
              <button key={f.id} onClick={() => setActiveFolder(f.id)}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  activeFolder === f.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                )}>
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{f.label}</span>
                {cnt > 0 && (
                  <Badge className={cn("text-xs", activeFolder === f.id ? "bg-white/20 text-white" : "bg-primary/10 text-primary")}>
                    {cnt}
                  </Badge>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t mt-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">Labels</p>
            {Object.entries(labelColor).map(([label, cls]) => (
              <button key={label} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-muted capitalize">
                <span className={cn("h-2.5 w-2.5 rounded-full inline-block", cls.replace("text-", "bg-").split(" ")[0])} />
                {label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t mt-3 space-y-1 text-xs text-muted-foreground px-3">
            <div className="flex justify-between"><span>Total</span><span className="font-semibold">{mockInboxStats.total.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Sent</span><span className="font-semibold">{mockInboxStats.sent}</span></div>
            <div className="flex justify-between"><span>Archived</span><span className="font-semibold">{mockInboxStats.archived}</span></div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..." className="pl-9 h-9" />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Tag className="h-3.5 w-3.5" /> Filter
            </Button>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Mail className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No messages found</p>
            </div>
          ) : (
            filtered.map((thread) => (
              <Card key={thread.id}
                className={cn("cursor-pointer hover:shadow-md transition-all", thread.unreadCount > 0 && "ring-1 ring-primary/20 bg-primary/5")}
                onClick={() => setSelectedThread(thread)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-xs font-bold bg-indigo-100 text-indigo-700">
                          {thread.participants[0].avatar}
                        </AvatarFallback>
                      </Avatar>
                      {thread.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={cn("text-sm font-semibold truncate", thread.unreadCount > 0 ? "text-foreground" : "text-muted-foreground")}>
                          {thread.participants.map((p) => p.name).join(", ")}
                        </span>
                        <div className="flex items-center gap-1.5 ml-auto shrink-0">
                          {thread.isStarred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                          <span className="text-xs text-muted-foreground">{thread.lastTimestamp}</span>
                        </div>
                      </div>
                      <p className={cn("text-sm truncate flex-1 mb-1", thread.unreadCount > 0 ? "font-semibold" : "font-medium text-muted-foreground")}>
                        {thread.subject}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge className={cn("text-[10px] capitalize border", priorityStyle[thread.priority])}>
                          {thread.priority}
                        </Badge>
                        {thread.label && (
                          <Badge className={cn("text-[10px] capitalize", labelColor[thread.label] || "bg-slate-100")}>
                            {thread.label}
                          </Badge>
                        )}
                        {thread.messages.some((m) => m.hasAttachment) && (
                          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                            <Paperclip className="h-3 w-3" /> attachment
                          </span>
                        )}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {thread.messages.length} msg{thread.messages.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
