export interface Course {
  course_code: string;
  course_name: string;
  lecture_hours: number;
  lab_hours: number;
  department_id?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface FacultyProfile {
  full_name: string | null;
}

export interface Faculty {
  employee_id: string;
  profiles?: FacultyProfile | null;
}

export interface CourseSection {
  id: string;
  section_name: string;
  max_students: number;
  faculty_id: string | null;
  courses: Course | null;
  faculty?: Faculty | null;
}

export interface Room {
  id: string;
  room_number: string;
  building: string;
  capacity: number;
  room_type: string | null;
}

export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  duration_minutes?: number;
}

export interface TimetableEntry {
  id?: string;
  day_of_week?: string;
  is_lab?: boolean;
  course_sections?: {
    section_name?: string | null;
    courses?: Course | null;
    faculty?: { profiles?: { full_name?: string | null } | null } | null;
  } | null;
  rooms?: Pick<Room, "id" | "room_number" | "building"> | null;
  time_slots?: Pick<TimeSlot, "id" | "start_time" | "end_time"> | null;
}

export interface GeneratedTimetableEntry {
  course_section_id: string;
  room_id: string;
  time_slot_id: string;
  day_of_week: string;
  is_lab: boolean;
}
