import { createClient } from "@/lib/supabase/server"
import { FacultyTable } from "@/components/dashboard/faculty-table"
import { AddFacultyDialog } from "@/components/dashboard/add-faculty-dialog"

export default async function FacultyPage() {
  const supabase = await createClient()

  const { data: faculty } = await supabase
    .from("faculty")
    .select(`
      *,
      profiles (
        full_name,
        email
      ),
      departments (
        name,
        code
      )
    `)
    .order("employee_id")

  const { data: departments } = await supabase.from("departments").select("*").order("name")

  // Get users with faculty role who don't have faculty records yet
  const { data: facultyUsers } = await supabase.from("profiles").select("id, full_name, email").eq("role", "faculty")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Faculty</h2>
          <p className="text-muted-foreground">Manage faculty members and assignments</p>
        </div>
        <AddFacultyDialog departments={departments || []} facultyUsers={facultyUsers || []} />
      </div>

      <FacultyTable faculty={faculty || []} />
    </div>
  )
}
