"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User } from "@/types"
import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface WalletAdjustmentModalProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletAdjustmentModal({ user, open, onOpenChange }: WalletAdjustmentModalProps) {
  const [type, setType] = useState<"credit" | "debit">("credit")
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (open) {
      setType("credit")
      setAmount("")
      setReason("")
    }
  }, [open])

  if (!user) return null

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val)
  }

  const formatUID = (id: string) => {
    return id.replace("user_", "LBG-")
  }

  const handleApply = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason for the adjustment")
      return
    }

    // Success action
    onOpenChange(false)
    if (type === "credit") {
      toast.success(`Balance credited — $${amount} added to wallet`, {
        style: { color: "#16a34a", borderColor: "#bbf7d0", backgroundColor: "#f0fdf4" }
      })
    } else {
      toast.success(`Balance debited — $${amount} removed from wallet`, {
        style: { color: "#16a34a", borderColor: "#bbf7d0", backgroundColor: "#f0fdf4" }
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-slate-900">Wallet Adjustment</DialogTitle>
          <p className="text-sm text-slate-500 font-medium">
            {user.name} · {formatUID(user.id)}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Balance Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Current Balance</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(user.balance)}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <Wallet className="h-5 w-5 text-slate-600" />
            </div>
          </div>

          {/* Toggle Type */}
          <div className="flex p-1 bg-slate-100/80 rounded-lg border border-slate-200">
            <button
              onClick={() => setType("credit")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all duration-200",
                type === "credit"
                  ? "bg-white text-emerald-600 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <ArrowUpRight className="h-4 w-4" />
              Credit (+)
            </button>
            <button
              onClick={() => setType("debit")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all duration-200",
                type === "debit"
                  ? "bg-white text-rose-600 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <ArrowDownLeft className="h-4 w-4" />
              Debit (-)
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 bg-white border-slate-200 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900">
              Reason / Notes <span className="text-rose-500">*</span> <span className="text-xs font-medium text-slate-400 font-normal">Required for audit trail</span>
            </label>
            <Textarea
              placeholder="e.g. Manual prize payout for Game LBG-GM-0002 — approved by Super Admin"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none h-24 bg-white border-slate-200 focus-visible:ring-emerald-500"
            />
          </div>
        </div>

        <DialogFooter className="mt-8 gap-3 sm:space-x-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-200 text-slate-600 hover:bg-slate-50">
            Cancel
          </Button>
          <Button 
            onClick={handleApply}
            className={cn(
              "font-medium text-white shadow-sm",
              type === "credit" 
                ? "bg-emerald-500 hover:bg-emerald-600" 
                : "bg-rose-500 hover:bg-rose-600"
            )}
          >
            Apply Balance Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
