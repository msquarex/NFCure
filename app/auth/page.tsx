"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default function AuthPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value
    if (!email || !password) return
    setIsSubmitting(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        alert(error.message)
        return
      }
      window.location.href = '/'
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fullName = (form.elements.namedItem('name') as HTMLInputElement)?.value
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value
    if (!email || !password) return
    setIsSubmitting(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      })
      if (error) {
        alert(error.message)
        return
      }
      if (data.user && !data.session) {
        alert('Check your email to confirm your account.')
      }
      window.location.href = '/'
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[60vh] px-4">
      <div className="mx-auto w-full max-w-md mt-12 md:mt-16">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-muted-foreground mt-1">Login or create an account</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" type="email" required placeholder="you@example.com" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <Input name="password" type="password" required placeholder="••••••••" />
              </div>
              <div className="flex items-center justify-between">
                <Link href="#" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-10 rounded-full">
                {isSubmitting ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="space-y-1">
                <label className="text-sm font-medium">Full Name</label>
                <Input name="name" type="text" required placeholder="Jane Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" type="email" required placeholder="you@example.com" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <Input name="password" type="password" required placeholder="Create a password" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-10 rounded-full">
                {isSubmitting ? "Creating account…" : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


