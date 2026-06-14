"use client";
import { useState, useMemo } from "react";
import { Search, Plus, Filter, Eye, ChevronLeft, ChevronRight, X, Check, Phone, Mail, User } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useDataStore } from "@/store/useDataStore";
import { useRoleStore } from "@/store/useRoleStore";
import { useAuthStore } from "@/store/useAuthStore";
import { filterStudentsForRole, getRoleScopeLabel } from "@/lib/permissions";
import { PinGate } from "@/components/common/PinGate";
import { getPinForRole } from "@/lib/mockData/credentials";
import type { Student } from "@/lib/mockData/population";

const tierVariant: Record<string, "success" | "destructive" | "warning" | "secondary"> = {
  top: "success",
  average: "secondary",
  "at-risk": "destructive",
};

const PAGE_SIZE = 40;

export default function StudentsPage() {
  const { activeRole } = useRoleStore();
  const { user } = useAuthStore();
  const { students, addStudent } = useDataStore();

  const allStudents = useMemo(
    () => filterStudentsForRole(students, activeRole),
    [students, activeRole]
  );

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<number | "all">("all");
  const [page, setPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState(1);
  const [newSection, setNewSection] = useState("A");
  const [newParent, setNewParent] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [profileStudent, setProfileStudent] = useState<Student | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allStudents.filter((s) => {
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.parentName.toLowerCase().includes(q);
      const matchGrade = gradeFilter === "all" || s.grade === gradeFilter;
      return matchSearch && matchGrade;
    });
  }, [allStudents, search, gradeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleGrade = (g: number | "all") => { setGradeFilter(g); setPage(1); };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddStudent = () => {
    if (!newName.trim()) return;
    const name = newName.trim();
    addStudent(name, newGrade, newSection, newParent.trim(), newPhone.trim(), user?.name || "admin");
    setAddOpen(false);
    setNewName(""); setNewGrade(1); setNewSection("A"); setNewParent(""); setNewPhone("");
    showToast(`Student "${name}" added to Grade ${newGrade}-${newSection}`);
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
        title="Students"
        description={`${allStudents.length.toLocaleString()} students · ${getRoleScopeLabel(activeRole)}`}
        breadcrumbs={[{ label: "Home" }, { label: "Students" }]}
        actions={
          activeRole === "admin" ? (
            <Button size="sm" className="gap-2" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or parent..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <button
            onClick={() => handleGrade("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${gradeFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"}`}
          >
            All
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
            <button
              key={g}
              onClick={() => handleGrade(g)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${gradeFilter === g ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-muted-foreground"}`}
            >
              G{g}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground ml-auto whitespace-nowrap">
          {filtered.length.toLocaleString()} students
        </p>
      </div>

      <div className="grid gap-2.5">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span>Student</span>
          <span>Grade</span>
          <span>GPA</span>
          <span>Attendance</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {paginated.map((student) => (
          <Card key={student.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-3.5">
              <div className="flex items-center gap-4">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {student.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 items-center">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.id} · {student.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm">Grade {student.grade}</p>
                    <p className="text-xs text-muted-foreground">Section {student.section}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{student.gpa > 0 ? student.gpa.toFixed(1) : "N/A"}</p>
                    <p className="text-xs text-muted-foreground">of 4.0</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{student.attendanceRate > 0 ? `${student.attendanceRate}%` : "—"}</p>
                    <p className="text-xs text-muted-foreground">this term</p>
                  </div>
                  <Badge variant={tierVariant[student.performanceTier]} className="w-fit capitalize text-xs">
                    {student.performanceTier === "at-risk" ? "At Risk" : student.performanceTier}
                  </Badge>
                  <div className="hidden md:flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="text-xs gap-1.5"
                      onClick={() => setProfileStudent(student)}>
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No students found matching your search.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} · showing {paginated.length} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="gap-1">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Add Student Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add New Student
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Full Name *</label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Mohammed Al-Rashidi" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Grade</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={newGrade} onChange={(e) => setNewGrade(parseInt(e.target.value))}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Section</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={newSection} onChange={(e) => setNewSection(e.target.value)}>
                  {["A","B","C","D"].map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Parent / Guardian Name</label>
              <Input value={newParent} onChange={(e) => setNewParent(e.target.value)} placeholder="e.g. Ahmed Al-Rashidi" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Parent Phone</label>
              <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+966 5xxxxxxxx" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="gap-1">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleAddStudent} disabled={!newName.trim()} className="gap-1">
              <Check className="h-4 w-4" /> Add Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Profile Dialog */}
      <Dialog open={!!profileStudent} onOpenChange={(o) => !o && setProfileStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Student Profile
            </DialogTitle>
          </DialogHeader>
          {profileStudent && (
            <div className="space-y-4 py-1">
              <div className="flex items-center gap-4 p-3 bg-muted rounded-xl">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                    {profileStudent.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-base">{profileStudent.name}</p>
                  <p className="text-sm text-muted-foreground">{profileStudent.id} · Grade {profileStudent.grade} — Section {profileStudent.section}</p>
                  <Badge variant={tierVariant[profileStudent.performanceTier]} className="mt-1 text-xs capitalize">
                    {profileStudent.performanceTier === "at-risk" ? "At Risk" : profileStudent.performanceTier}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "GPA", value: profileStudent.gpa > 0 ? `${profileStudent.gpa.toFixed(1)} / 4.0` : "N/A" },
                  { label: "Attendance", value: profileStudent.attendanceRate > 0 ? `${profileStudent.attendanceRate}%` : "—" },
                  { label: "Gender", value: profileStudent.gender === "male" ? "Male" : "Female" },
                  { label: "Enrolled", value: `${profileStudent.enrolledYear}` },
                  { label: "Nationality", value: profileStudent.nationality || "—" },
                  { label: "Blood Type", value: profileStudent.bloodType || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/60 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              {profileStudent.interests?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profileStudent.interests.map((interest) => (
                      <span key={interest} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{interest}</span>
                    ))}
                  </div>
                </div>
              )}
              {profileStudent.medicalNote && (
                <div className="flex items-start gap-2 text-xs p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                  <span className="shrink-0 mt-0.5">⚕️</span>
                  <span><strong>Medical:</strong> {profileStudent.medicalNote}</span>
                </div>
              )}
              {profileStudent.emergencyContact && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Emergency Contact</p>
                  <div className="text-sm bg-muted/50 rounded-lg px-3 py-2 space-y-0.5">
                    <p className="font-medium">{profileStudent.emergencyContact.name} <span className="text-xs text-muted-foreground">({profileStudent.emergencyContact.relation})</span></p>
                    <PinGate correctPin={getPinForRole(activeRole as Parameters<typeof getPinForRole>[0]) ?? ""} role={activeRole} actor={user?.name || activeRole} field="Emergency Contact Phone" inline>
                      <span className="text-xs text-muted-foreground">{profileStudent.emergencyContact.phone}</span>
                    </PinGate>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Parent / Guardian</p>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{profileStudent.parentName || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <PinGate
                    correctPin={getPinForRole(activeRole as Parameters<typeof getPinForRole>[0]) ?? ""}
                    role={activeRole}
                    actor={user?.name || activeRole}
                    field="Parent Phone"
                    inline
                  >
                    <span>{profileStudent.parentPhone || "—"}</span>
                  </PinGate>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <PinGate
                    correctPin={getPinForRole(activeRole as Parameters<typeof getPinForRole>[0]) ?? ""}
                    role={activeRole}
                    actor={user?.name || activeRole}
                    field="Parent Email"
                    inline
                  >
                    <span className="truncate">{profileStudent.parentEmail || "—"}</span>
                  </PinGate>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileStudent(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
