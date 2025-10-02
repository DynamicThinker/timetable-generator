-- Insert default time slots (8 AM to 6 PM, 1-hour slots)
INSERT INTO public.time_slots (start_time, end_time, duration_minutes) VALUES
  ('08:00', '09:00', 60),
  ('09:00', '10:00', 60),
  ('10:00', '11:00', 60),
  ('11:00', '12:00', 60),
  ('12:00', '13:00', 60),
  ('13:00', '14:00', 60),
  ('14:00', '15:00', 60),
  ('15:00', '16:00', 60),
  ('16:00', '17:00', 60),
  ('17:00', '18:00', 60)
ON CONFLICT DO NOTHING;

-- Insert sample departments
INSERT INTO public.departments (name, code) VALUES
  ('Computer Science', 'CS'),
  ('Electrical Engineering', 'EE'),
  ('Mechanical Engineering', 'ME'),
  ('Mathematics', 'MATH'),
  ('Physics', 'PHY')
ON CONFLICT DO NOTHING;

-- Insert sample rooms
INSERT INTO public.rooms (room_number, building, capacity, room_type, has_projector, has_whiteboard) VALUES
  ('101', 'Main Building', 60, 'Lecture Hall', true, true),
  ('102', 'Main Building', 60, 'Lecture Hall', true, true),
  ('103', 'Main Building', 40, 'Classroom', true, true),
  ('104', 'Main Building', 40, 'Classroom', true, true),
  ('201', 'Lab Building', 30, 'Computer Lab', true, false),
  ('202', 'Lab Building', 30, 'Computer Lab', true, false),
  ('203', 'Lab Building', 25, 'Physics Lab', false, true),
  ('301', 'Annex', 80, 'Auditorium', true, true),
  ('302', 'Annex', 30, 'Seminar Room', true, true),
  ('303', 'Annex', 30, 'Seminar Room', true, true)
ON CONFLICT DO NOTHING;
