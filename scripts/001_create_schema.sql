-- Create enum types for roles and days
CREATE TYPE user_role AS ENUM ('admin', 'faculty', 'student');
CREATE TYPE day_of_week AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
CREATE TYPE semester_type AS ENUM ('Fall', 'Spring', 'Summer');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL UNIQUE,
  building TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  room_type TEXT, -- e.g., 'Lecture Hall', 'Lab', 'Seminar Room'
  has_projector BOOLEAN DEFAULT false,
  has_whiteboard BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Faculty table
CREATE TABLE IF NOT EXISTS public.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  employee_id TEXT NOT NULL UNIQUE,
  specialization TEXT,
  max_hours_per_week INTEGER DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code TEXT NOT NULL UNIQUE,
  course_name TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL CHECK (credits > 0),
  lecture_hours INTEGER NOT NULL DEFAULT 0,
  lab_hours INTEGER NOT NULL DEFAULT 0,
  semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course sections (multiple sections of same course)
CREATE TABLE IF NOT EXISTS public.course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL, -- e.g., 'A', 'B', 'C'
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE SET NULL,
  max_students INTEGER DEFAULT 60,
  semester_year INTEGER NOT NULL,
  semester_type semester_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, section_name, semester_year, semester_type)
);

-- Time slots table
CREATE TABLE IF NOT EXISTS public.time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (end_time > start_time)
);

-- Timetable entries (the actual schedule)
CREATE TABLE IF NOT EXISTS public.timetable_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_section_id UUID REFERENCES public.course_sections(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  time_slot_id UUID REFERENCES public.time_slots(id) ON DELETE CASCADE,
  day_of_week day_of_week NOT NULL,
  is_lab BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent double booking of rooms
  UNIQUE(room_id, time_slot_id, day_of_week)
);

-- Student enrollments
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_section_id UUID REFERENCES public.course_sections(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_section_id)
);

-- Constraints table (for scheduling preferences/restrictions)
CREATE TABLE IF NOT EXISTS public.scheduling_constraints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE,
  day_of_week day_of_week NOT NULL,
  time_slot_id UUID REFERENCES public.time_slots(id) ON DELETE CASCADE,
  is_preferred BOOLEAN DEFAULT false, -- true = preferred, false = unavailable
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_faculty_user_id ON public.faculty(user_id);
CREATE INDEX idx_faculty_department ON public.faculty(department_id);
CREATE INDEX idx_courses_department ON public.courses(department_id);
CREATE INDEX idx_course_sections_course ON public.course_sections(course_id);
CREATE INDEX idx_course_sections_faculty ON public.course_sections(faculty_id);
CREATE INDEX idx_timetable_entries_section ON public.timetable_entries(course_section_id);
CREATE INDEX idx_timetable_entries_room ON public.timetable_entries(room_id);
CREATE INDEX idx_timetable_entries_day ON public.timetable_entries(day_of_week);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_section ON public.enrollments(course_section_id);
