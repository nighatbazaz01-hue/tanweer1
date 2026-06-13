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
import { getAllStudents } from "@/lib/mockData/population";
import { useRoleStore } from "@/store/useRoleStore";
import { filterStudentsForRole, getRoleScopeLabel } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

const tierBadge: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  top: { label: "Top Performer", variant: "success" },
  average: { label: "Average", variant: "secondary" },
  "at-risk": { label: "At-Risk", variant: "destructive" },
};

export default function StudentDirectoryPage() {
  const { activeRole } = useRoleStore();
  const allStudents = useMemo(() => filterStudentsForRole(getAllStudents(), activeRole), [activeRole]);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allStudents.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q)) return false;
      if (gradeFilter !== "all" && String(s.grade) !== gradeFilter) return false;
      if (sectionFilter !== "all" && s.section !== sectionFilter) return false;
      if (tierFilter !== "all" && s.performanceTier !== tierFilter) return false;
      return true;
    });
  }, [allStudents, search, gradeFilter, sectionFilter, tierFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleGrade = (v: string) => { setGradeFilter(v); setPage(1); };
  const handleSection = (v: string) => { setSectionFilter(v); setPage(1); };
  const handleTier = (v: string) => { setTierFilter(v); setPage(1); };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Student Directory"
        description={`${allStudents.length} students · Grades 1–12`}
        breadcrumbs={[{ label: "Directories" }, { label: "Students" }]}
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={gradeFilter} onValueChange={handleGrade}>
                <SelectTrigger className="w-28 h-9 text-xs">
                  <Filter className="h-3 w-3 mr-1 text-muted-foreground" />
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                    <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sectionFilter} onValueChange={handleSection}>
                <SelectTrigger className="w-28 h-9 text-xs">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {["A", "B", "C", "D"].map((s) => (
                    <SelectItem key={s} value={s}>Section {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={tierFilter} onValueChange={handleTier}>
                <SelectTrigger className="w-32 h-9 text-xs">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="top">Top Performer</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="at-risk">At-Risk</SelectItem>
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
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Grade</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Section</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Performance</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Attendance</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Parent Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginated.map((s) => {
                const tier = tierBadge[s.performanceTier];
                return (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarFallback className={cn("text-xs font-semibold",
                            s.performanceTier === "top" ? "bg-emerald-100 text-emerald-700" :
                            s.performanceTier === "at-risk" ? "bg-red-100 text-red-700" :
                            "bg-blue-100 text-blue-700"
                          )}>{s.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium truncate max-w-[150px]">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{s.id}</td>
                    <td className="px-4 py-3">Grade {s.grade}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">{s.section}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={tier.variant} className="text-xs">{tier.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", s.attendanceRate >= 90 ? "bg-emerald-500" : s.attendanceRate >= 80 ? "bg-amber-500" : "bg-red-500")}
                            style={{ width: `${s.attendanceRate}%` }}
                          />
                        </div>
                        <span className={cn("text-xs font-medium",
                          s.attendanceRate >= 90 ? "text-emerald-600" :
                          s.attendanceRate >= 80 ? "text-amber-600" : "text-red-600"
                        )}>{s.attendanceRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium truncate max-w-[140px]">{s.parentName}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[140px]">{s.parentPhone}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages} · {filtered.length} students
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const p = start + i;
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
