"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User } from "@/types"
import { format } from "date-fns"
import { CheckCircle, Clock, Edit2, User as UserIcon, ArrowUpRight, ArrowDownLeft, Gamepad2 } from "lucide-react"
import { mockGames } from "@/lib/mock-data"
import { DrawResultsModal } from "@/components/draw-results-modal"

interface UserProfileSheetProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onModifyBalance?: () => void
}

export function UserProfileSheet({ user, open, onOpenChange, onModifyBalance }: UserProfileSheetProps) {
  const [selectedGame, setSelectedGame] = useState<any>(null)
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false)

  if (!user) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatUID = (id: string) => {
    return id.replace("user_", "LBG-")
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-md overflow-y-auto bg-slate-50 border-l border-slate-200">
        <SheetHeader className="pb-6 mb-6 border-b border-slate-200/60 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
              <UserIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-slate-900 leading-tight">
                {user.name}
              </SheetTitle>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                {formatUID(user.id)}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Details Section */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Email</span>
              <span className="text-sm font-semibold text-slate-900">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Phone</span>
              <span className="text-sm font-semibold text-slate-900">{user.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Member since</span>
              <span className="text-sm font-semibold text-slate-900">
                {format(new Date(user.createdAt), "yyyy-MM-dd")}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-sm font-medium text-slate-500">Verification</span>
              <div className="flex items-center gap-2">
                {user.emailVerified ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 rounded-md font-medium text-xs px-2 py-0.5">
                    <CheckCircle className="mr-1.5 h-3 w-3" />
                    Email Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 rounded-md font-medium text-xs px-2 py-0.5">
                    <Clock className="mr-1.5 h-3 w-3" />
                    Email Unverified
                  </Badge>
                )}
                {user.smsVerified ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 rounded-md font-medium text-xs px-2 py-0.5">
                    <CheckCircle className="mr-1.5 h-3 w-3" />
                    SMS Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 rounded-md font-medium text-xs px-2 py-0.5">
                    <Clock className="mr-1.5 h-3 w-3" />
                    SMS Unverified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Wallet Section */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-bold text-slate-900">Wallet Balance</h3>
              <Button size="sm" className="h-8 rounded-md bg-primary hover:bg-primary/90 text-white font-medium text-xs" onClick={onModifyBalance}>
                <Edit2 className="mr-1.5 h-3 w-3" />
                Modify Balance
              </Button>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">{formatCurrency(user.balance)}</p>
            </div>
          </div>

          {/* Transaction History Section */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-sm font-bold text-slate-900">Transaction History</h3>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
                2
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Ticket refund</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">2026-05-28 • TXN-00191</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600">+$500</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                    <ArrowDownLeft className="h-4 w-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Prize payout LBG-GM-0005</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">2026-03-22 • TXN-00088</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-rose-600">-$1,200</span>
              </div>
            </div>
          </div>

          {/* Game Participation Section */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-sm font-bold text-slate-900">Game Participation</h3>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
                {mockGames.slice(0, 3).length}
              </span>
            </div>
            <div className="space-y-3">
              {mockGames.slice(0, 3).map((game) => (
                <div key={game.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Gamepad2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{game.title}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-0.5">{game.id.replace('game_', 'LBG GM ')}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-7 text-xs text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary"
                    onClick={() => {
                      setSelectedGame(game)
                      setIsDrawModalOpen(true)
                    }}
                  >
                    Results
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
    
    <DrawResultsModal
      open={isDrawModalOpen}
      onOpenChange={setIsDrawModalOpen}
      game={selectedGame}
    />
  </>
  )
}
