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

const mockParticipants = [
  { id: "1", timestamp: "2026-05-30 14:22", ticket: "TKT-88421", uid: "LBG-33014411", name: "Devon Brooks" },
  { id: "2", timestamp: "2026-05-30 15:05", ticket: "TKT-71209", uid: "LBG-11874422", name: "Priya Sharma" },
  { id: "3", timestamp: "2026-05-31 09:12", ticket: "TKT-55830", uid: "LBG-33011100", name: "Marcus Williams" },
]

export function GameParticipantsModal({ open, onOpenChange, game }: GameParticipantsModalProps) {
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
              {mockParticipants.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.timestamp}</TableCell>
                  <TableCell className="font-medium text-sm">{p.ticket}</TableCell>
                  <TableCell>
                    <Link href={`/users/${p.uid.replace('LBG-', 'user_')}`} className="text-blue-600 hover:underline text-sm font-mono">
                      {p.uid}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{p.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
