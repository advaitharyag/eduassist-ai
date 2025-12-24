"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "student" | "teacher"

export interface User {
  email: string
  name: string
  role: UserRole
}

interface AuthState {
  user: User | null
  login: (email: string, password: string, role: UserRole) => boolean
  logout: () => void
}

// Demo users
const DEMO_USERS = {
  student: { email: "student@test.com", password: "student123", name: "Student" },
  teacher: { email: "teacher@test.com", password: "teacher123", name: "Teacher" },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, password, role) => {
        const demoUser = DEMO_USERS[role]
        if (email === demoUser.email && password === demoUser.password) {
          set({ user: { email: demoUser.email, name: demoUser.name, role } })
          return true
        }
        return false
      },
      logout: () => set({ user: null }),
    }),
    { name: "auth-storage" },
  ),
)
