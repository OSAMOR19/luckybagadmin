"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { KeyRound, Eye, EyeOff } from "lucide-react"

interface PasswordManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PasswordManagementModal({ open, onOpenChange }: PasswordManagementModalProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSave = () => {
    // Add logic here to save the new password
    console.log("Password changed")
    onOpenChange(false)
    // reset state
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-5 w-5 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-lg">My Settings</DialogTitle>
            <DialogDescription className="text-xs">
              Change your account password
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="•••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              New Password
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="•••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="•••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:space-x-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Change Password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
