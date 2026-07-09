import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Admin } from "@/types"

interface AuthState {
  admin: Admin | null
  token: string | null
  isAuthenticated: boolean
  login: (admin: Admin, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      login: (admin, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token)
        }
        set({ admin, token, isAuthenticated: true })
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token")
          localStorage.removeItem("auth-storage")
          localStorage.clear()
          sessionStorage.clear()
        }
        set({ admin: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
