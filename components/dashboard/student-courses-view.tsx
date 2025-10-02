import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, User, Clock } from "lucide-react"

export async function StudentCoursesView({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      course_sections (
        section_name,
        max_students,
        courses (
          course_code,
          course_name,
          credits,
          lecture_hours,
          lab_hours,
          departments (
            name,
            code
          )
        ),
        faculty (
          profiles (
            full_name
          )
        )
      )
    `,
    )
    .eq("student_id", userId)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Courses</h2>
        <p className="text-muted-foreground">View your enrolled courses</p>
      </div>

      {enrollments && enrollments.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => {
            const section = enrollment.course_sections
            const course = section?.courses

            return (
              <Card key={enrollment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{course?.course_code || "N/A"}</CardTitle>
                      <p className="text-sm text-muted-foreground">Section {section?.section_name || "N/A"}</p>
                    </div>
                    <Badge variant="secondary">{course?.credits || 0} Credits</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <h3 className="font-medium">{course?.course_name || "N/A"}</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{course?.departments?.name || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{section?.faculty?.profiles?.full_name || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {course?.lecture_hours || 0}L + {course?.lab_hours || 0}P hours/week
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium">No courses enrolled</p>
              <p className="text-sm text-muted-foreground">Contact your administrator to enroll in courses</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
