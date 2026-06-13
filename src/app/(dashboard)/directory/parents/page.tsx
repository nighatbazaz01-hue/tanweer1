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
import { getAllParents } from "@/lib/mockData/population";

const PAGE_SIZE = 20;

export default function ParentDirectoryPage() {
  const allParents = useMemo(() => getAllParents(), []);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allParents.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.childName.toLowerCase().includes(q)) return false;
      if (gradeFilter !== "all" && String(p.childGrade) !== gradeFilter) return false;
      return true;
    });
  }, [allParents, search, gradeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleGrade = (v: string) => { setGradeFilter(v); setPage(1); };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Parent Directory"
        description={`${allParents.length} parents · Linked to all students`}
        breadcrumbs={[{ label: "Directories" }, { label: "Parents" }]}
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by parent name or child name..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
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
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Parent / Guardian</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Child</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Grade / Section</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Last Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginated.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="text-xs font-semibold bg-green-100 text-green-700">{p.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium truncate max-w-[150px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-[150px]">{p.childName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{p.childId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">Grade {p.childGrade}-{p.childSection}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs">{p.phone}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-[180px]">{p.email}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={p.lastContact === "Today" ? "success" : p.lastContact === "Yesterday" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {p.lastContact}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages} · {filtered.length} parents
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
