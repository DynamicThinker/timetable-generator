"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Department {
  id: string
  name: string
  code: string
}

export function AddCourseDialog({
  departments,
}: {
  departments: Department[]
}) {
  const [open, setOpen] = useState(false)
  const [courseCode, setCourseCode] = useState("")
  const [courseName, setCourseName] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [credits, setCredits] = useState("")
  const [lectureHours, setLectureHours] = useState("")
  const [labHours, setLabHours] = useState("")
  const [semester, setSemester] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error: insertError } = await supabase.from("courses").insert({
      course_code: courseCode,
      course_name: courseName,
      department_id: departmentId,
      credits: Number.parseInt(credits),
      lecture_hours: Number.parseInt(lectureHours),
      lab_hours: Number.parseInt(labHours),
      semester: Number.parseInt(semester),
    })

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    setCourseCode("")
    setCourseName("")
    setDepartmentId("")
    setCredits("")
    setLectureHours("")
    setLabHours("")
    setSemester("")
    setOpen(false)
    setIsLoading(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>Create a new course in the catalog</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  placeholder="CS101"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={departmentId} onValueChange={setDepartmentId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input
                id="courseName"
                placeholder="Introduction to Programming"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  placeholder="3"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lectureHours">Lecture Hours</Label>
                <Input
                  id="lectureHours"
                  type="number"
                  placeholder="3"
                  value={lectureHours}
                  onChange={(e) => setLectureHours(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="labHours">Lab Hours</Label>
                <Input
                  id="labHours"
                  type="number"
                  placeholder="2"
                  value={labHours}
                  onChange={(e) => setLabHours(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select value={semester} onValueChange={setSemester} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
