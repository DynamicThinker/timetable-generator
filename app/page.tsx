import type React from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

        <div className="mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-4 py-2 text-sm backdrop-blur-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Automated scheduling powered by AI</span>
          </div>

          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Smart Timetable Generation for Modern Colleges
          </h1>

          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Eliminate scheduling conflicts and optimize resource allocation with our intelligent timetable generator.
            Built for administrators, faculty, and students.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="text-base">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/50 bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for perfect schedules
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Powerful features designed to make timetable management effortless
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Calendar className="h-6 w-6" />}
              title="Automated Generation"
              description="Generate conflict-free timetables in seconds using advanced algorithms that consider all constraints"
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Real-time Updates"
              description="Make changes on the fly with instant updates across all views and automatic conflict detection"
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Multi-role Access"
              description="Tailored dashboards for admins, faculty, and students with role-based permissions"
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Smart Optimization"
              description="Optimize room utilization, faculty workload, and student preferences automatically"
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6" />}
              title="Visual Calendar"
              description="Beautiful calendar views with drag-and-drop editing and multiple visualization options"
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Constraint Management"
              description="Define faculty preferences, room requirements, and scheduling rules with ease"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to transform your scheduling?
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Join colleges already using our platform to save time and eliminate scheduling headaches
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="text-base">
              <Link href="/auth/sign-up">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group relative rounded-lg border border-border/50 bg-background p-6 transition-colors hover:border-border">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-pretty text-muted-foreground">{description}</p>
    </div>
  )
}
