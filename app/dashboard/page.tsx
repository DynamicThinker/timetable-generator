import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { FacultyDashboard } from "@/components/dashboard/faculty-dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Render different dashboards based on role
  if (profile.role === "admin") {
    return <AdminDashboard />
  } else if (profile.role === "faculty") {
    return <FacultyDashboard userId={user.id} />
  } else {
    return <StudentDashboard userId={user.id} />
  }
}
