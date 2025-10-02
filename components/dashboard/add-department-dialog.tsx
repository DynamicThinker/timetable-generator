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
import { Plus } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function AddDepartmentDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error: insertError } = await supabase.from("departments").insert({ name, code })

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    setName("")
    setCode("")
    setOpen(false)
    setIsLoading(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Department</DialogTitle>
          <DialogDescription className="text-muted-foreground">Create a new academic department</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/90">
                Department Name
              </Label>
              <Input
                id="name"
                placeholder="Computer Science"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="glass-button border-white/20 focus:border-primary/50 focus:ring-primary/30 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code" className="text-foreground/90">
                Department Code
              </Label>
              <Input
                id="code"
                placeholder="CS"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                className="glass-button border-white/20 focus:border-primary/50 focus:ring-primary/30 h-11"
              />
            </div>
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 backdrop-blur-sm">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300"
            >
              {isLoading ? "Adding..." : "Add Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
