"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Calendar, Building2, Users, BookOpen, Clock, LayoutDashboard, Settings, GraduationCap } from "lucide-react"

interface SidebarProps {
  userRole: "admin" | "faculty" | "student"
}

export function DashboardSidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  const adminLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/departments", label: "Departments", icon: Building2 },
    { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/faculty", label: "Faculty", icon: Users },
    { href: "/dashboard/rooms", label: "Rooms", icon: Building2 },
    { href: "/dashboard/time-slots", label: "Time Slots", icon: Clock },
    { href: "/dashboard/timetable", label: "Timetable", icon: Calendar },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const facultyLinks = [
    { href: "/dashboard", label: "My Schedule", icon: Calendar },
    { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
    { href: "/dashboard/constraints", label: "Preferences", icon: Settings },
  ]

  const studentLinks = [
    { href: "/dashboard", label: "My Schedule", icon: Calendar },
    { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
    { href: "/dashboard/enrollments", label: "Enrollments", icon: GraduationCap },
  ]

  const links = userRole === "admin" ? adminLinks : userRole === "faculty" ? facultyLinks : studentLinks

  return (
    <aside className="hidden w-64 lg:block relative">
      <div className="fixed top-0 left-0 h-full w-64 glass border-r border-white/10">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-white/10 px-6 backdrop-blur-xl">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 group-hover:bg-primary/30 transition-all duration-300">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                TimeTable
              </span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-primary/20 text-primary backdrop-blur-xl border border-primary/30 shadow-lg shadow-primary/20"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/5 backdrop-blur-sm border border-transparent hover:border-white/10",
                  )}
                >
                  {isActive && <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />}
                  <Icon
                    className={cn("h-4 w-4 relative z-10", isActive && "drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]")}
                  />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        </div>
      </div>
    </aside>
  )
}
