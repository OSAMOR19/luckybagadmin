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
import Link from "next/link"

interface GameParticipantsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  game: Game | null
}

import { useState, useEffect } from "react"
import { gamesApi } from "@/lib/api"

export function GameParticipantsModal({ open, onOpenChange, game }: GameParticipantsModalProps) {
  const [participants, setParticipants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (open && game) {
      setIsLoading(true)
      gamesApi.getDraws(game.id)
        .then((res: any) => {
          if (res.status === "success") {
            const dataDraws = res.data?.draws || res.data || [];
            if (Array.isArray(dataDraws)) {
              setParticipants(dataDraws)
              setMessage("")
            } else if (dataDraws?.message) {
              setParticipants([])
              setMessage(dataDraws.message)
            } else {
              setParticipants([])
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching participants", err)
          setParticipants([])
          setMessage("Failed to load participants")
        })
        .finally(() => setIsLoading(false))
    } else {
      setParticipants([])
      setMessage("")
    }
  }, [open, game])

  if (!game) return null

  const gameIdDisplay = game.id.replace('game_', 'LBG GM ')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Game Participants</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {gameIdDisplay} &middot; {game.title}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Join Time</TableHead>
                <TableHead>Ticket #</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">Loading...</TableCell>
                </TableRow>
              ) : participants.length > 0 ? (
                participants.map((p, i) => (
                  <TableRow key={p.id || i}>
                    <TableCell className="font-mono text-xs">{p.timestamp || p.created_at || "N/A"}</TableCell>
                    <TableCell className="font-medium text-sm">{p.ticket || p.ticket_number || "N/A"}</TableCell>
                    <TableCell>
                      <Link href={`/users/${(p.uid || p.user_id || "unknown").replace('LBG-', 'user_')}`} className="text-blue-600 hover:underline text-sm font-mono">
                        {p.uid || p.user_id || "Unknown"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{p.name || p.username || "N/A"}</TableCell>
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
