import type React from "react"
import type { Metadata } from "next"
import { Orbitron } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import PillNavWrapper from "@/components/PillNavWrapper"
import Footer from "@/components/footer"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
})

export const metadata: Metadata = {
  title: "NFCCure - Smart NFC-Powered Healthcare",
  description: "Tap. Access. Cure. - Revolutionary healthcare through NFC technology",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className={`font-sans ${GeistSans.variable} ${orbitron.variable} bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-900 antialiased overflow-x-hidden`}>
        <Suspense fallback={<div>Loading...</div>}>
          <PillNavWrapper />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
