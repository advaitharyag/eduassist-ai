"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import StudentDashboard from "@/components/dashboard/student-dashboard"
import TeacherDashboard from "@/components/dashboard/teacher-dashboard"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">EduAssist AI</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {user.role === "student" ? <StudentDashboard /> : <TeacherDashboard />}
      </main>
    </div>
  )
}
