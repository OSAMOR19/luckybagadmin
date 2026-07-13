"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ShieldCheck, MailCheck, LockKeyhole } from "lucide-react"
import { authApi } from "@/lib/api"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token") || ""
  
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      toast({
        title: "Invalid Link",
        description: "The reset link is invalid or missing a token.",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords mismatch",
        description: "The passwords you entered do not match.",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await authApi.resetPassword({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword
      })
      
      setIsSuccess(true)
      toast({
        title: "Password Reset Successful",
        description: "Your password has been successfully reset. You can now login.",
      })
    } catch (error: any) {
      toast({
        title: "Error resetting password",
        description: error?.message || "The link may be expired or invalid. Please try resetting again.",
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
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-[#2563eb] p-3 rounded-2xl mb-5 shadow-sm">
            <LockKeyhole className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Create New Password</h1>
          <p className="text-sm text-slate-500 px-4">
            Enter your new password below to regain access to your account.
          </p>
        </div>

        {/* Card Form */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <ShieldCheck className="w-6 h-6 text-[#2563eb]" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Password Reset Complete</h2>
              <p className="text-sm text-slate-600 mb-6">
                Your password has been updated securely. You can now log in with your new password.
              </p>
              <Link 
                href="/login"
                className="w-full h-11 flex items-center justify-center bg-[#2563eb] hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                Return to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-[13px] font-medium text-slate-700">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`h-11 text-[13px] placeholder:text-slate-400 focus:placeholder-transparent focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 rounded-lg transition-colors ${
                    newPassword ? "bg-[#e8f0fe] border-blue-200" : "bg-white border-slate-200"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[13px] font-medium text-slate-700">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`h-11 text-[13px] placeholder:text-slate-400 focus:placeholder-transparent focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 rounded-lg transition-colors ${
                    confirmPassword ? "bg-[#e8f0fe] border-blue-200" : "bg-white border-slate-200"
                  }`}
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-[#2563eb] hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm disabled:bg-[#8cb4f9] disabled:opacity-100 disabled:text-white" 
                  disabled={isLoading || !newPassword || !confirmPassword}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>

              <div className="text-center pt-2">
                <Link href="/login" className="text-[13px] text-slate-500 hover:text-slate-700 font-medium transition-colors">
                  &larr; Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-400">
          LuckyBag Admin Portal &middot; v2.4.1 &middot; All access is logged and audited
        </div>
      </div>
    </div>
  )
}
