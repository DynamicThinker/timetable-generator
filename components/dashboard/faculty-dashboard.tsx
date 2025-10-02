import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Clock, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export async function FacultyDashboard({ userId }: { userId: string }) {
  const supabase = await createClient()

  // Get faculty record
  const { data: facultyRecord } = await supabase.from("faculty").select("*").eq("user_id", userId).single()

  if (!facultyRecord) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Schedule</h2>
          <p className="text-muted-foreground">Faculty record not found</p>
        </div>
      </div>
    )
  }

  // Get assigned course sections
  const { data: courseSections } = await supabase
    .from("course_sections")
    .select(
      `
      *,
      courses (
        course_code,
        course_name,
        credits,
        lecture_hours,
        lab_hours
      )
    `,
    )
    .eq("faculty_id", facultyRecord.id)

  // Get timetable entries for assigned sections
  const sectionIds = courseSections?.map((s) => s.id) || []
  const { data: timetableEntries } = await supabase
    .from("timetable_entries")
    .select(
      `
      *,
      course_sections (
        section_name,
        courses (
          course_code,
          course_name
        )
      ),
      rooms (
        room_number,
        building
      ),
      time_slots (
        start_time,
        end_time
      )
    `,
    )
    .in("course_section_id", sectionIds)

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getEntriesForDay = (day: string) => {
    return (timetableEntries || []).filter((entry) => entry.day_of_week === day)
  }

  const totalHours = timetableEntries?.length || 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Teaching Schedule</h2>
        <p className="text-muted-foreground">View your assigned courses and schedule</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseSections?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Course sections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-muted-foreground">of {facultyRecord.max_hours_per_week} max hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timetableEntries?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total sessions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="Monday" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {DAYS.map((day) => (
            <TabsTrigger key={day} value={day}>
              {day.slice(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>

        {DAYS.map((day) => {
          const dayEntries = getEntriesForDay(day)

          return (
            <TabsContent key={day} value={day} className="space-y-4">
              {dayEntries.length === 0 ? (
                <Card>
                  <CardContent className="flex min-h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">No classes scheduled for {day}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {dayEntries
                    .sort((a, b) => (a.time_slots?.start_time || "").localeCompare(b.time_slots?.start_time || ""))
                    .map((entry) => (
                      <Card key={entry.id}>
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 px-4 py-3">
                            <div className="text-xs font-medium text-muted-foreground">
                              {entry.time_slots ? formatTime(entry.time_slots.start_time) : "N/A"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {entry.time_slots ? formatTime(entry.time_slots.end_time) : "N/A"}
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{entry.course_sections?.courses?.course_code || "N/A"}</h3>
                              {entry.is_lab && (
                                <Badge variant="secondary" className="text-xs">
                                  Lab
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                Section {entry.course_sections?.section_name || "N/A"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {entry.course_sections?.courses?.course_name || "N/A"}
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {entry.rooms ? `${entry.rooms.room_number}, ${entry.rooms.building}` : "N/A"}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
