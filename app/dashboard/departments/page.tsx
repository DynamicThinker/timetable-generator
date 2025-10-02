import { createClient } from "@/lib/supabase/server"
import { DepartmentsTable } from "@/components/dashboard/departments-table"
import { AddDepartmentDialog } from "@/components/dashboard/add-department-dialog"

export default async function DepartmentsPage() {
  const supabase = await createClient()

  const { data: departments } = await supabase.from("departments").select("*").order("name")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Departments</h2>
          <p className="text-muted-foreground">Manage academic departments</p>
        </div>
        <AddDepartmentDialog />
      </div>

      <DepartmentsTable departments={departments || []} />
    </div>
  )
}
