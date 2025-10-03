import { createClient } from "@/lib/supabase/client";
import {
  CourseSection,
  Room,
  TimeSlot,
  GeneratedTimetableEntry,
} from "@/lib/types";

interface GenerateParams {
  courseSections: CourseSection[];
  rooms: Room[];
  timeSlots: TimeSlot[];
  onProgress?: (percent: number, message: string) => void;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export async function generateTimetable({
  courseSections,
  rooms,
  timeSlots,
  onProgress,
}: GenerateParams): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    // Clear existing timetable
    onProgress?.(10, "Clearing existing timetable...");
    await supabase
      .from("timetable_entries")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    // Initialize tracking structures
    const schedule: GeneratedTimetableEntry[] = [];
    const roomSchedule = new Map<string, Set<string>>(); // room_id -> Set of "day_timeSlot"
    const facultySchedule = new Map<string, Set<string>>(); // faculty_id -> Set of "day_timeSlot"

    // Helper function to check if a slot is available
    const isSlotAvailable = (
      roomId: string,
      facultyId: string | null,
      day: string,
      timeSlotId: string
    ): boolean => {
      const key = `${day}_${timeSlotId}`;

      // Check room availability
      const roomSlots = roomSchedule.get(roomId);
      if (roomSlots?.has(key)) return false;

      // Check faculty availability
      if (facultyId) {
        const facultySlots = facultySchedule.get(facultyId);
        if (facultySlots?.has(key)) return false;
      }

      return true;
    };

    // Helper function to book a slot
    const bookSlot = (
      roomId: string,
      facultyId: string | null,
      day: string,
      timeSlotId: string
    ) => {
      const key = `${day}_${timeSlotId}`;

      if (!roomSchedule.has(roomId)) {
        roomSchedule.set(roomId, new Set());
      }
      roomSchedule.get(roomId)!.add(key);

      if (facultyId) {
        if (!facultySchedule.has(facultyId)) {
          facultySchedule.set(facultyId, new Set());
        }
        facultySchedule.get(facultyId)!.add(key);
      }
    };

    // Sort course sections by priority (sections with faculty assigned first)
    const sortedSections = [...courseSections].sort((a, b) => {
      if (a.faculty_id && !b.faculty_id) return -1;
      if (!a.faculty_id && b.faculty_id) return 1;
      return 0;
    });

    onProgress?.(30, "Scheduling courses...");

    // Schedule each course section
    for (let i = 0; i < sortedSections.length; i++) {
      const section = sortedSections[i];
      const course = section.courses;

      if (!course) continue;

      const totalHours = course.lecture_hours + course.lab_hours;
      let hoursScheduled = 0;

      // Try to schedule all required hours
      for (const day of DAYS) {
        if (hoursScheduled >= totalHours) break;

        for (const timeSlot of timeSlots) {
          if (hoursScheduled >= totalHours) break;

          // Find suitable room
          const suitableRooms = rooms
            .filter((room) => room.capacity >= (section.max_students || 0))
            .sort((a, b) => a.capacity - b.capacity); // Prefer smaller rooms

          for (const room of suitableRooms) {
            if (
              isSlotAvailable(room.id, section.faculty_id, day, timeSlot.id)
            ) {
              // Determine if this is a lab session
              const isLab = hoursScheduled >= course.lecture_hours;

              // Book the slot
              schedule.push({
                course_section_id: section.id,
                room_id: room.id,
                time_slot_id: timeSlot.id,
                day_of_week: day,
                is_lab: isLab,
              });

              bookSlot(room.id, section.faculty_id, day, timeSlot.id);
              hoursScheduled++;
              break;
            }
          }
        }
      }

      // Update progress
      const progress = 30 + Math.floor((i / sortedSections.length) * 50);
      onProgress?.(
        progress,
        `Scheduled ${i + 1}/${sortedSections.length} sections...`
      );
    }

    // Save to database
    onProgress?.(85, "Saving timetable to database...");

    if (schedule.length > 0) {
      const { error: insertError } = await supabase
        .from("timetable_entries")
        .insert(schedule);

      if (insertError) {
        throw new Error(`Failed to save timetable: ${insertError.message}`);
      }
    }

    onProgress?.(100, "Timetable generated successfully!");

    return { success: true };
  } catch (error) {
    console.error("[v0] Timetable generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
