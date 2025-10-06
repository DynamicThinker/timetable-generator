"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Zap,
  Loader2,
  Sparkles,
  Wand2,
  Clock,
  CheckCircle,
  BookMarked,
  Building,
} from "lucide-react";
import { useState } from "react";
import { generateTimetable } from "@/lib/timetable-generator";
import type { CourseSection, Room, TimeSlot } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

// Using shared types from lib/types

export function TimetableGenerator({
  courseSections,
  rooms,
  timeSlots,
  onComplete,
}: {
  courseSections: CourseSection[];
  rooms: Room[];
  timeSlots: TimeSlot[];
  onComplete?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setStatus("Initializing...");
    setError(null);

    try {
      setStatus("Analyzing constraints...");
      setProgress(20);

      const result = await generateTimetable({
        courseSections,
        rooms,
        timeSlots,
        onProgress: (percent, message) => {
          setProgress(percent);
          setStatus(message);
        },
      });

      if (result.success) {
        setProgress(100);
        setStatus("Timetable generated successfully!");
        setTimeout(() => {
          setOpen(false);
          onComplete?.();
        }, 1500);
      } else {
        setError(result.error || "Failed to generate timetable");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="glass-button group">
          <Wand2 className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
          Generate Timetable
          <Sparkles className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Generate Timetable
          </DialogTitle>
          <DialogDescription>
            Automatically create a conflict-free schedule for all course
            sections using advanced algorithms
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Statistics</div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="glass-card p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookMarked className="h-4 w-4" />
                  Sections
                </div>
                <div className="text-lg font-semibold text-primary">
                  {courseSections.length}
                </div>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4" />
                  Rooms
                </div>
                <div className="text-lg font-semibold text-primary">
                  {rooms.length}
                </div>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Time Slots
                </div>
                <div className="text-lg font-semibold text-primary">
                  {timeSlots.length}
                </div>
              </div>
            </div>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{status}</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="glass-button"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Start Generation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
