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
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function AddRoomDialog() {
  const [open, setOpen] = useState(false)
  const [roomNumber, setRoomNumber] = useState("")
  const [building, setBuilding] = useState("")
  const [capacity, setCapacity] = useState("")
  const [roomType, setRoomType] = useState("")
  const [hasProjector, setHasProjector] = useState(false)
  const [hasWhiteboard, setHasWhiteboard] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error: insertError } = await supabase.from("rooms").insert({
      room_number: roomNumber,
      building,
      capacity: Number.parseInt(capacity),
      room_type: roomType || null,
      has_projector: hasProjector,
      has_whiteboard: hasWhiteboard,
    })

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    setRoomNumber("")
    setBuilding("")
    setCapacity("")
    setRoomType("")
    setHasProjector(false)
    setHasWhiteboard(false)
    setOpen(false)
    setIsLoading(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>Create a new classroom or facility</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  placeholder="101"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="building">Building</Label>
                <Input
                  id="building"
                  placeholder="Main Building"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="60"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Input
                  id="roomType"
                  placeholder="Lecture Hall"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Facilities</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="projector"
                  checked={hasProjector}
                  onCheckedChange={(checked) => setHasProjector(checked as boolean)}
                />
                <label
                  htmlFor="projector"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Has Projector
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whiteboard"
                  checked={hasWhiteboard}
                  onCheckedChange={(checked) => setHasWhiteboard(checked as boolean)}
                />
                <label
                  htmlFor="whiteboard"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Has Whiteboard
                </label>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
