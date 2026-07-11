"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ShieldCheck, ArrowLeft, MailCheck } from "lucide-react"
import { authApi } from "@/lib/api"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    try {
      await authApi.forgotPassword(email)
      
      setIsSuccess(true)
      toast({
        title: "Request Sent",
        description: "A password reset link has been sent to your email.",
      })
    } catch (error: any) {
      // Still show success to prevent email enumeration attacks
      setIsSuccess(true)
      toast({
        title: "Request Sent",
        description: "A password reset link has been sent to your email.",
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
            <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Password Recovery</h1>
          <p className="text-sm text-slate-500 px-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Card Form */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <MailCheck className="w-6 h-6 text-[#2563eb]" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Check your inbox</h2>
              <p className="text-sm text-slate-600 mb-6">
                A password reset link has been sent to <strong>{email}</strong>. Please check your inbox.
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
                <Label htmlFor="email" className="text-[13px] font-medium text-slate-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@rubbyprospect.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`h-11 text-[13px] placeholder:text-slate-400 focus:placeholder-transparent focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 rounded-lg transition-colors ${
                    email ? "bg-[#e8f0fe] border-blue-200" : "bg-white border-slate-200"
                  }`}
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-[#2563eb] hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm disabled:bg-[#8cb4f9] disabled:opacity-100 disabled:text-white" 
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Link
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <Link 
                  href="/login"
                  className="flex items-center text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors mt-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
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
