"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface CreditDebitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "credit" | "debit"
  userId: string
  userName: string
  onSuccess: () => void
}

export function CreditDebitModal({ open, onOpenChange, type, userId, userName, onSuccess }: CreditDebitModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [otp, setOtp] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: `${type === "credit" ? "Credit" : "Debit"} successful`,
        description: `${type === "credit" ? "Added" : "Deducted"} $${amount} ${type === "credit" ? "to" : "from"} ${userName}'s account`,
      })

      onSuccess()
      onOpenChange(false)
      setAmount("")
      setOtp("")
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: "Please check your OTP and try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{type === "credit" ? "Credit User" : "Debit User"}</DialogTitle>
          <DialogDescription>
            {type === "credit" ? "Add funds to" : "Deduct funds from"} {userName}'s account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Confirmation</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">Enter your OTP to confirm this transaction</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} variant={type === "debit" ? "destructive" : "default"}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Confirm ${type === "credit" ? "Credit" : "Debit"}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
