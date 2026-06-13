"use client";
import { useState } from "react";
import { Search, Plus, Filter, Eye, Sparkles } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockStudents } from "@/lib/mockData";
import { getInitials } from "@/lib/utils";
import type { Student } from "@/types";

const statusVariant: Record<Student["status"], "success" | "destructive" | "secondary" | "warning"> = {
  active: "success",
  inactive: "destructive",
  graduated: "secondary",
  transferred: "warning",
};

export default function StudentsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockStudents.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.grade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Manage student records, profiles, and enrollment"
        breadcrumbs={[{ label: "Home" }, { label: "Students" }]}
        actions={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or grade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <p className="text-sm text-muted-foreground ml-auto">
          {filtered.length} of {mockStudents.length} students
        </p>
      </div>

      <div className="grid gap-3">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span>Student</span>
          <span>Grade</span>
          <span>Parent</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {filtered.map((student) => (
          <Card key={student.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {getInitials(student.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 items-center">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{student.fullName}</p>
                    <p className="text-xs text-muted-foreground">{student.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm">{student.grade}</p>
                    <p className="text-xs text-muted-foreground">Section {student.section}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm truncate">{student.parentName}</p>
                    <p className="text-xs text-muted-foreground">{student.parentPhone}</p>
                  </div>
                  <Badge variant={statusVariant[student.status]} className="w-fit capitalize">
                    {student.status}
                  </Badge>
                  <div className="hidden md:flex items-center gap-1">
                    <Link href={`/students/${student.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs gap-1.5">
                        <Eye className="h-3.5 w-3.5" /> 360° View
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
    </div>
  );
}
