"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TimetableEntry, TimeSlot } from "@/lib/types";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function TimetableCalendarView({
  entries,
  timeSlots,
}: {
  entries: TimetableEntry[];
  timeSlots: TimeSlot[];
}) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getEntryForSlot = (day: string, timeSlotId: string) => {
    return entries.find(
      (entry) =>
        entry.day_of_week === day && entry.time_slots?.id === timeSlotId
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          <div className="p-2 text-center text-sm font-medium text-muted-foreground">
            Time
          </div>
          {DAYS.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="space-y-2">
          {timeSlots.map((slot) => (
            <div key={slot.id} className="grid grid-cols-7 gap-2">
              {/* Time column */}
              <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-muted/30 p-2">
                <div className="text-xs font-medium">
                  {formatTime(slot.start_time)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTime(slot.end_time)}
                </div>
              </div>

              {/* Day columns */}
              {DAYS.map((day) => {
                const entry = getEntryForSlot(day, slot.id);

                return (
                  <div
                    key={`${day}-${slot.id}`}
                    className={cn(
                      "rounded-lg border border-border/50 p-2 transition-colors",
                      entry
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "bg-background hover:bg-muted/30"
                    )}
                  >
                    {entry ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-semibold leading-tight">
                            {entry.course_sections?.courses?.course_code ||
                              "N/A"}
                          </p>
                          {entry.is_lab && (
                            <Badge
                              variant="secondary"
                              className="h-4 px-1 text-[10px]"
                            >
                              Lab
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {entry.rooms ? `${entry.rooms.room_number}` : "N/A"}
                        </p>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-xs text-muted-foreground/50">
                          —
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
