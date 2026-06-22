"use client";
import { useState, useMemo } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllTeachers } from "@/lib/mockData/population";
import { useRoleStore } from "@/store/useRoleStore";
import { filterTeachersForRole, getRoleScopeLabel } from "@/lib/permissions";

const PAGE_SIZE = 20;

const SUBJECTS = [
  "Mathematics", "English", "Urdu", "Physics", "Chemistry",
  "Biology", "Computer Science", "Islamic Studies", "History",
  "Geography", "Physical Education", "Art", "Social Studies",
];

const GRADE_GROUPS = [
  { label: "Grades 1–4", value: "1" },
  { label: "Grades 5–8", value: "5" },
  { label: "Grades 9–12", value: "9" },
];

export default function TeacherDirectoryPage() {
  const { activeRole } = useRoleStore();
  const allTeachers = useMemo(() => filterTeachersForRole(getAllTeachers(), activeRole), [activeRole]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [gradeGroupFilter, setGradeGroupFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allTeachers.filter((t) => {
      if (q && !t.name.toLowerCase().includes(q) && !t.subject.toLowerCase().includes(q)) return false;
      if (subjectFilter !== "all" && t.subject !== subjectFilter) return false;
      if (gradeGroupFilter !== "all" && !t.assignedGrades.includes(Number(gradeGroupFilter))) return false;
      return true;
    });
  }, [allTeachers, search, subjectFilter, gradeGroupFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleSubject = (v: string) => { setSubjectFilter(v); setPage(1); };
  const handleGradeGroup = (v: string) => { setGradeGroupFilter(v); setPage(1); };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Teacher Directory"
        description={`${allTeachers.length} teachers · All departments`}
        breadcrumbs={[{ label: "Directories" }, { label: "Teachers" }]}
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or subject..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={subjectFilter} onValueChange={handleSubject}>
                <SelectTrigger className="w-36 h-9 text-xs">
                  <Filter className="h-3 w-3 mr-1 text-muted-foreground" />
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={gradeGroupFilter} onValueChange={handleGradeGroup}>
                <SelectTrigger className="w-36 h-9 text-xs">
                  <SelectValue placeholder="Grade Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {GRADE_GROUPS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3">{filtered.length} results</p>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Teacher</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Qualification</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Assigned Grades</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Experience</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginated.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="text-xs font-semibold bg-violet-100 text-violet-700">{t.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium truncate max-w-[160px]">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{t.employeeId}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs">{t.subject}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-[160px]">{t.qualification}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {t.assignedGrades.map((g) => (
                        <Badge key={g} variant="outline" className="text-xs px-1.5">G{g}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">{t.yearsExperience} yrs</td>
                  <td className="px-4 py-3">
                    <p className="text-xs truncate max-w-[160px]">{t.phone}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[160px]">{t.email}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages} · {filtered.length} teachers
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const p = start + i;
              if (p < 1 || p > totalPages) return null;
              return (
                <Button key={p} variant={p === page ? "default" : "outline"} size="sm" className="h-8 w-8 text-xs p-0" onClick={() => setPage(p)}>
                  {p}
                </Button>
              );
            })}
            <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
