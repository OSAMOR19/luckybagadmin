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

interface DrawResultsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  game: Game | null
}

const mockDrawResults = [
  { id: "1", timestamp: "2026-05-31 20:00", ticket: "TKT-88421", uid: "LBG-33014411", amount: "$5,000" },
  { id: "2", timestamp: "2026-05-24 20:00", ticket: "TKT-71209", uid: "LBG-11874422", amount: "$5,000" },
  { id: "3", timestamp: "2026-05-17 20:00", ticket: "TKT-55830", uid: "LBG-33011100", amount: "$5,000" },
]

export function DrawResultsModal({ open, onOpenChange, game }: DrawResultsModalProps) {
  if (!game) return null

  const gameIdDisplay = game.id.replace('game_', 'LBG GM ')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Draw Results</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {gameIdDisplay} &middot; {game.title}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Draw Timestamp</TableHead>
                <TableHead>Ticket #</TableHead>
                <TableHead>Winner UID</TableHead>
                <TableHead>Prize Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDrawResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-mono text-xs">{result.timestamp}</TableCell>
                  <TableCell className="font-medium text-sm">{result.ticket}</TableCell>
                  <TableCell>
                    <Link href={`/users/${result.uid}`} className="text-blue-600 hover:underline text-sm font-mono">
                      {result.uid}
                    </Link>
                  </TableCell>
                  <TableCell className="text-green-600 font-bold text-sm">{result.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
