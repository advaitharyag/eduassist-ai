"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, type UserRole } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const handleLogin = (role: UserRole) => {
    setError("")
    const success = login(email, password, role)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Invalid credentials. Try student@test.com / student123")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">EduAssist AI</h1>
          <p className="text-muted-foreground mt-2">Your AI-powered learning companion</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="student@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="student123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button onClick={() => handleLogin("student")} className="w-full">
              Login as Student
            </Button>
            <Button onClick={() => handleLogin("teacher")} variant="outline" className="w-full">
              Login as Teacher
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground space-y-1 pt-4">
            <p>Student: student@test.com / student123</p>
            <p>Teacher: teacher@test.com / teacher123</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
