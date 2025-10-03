"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { User, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  user: {
    full_name: string;
    email: string;
    role: string;
  };
}

export function DashboardHeader({ user }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 px-6 lg:px-8 backdrop-blur-xl bg-white/5 sticky top-0 z-40 glass">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 shadow-[0_0_24px_rgba(255,165,0,0.15)]">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,255,255,0.08)]">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 glass-button rounded-xl">
              <div className="p-1.5 rounded-lg bg-primary/20 border border-primary/30">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="hidden sm:inline font-medium">
                {user.full_name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 glass-card border-white/10"
          >
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.full_name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs text-primary/80 capitalize font-medium">
                  Role: {user.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="hover:bg-white/5 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
