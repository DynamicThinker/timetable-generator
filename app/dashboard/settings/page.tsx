import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details and role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium text-muted-foreground">Full Name</div>
              <div className="text-base">{profile?.full_name}</div>
            </div>
            <div className="grid gap-2">
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div className="text-base">{profile?.email}</div>
            </div>
            <div className="grid gap-2">
              <div className="text-sm font-medium text-muted-foreground">Role</div>
              <div className="text-base capitalize">{profile?.role}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Application version and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Timetable Generator v1.0.0</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
