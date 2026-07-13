"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Game } from "@/types"
import { useState, useEffect } from "react"
import { gamesApi } from "@/lib/api"
import { format } from "date-fns"

interface GameParticipantsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  game: Game | null
}

export function GameParticipantsModal({ open, onOpenChange, game }: GameParticipantsModalProps) {
  const [participants, setParticipants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (open && game) {
      setIsLoading(true)
      gamesApi.fetchGameParticipants(game.id)
        .then((res: any) => {
          if (res.status === "success") {
            let dataList = [];
            if (Array.isArray(res.data)) {
              dataList = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
              dataList = res.data.data;
            } else if (res.data && Array.isArray(res.data.participants)) {
              dataList = res.data.participants;
            }

            if (dataList.length > 0) {
              setParticipants(dataList)
              setMessage("")
            } else {
              setParticipants([])
              setMessage("No participants found for this game.")
            }
          } else {
            setParticipants([])
            setMessage(res.message || "Failed to load participants.")
          }
        })
        .catch((err) => {
          console.error("Error fetching participants", err)
          setParticipants([])
          setMessage("Failed to load participants.")
        })
        .finally(() => setIsLoading(false))
    } else {
      setParticipants([])
      setMessage("")
    }
  }, [open, game])

  if (!game) return null

  const gameIdDisplay = game.id.replace('game_', 'LBG-GM-')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px]">
        <DialogHeader>
          <DialogTitle>Game Participants</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {gameIdDisplay} &middot; {game.title}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Join Time</TableHead>
                <TableHead>Ticket #</TableHead>
                <TableHead>Player Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">Loading participants...</TableCell>
                </TableRow>
              ) : participants.length > 0 ? (
                participants.map((p, i) => (
                  <TableRow key={p.id || p.ticket || i} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-xs text-slate-600" suppressHydrationWarning>
                      {p.joinedAt ? format(new Date(p.joinedAt), "MMM dd, yyyy HH:mm") : "N/A"}
                    </TableCell>
                    <TableCell className="font-medium font-mono text-sm">{p.ticket || "N/A"}</TableCell>
                    <TableCell className="capitalize text-sm font-medium">{p.player?.name || "N/A"}</TableCell>
                    <TableCell className="text-sm text-slate-500">{p.player?.email || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {message || "No participants found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
