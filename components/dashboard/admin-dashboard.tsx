import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, BookOpen, Calendar } from "lucide-react"

export async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch stats
  const [{ count: departmentsCount }, { count: coursesCount }, { count: facultyCount }, { count: roomsCount }] =
    await Promise.all([
      supabase.from("departments").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("faculty").select("*", { count: "exact", head: true }),
      supabase.from("rooms").select("*", { count: "exact", head: true }),
    ])

  const stats = [
    {
      title: "Departments",
      value: departmentsCount || 0,
      icon: Building2,
      description: "Active departments",
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Courses",
      value: coursesCount || 0,
      icon: BookOpen,
      description: "Total courses",
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400",
    },
    {
      title: "Faculty",
      value: facultyCount || 0,
      icon: Users,
      description: "Faculty members",
      color: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-400",
    },
    {
      title: "Rooms",
      value: roomsCount || 0,
      icon: Calendar,
      description: "Available rooms",
      color: "from-orange-500/20 to-orange-600/20",
      iconColor: "text-orange-400",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Overview
        </h2>
        <p className="text-muted-foreground mt-2">Welcome to your timetable management dashboard</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 group overflow-hidden relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-foreground/80">{stat.title}</CardTitle>
                <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${stat.iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Use the sidebar to navigate to different sections and manage your timetable data. Start by adding
            departments, courses, and faculty members.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
