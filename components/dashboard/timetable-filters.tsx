"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface Department {
  id: string
  name: string
  code: string
}

interface Room {
  id: string
  room_number: string
  building: string
}

interface TimetableFiltersProps {
  departments: Department[]
  rooms: Room[]
  selectedDepartment: string
  selectedRoom: string
  onDepartmentChange: (value: string) => void
  onRoomChange: (value: string) => void
  onClearFilters: () => void
}

export function TimetableFilters({
  departments,
  rooms,
  selectedDepartment,
  selectedRoom,
  onDepartmentChange,
  onRoomChange,
  onClearFilters,
}: TimetableFiltersProps) {
  const hasFilters = selectedDepartment !== "all" || selectedRoom !== "all"

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex-1 space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger id="department" className="w-full">
            <SelectValue placeholder="All departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name} ({dept.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <Label htmlFor="room">Room</Label>
        <Select value={selectedRoom} onValueChange={onRoomChange}>
          <SelectTrigger id="room" className="w-full">
            <SelectValue placeholder="All rooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.room_number} - {room.building}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="outline" size="icon" onClick={onClearFilters}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
