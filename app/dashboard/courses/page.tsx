import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StudentCoursesView } from "@/components/dashboard/student-courses-view"
import { FacultyCoursesView } from "@/components/dashboard/faculty-courses-view"

export default async function CoursesPage() {
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

  if (profile.role === "student") {
    return <StudentCoursesView userId={user.id} />
  } else if (profile.role === "faculty") {
    return <FacultyCoursesView userId={user.id} />
  } else {
    redirect("/dashboard")
  }
}
