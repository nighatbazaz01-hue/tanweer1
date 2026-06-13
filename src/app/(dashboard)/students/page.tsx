"use client";
import { useState, useMemo } from "react";
import { Search, Plus, Filter, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAllStudents } from "@/lib/mockData/population";
import { useRoleStore } from "@/store/useRoleStore";
import { filterStudentsForRole, getRoleScopeLabel } from "@/lib/permissions";

const tierVariant: Record<string, "success" | "destructive" | "warning" | "secondary"> = {
  top: "success",
  average: "secondary",
  "at-risk": "destructive",
};

const PAGE_SIZE = 40;

export default function StudentsPage() {
  const { activeRole } = useRoleStore();
  const allStudents = useMemo(() => filterStudentsForRole(getAllStudents(), activeRole), [activeRole]);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<number | "all">("all");
  const [page, setPage] = useState(1);

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={`${allStudents.length.toLocaleString()} students · ${getRoleScopeLabel(activeRole)}`}
        breadcrumbs={[{ label: "Home" }, { label: "Students" }]}
        actions={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
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
                    <p className="text-sm font-medium">{student.gpa.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">of 4.0</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{student.attendanceRate}%</p>
                    <p className="text-xs text-muted-foreground">this term</p>
                  </div>
                  <Badge variant={tierVariant[student.performanceTier]} className="w-fit capitalize text-xs">
                    {student.performanceTier === "at-risk" ? "At Risk" : student.performanceTier}
                  </Badge>
                  <div className="hidden md:flex items-center gap-1">
                    <Link href={`/students/1`}>
                      <Button variant="ghost" size="sm" className="text-xs gap-1.5">
                        <Eye className="h-3.5 w-3.5" /> 360°
                      </Button>
                    </Link>
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
    </div>
  );
}
