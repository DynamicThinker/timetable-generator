"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { TimetableGenerator } from "@/components/dashboard/timetable-generator"
import { TimetableView } from "@/components/dashboard/timetable-view"
import { TimetableCalendarView } from "@/components/dashboard/timetable-calendar-view"
import { TimetableFilters } from "@/components/dashboard/timetable-filters"
import { TimetableExport } from "@/components/dashboard/timetable-export"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, List } from "lucide-react"

export default function TimetablePage() {
  const [courseSections, setCourseSections] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [timeSlots, setTimeSlots] = useState<any[]>([])
  const [timetableEntries, setTimetableEntries] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedRoom, setSelectedRoom] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)

    const [sectionsRes, roomsRes, slotsRes, entriesRes, deptsRes] = await Promise.all([
      supabase.from("course_sections").select(`
        *,
        courses (
          course_code,
          course_name,
          lecture_hours,
          lab_hours,
          department_id
        ),
        faculty (
          employee_id,
          profiles (
            full_name
          )
        )
      `),
      supabase.from("rooms").select("*"),
      supabase.from("time_slots").select("*").order("start_time"),
      supabase.from("timetable_entries").select(`
        *,
        course_sections (
          section_name,
          courses (
            course_code,
            course_name,
            department_id
          ),
          faculty (
            profiles (
              full_name
            )
          )
        ),
        rooms (
          id,
          room_number,
          building
        ),
        time_slots (
          id,
          start_time,
          end_time
        )
      `),
      supabase.from("departments").select("*").order("name"),
    ])

    setCourseSections(sectionsRes.data || [])
    setRooms(roomsRes.data || [])
    setTimeSlots(slotsRes.data || [])
    setTimetableEntries(entriesRes.data || [])
    setDepartments(deptsRes.data || [])
    setIsLoading(false)
  }

  const filteredEntries = timetableEntries.filter((entry) => {
    if (selectedDepartment !== "all") {
      const deptId = entry.course_sections?.courses?.department_id
      if (deptId !== selectedDepartment) return false
    }

    if (selectedRoom !== "all") {
      if (entry.rooms?.id !== selectedRoom) return false
    }

    return true
  })

  const handleClearFilters = () => {
    setSelectedDepartment("all")
    setSelectedRoom("all")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Loading timetable...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Timetable</h2>
          <p className="text-muted-foreground">Generate and manage class schedules</p>
        </div>
        <div className="flex gap-2">
          <TimetableExport />
          <TimetableGenerator
            courseSections={courseSections}
            rooms={rooms}
            timeSlots={timeSlots}
            onComplete={loadData}
          />
        </div>
      </div>

      <TimetableFilters
        departments={departments}
        rooms={rooms}
        selectedDepartment={selectedDepartment}
        selectedRoom={selectedRoom}
        onDepartmentChange={setSelectedDepartment}
        onRoomChange={setSelectedRoom}
        onClearFilters={handleClearFilters}
      />

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <TimetableView entries={filteredEntries} timeSlots={timeSlots} />
        </TabsContent>

        <TabsContent value="calendar">
          <TimetableCalendarView entries={filteredEntries} timeSlots={timeSlots} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
