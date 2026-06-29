"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/store/use-auth-store"
import { Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { authApi } from "@/lib/api"
import type { Admin } from "@/types"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authApi.login(email, password)
      
      if (response.status === "success" && response.data) {
        console.log("Login successful. Full response data:", response.data);
        const { token, user_details, admin_details } = response.data
        const details = admin_details || user_details || {}
        
        // Map the API user details to the frontend Admin model
        const adminUser: Admin = {
          id: details.admin_id || details.uid || String(details.id || "admin"),
          email: details.email || email,
          name: details.fullname || "Admin",
          role: details.role || "super_admin", // Use provided role or default
          isActive: true,
          createdAt: details.createdAt || new Date().toISOString(),
        }

        login(adminUser, token)

        toast({
          title: "Login successful",
          description: "Welcome to LuckyBag Admin Portal",
        })

        router.push("/dashboard")
      } else {
        throw new Error(response.message || "Invalid response from server")
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] p-4 font-sans">
      <div className="w-full max-w-[420px] flex flex-col items-center relative z-10 -mt-16">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#2563eb] p-3 rounded-2xl mb-5 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">LuckyBag Admin</h1>
          <p className="text-sm text-slate-500">Secure portal access — administrators only</p>
        </div>

        {/* Card Form */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px] font-medium text-slate-700">Email Address or Phone Number</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className={`h-11 text-[13px] placeholder:text-slate-400 focus:placeholder-transparent focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 rounded-lg transition-colors ${
                  email ? "bg-[#e8f0fe] border-blue-200" : "bg-white border-slate-200"
                }`}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[13px] font-medium text-slate-700">Password</Label>
                <a href="/forgot-password" className="text-[13px] font-medium text-[#2563eb] hover:text-blue-700 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`h-11 text-[13px] placeholder:text-slate-400 focus:placeholder-transparent pr-10 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 rounded-lg transition-colors ${
                    password ? "bg-[#e8f0fe] border-blue-200" : "bg-white border-slate-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full h-11 bg-[#2563eb] hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm disabled:bg-[#8cb4f9] disabled:opacity-100 disabled:text-white" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 left-0 w-full text-center">
        <p className="text-[12px] text-slate-400 font-medium">
          LuckyBag Admin Portal · v2.4.1 · All access is logged and audited
        </p>
      </div>
    </div>
  )
}

