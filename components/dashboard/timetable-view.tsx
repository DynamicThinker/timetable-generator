"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, User } from "lucide-react"

interface TimetableEntry {
  id: string
  day_of_week: string
  is_lab: boolean
  course_sections: {
    section_name: string
    courses: {
      course_code: string
      course_name: string
    } | null
    faculty: {
      profiles: {
        full_name: string
      } | null
    } | null
  } | null
  rooms: {
    room_number: string
    building: string
  } | null
  time_slots: {
    start_time: string
    end_time: string
  } | null
}

interface TimeSlot {
  id: string
  start_time: string
  end_time: string
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function TimetableView({
  entries,
  timeSlots,
}: {
  entries: TimetableEntry[]
  timeSlots: TimeSlot[]
}) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getEntriesForDay = (day: string) => {
    return entries.filter((entry) => entry.day_of_week === day)
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">No timetable generated yet</p>
            <p className="text-sm text-muted-foreground">Click "Generate Timetable" to create a schedule</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dayEntries.map((entry) => (
                  <Card key={entry.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">
                            {entry.course_sections?.courses?.course_code || "N/A"}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Section {entry.course_sections?.section_name || "N/A"}
                          </p>
                        </div>
                        {entry.is_lab && (
                          <Badge variant="secondary" className="ml-2">
                            Lab
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {entry.time_slots
                            ? `${formatTime(entry.time_slots.start_time)} - ${formatTime(entry.time_slots.end_time)}`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{entry.rooms ? `${entry.rooms.room_number}, ${entry.rooms.building}` : "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{entry.course_sections?.faculty?.profiles?.full_name || "Unassigned"}</span>
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
  )
}
