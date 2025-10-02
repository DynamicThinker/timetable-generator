import { createClient } from "@/lib/supabase/server"
import { RoomsTable } from "@/components/dashboard/rooms-table"
import { AddRoomDialog } from "@/components/dashboard/add-room-dialog"

export default async function RoomsPage() {
  const supabase = await createClient()

  const { data: rooms } = await supabase.from("rooms").select("*").order("building, room_number")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rooms</h2>
          <p className="text-muted-foreground">Manage classrooms and facilities</p>
        </div>
        <AddRoomDialog />
      </div>

      <RoomsTable rooms={rooms || []} />
    </div>
  )
}
