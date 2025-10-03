"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  Department,
  Room,
  TimeSlot,
  Course,
  Faculty,
  CourseSection,
  TimetableEntry,
} from "@/lib/types";
import { TimetableGenerator } from "@/components/dashboard/timetable-generator";
import { TimetableView } from "@/components/dashboard/timetable-view";
import { TimetableCalendarView } from "@/components/dashboard/timetable-calendar-view";
import { TimetableFilters } from "@/components/dashboard/timetable-filters";
import { TimetableExport } from "@/components/dashboard/timetable-export";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List } from "lucide-react";

export default function TimetablePage() {
  type FilterValue = "all" | string;

  const [courseSections, setCourseSections] = useState<CourseSection[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>(
    []
  );
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<FilterValue>("all");
  const [selectedRoom, setSelectedRoom] = useState<FilterValue>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setLoadError(null);

    const [sectionsRes, roomsRes, slotsRes, entriesRes, deptsRes] =
      await Promise.all([
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
      ]);

    const errors: string[] = [];
    if (sectionsRes.error)
      errors.push(`course_sections: ${sectionsRes.error.message}`);
    if (roomsRes.error) errors.push(`rooms: ${roomsRes.error.message}`);
    if (slotsRes.error) errors.push(`time_slots: ${slotsRes.error.message}`);
    if (entriesRes.error)
      errors.push(`timetable_entries: ${entriesRes.error.message}`);
    if (deptsRes.error) errors.push(`departments: ${deptsRes.error.message}`);

    setCourseSections((sectionsRes.data as CourseSection[]) || []);
    setRooms((roomsRes.data as Room[]) || []);
    setTimeSlots((slotsRes.data as TimeSlot[]) || []);
    setTimetableEntries((entriesRes.data as TimetableEntry[]) || []);
    setDepartments((deptsRes.data as Department[]) || []);

    if (errors.length) {
      setLoadError(errors.join("; "));
    }
    setIsLoading(false);
  };

  const filteredEntries = timetableEntries.filter((entry) => {
    if (selectedDepartment !== "all") {
      const deptId = entry.course_sections?.courses?.department_id;
      if ((deptId ?? "") !== selectedDepartment) return false;
    }

    if (selectedRoom !== "all") {
      const roomId = entry.rooms?.id;
      if ((roomId ?? "") !== selectedRoom) return false;
    }

    return true;
  });

  const handleClearFilters = () => {
    setSelectedDepartment("all");
    setSelectedRoom("all");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Loading timetable...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {loadError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{loadError}</p>
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Timetable</h2>
          <p className="text-muted-foreground">
            Generate and manage class schedules
          </p>
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
          <TimetableCalendarView
            entries={filteredEntries}
            timeSlots={timeSlots}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
