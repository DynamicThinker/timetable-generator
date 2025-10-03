import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Suspense } from "react";

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
    <html lang="en" className="dark">
      <body
        className={`font-sans text-foreground ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
