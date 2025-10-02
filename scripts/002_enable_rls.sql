-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduling_constraints ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Departments policies (read-only for all authenticated users)
CREATE POLICY "Anyone can view departments"
  ON public.departments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage departments"
  ON public.departments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Rooms policies
CREATE POLICY "Anyone can view rooms"
  ON public.rooms FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage rooms"
  ON public.rooms FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Faculty policies
CREATE POLICY "Anyone can view faculty"
  ON public.faculty FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage faculty"
  ON public.faculty FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Courses policies
CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage courses"
  ON public.courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Course sections policies
CREATE POLICY "Anyone can view course sections"
  ON public.course_sections FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage course sections"
  ON public.course_sections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Time slots policies
CREATE POLICY "Anyone can view time slots"
  ON public.time_slots FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage time slots"
  ON public.time_slots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Timetable entries policies
CREATE POLICY "Anyone can view timetable entries"
  ON public.timetable_entries FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage timetable entries"
  ON public.timetable_entries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enrollments policies
CREATE POLICY "Students can view own enrollments"
  ON public.enrollments FOR SELECT
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Only admins can manage enrollments"
  ON public.enrollments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Scheduling constraints policies
CREATE POLICY "Faculty can view own constraints"
  ON public.scheduling_constraints FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.faculty f
      WHERE f.id = faculty_id AND f.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Faculty can manage own constraints"
  ON public.scheduling_constraints FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.faculty f
      WHERE f.id = faculty_id AND f.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
