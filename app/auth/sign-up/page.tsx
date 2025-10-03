"use client";

import type React from "react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "faculty" | "admin">("student");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });
      if (error) throw error;
      router.push("/auth/verify-email");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.08),transparent_50%)]" />

      <div className="w-full max-w-sm relative z-10">
        <div className="flex justify-center mb-8">
          <div className="p-4 rounded-2xl glass-card">
            <Calendar className="h-10 w-10 text-primary drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
          </div>
        </div>

        <Card className="glass-card border-white/10 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Create account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-foreground/90">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="glass-button border-white/20 focus:border-primary/50 focus:ring-primary/30 h-11"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-foreground/90">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@college.edu"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-button border-white/20 focus:border-primary/50 focus:ring-primary/30 h-11"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-foreground/90">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-button border-white/20 focus:border-primary/50 focus:ring-primary/30 h-11"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role" className="text-foreground/90">
                    Role
                  </Label>
                  <Select
                    value={role}
                    onValueChange={(value: "student" | "faculty" | "admin") =>
                      setRole(value)
                    }
                  >
                    <SelectTrigger className="glass-button border-white/20 focus:border-primary/50 focus:ring-primary/30 h-11">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 backdrop-blur-sm">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
