import { createClient } from "@/lib/supabase/server"
import { TimeSlotsTable } from "@/components/dashboard/time-slots-table"
import { AddTimeSlotDialog } from "@/components/dashboard/add-time-slot-dialog"

export default async function TimeSlotsPage() {
  const supabase = await createClient()

  const { data: timeSlots } = await supabase.from("time_slots").select("*").order("start_time")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Time Slots</h2>
          <p className="text-muted-foreground">Manage class time periods</p>
        </div>
        <AddTimeSlotDialog />
      </div>

      <TimeSlotsTable timeSlots={timeSlots || []} />
    </div>
  )
}
