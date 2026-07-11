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
          document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`
        }
        set({ admin, token, isAuthenticated: true })
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token")
          localStorage.removeItem("auth-storage")
          localStorage.clear()
          sessionStorage.clear()
          document.cookie = `auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
        set({ admin: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
