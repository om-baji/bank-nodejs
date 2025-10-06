import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css"

export const metadata: Metadata = {
  title: "SecureBank - Professional Banking Solutions",
  description: "Secure and professional banking platform for individuals and businesses"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans text-foreground">{children}</body>
    </html>
  )
}
