import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Timetable Generator",
  description: "Generate and manage conflict-free academic timetables.",
  applicationName: "Timetable Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans text-foreground ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,165,0,0.15),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,165,0,0.08),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,140,0,0.12),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_bottom,rgba(255,140,0,0.06),transparent_60%)]" />
          </div>
          <Suspense
            fallback={
              <div className="glass-card mx-auto mt-10 max-w-md p-6 text-center">
                Loading...
              </div>
            }
          >
            <div className="min-h-dvh glass">{children}</div>
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
