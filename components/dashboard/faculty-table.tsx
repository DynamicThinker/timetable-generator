"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Faculty {
  id: string
  employee_id: string
  specialization: string | null
  max_hours_per_week: number
  profiles: {
    full_name: string
    email: string
  } | null
  departments: {
    name: string
    code: string
  } | null
}

export function FacultyTable({ faculty }: { faculty: Faculty[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    const { error } = await supabase.from("faculty").delete().eq("id", deleteId)

    if (!error) {
      router.refresh()
    }

    setIsDeleting(false)
    setDeleteId(null)
  }

  return (
    <>
      <div className="rounded-lg border border-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Max Hours/Week</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculty.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No faculty members found. Add your first faculty member to get started.
                </TableCell>
              </TableRow>
            ) : (
              faculty.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.employee_id}</TableCell>
                  <TableCell>{member.profiles?.full_name || "N/A"}</TableCell>
                  <TableCell className="text-muted-foreground">{member.profiles?.email || "N/A"}</TableCell>
                  <TableCell>
                    {member.departments && <Badge variant="secondary">{member.departments.code}</Badge>}
                  </TableCell>
                  <TableCell>{member.specialization || "—"}</TableCell>
                  <TableCell>{member.max_hours_per_week}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the faculty member record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
