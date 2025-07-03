import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "tr4cka - To-Do & Habit Tracker",
  description: "A modern, motivating productivity app for tracking tasks and building habits with tr4cka",
  keywords: ["productivity", "todo", "habits", "tracker", "goals", "tr4cka"],
  authors: [{ name: "tr4cka" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
