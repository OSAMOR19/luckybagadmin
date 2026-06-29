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

import { useState, useEffect } from "react"
import { gamesApi } from "@/lib/api"

export function DrawResultsModal({ open, onOpenChange, game }: DrawResultsModalProps) {
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (open && game) {
      setIsLoading(true)
      gamesApi.getResults(game.id)
        .then((res: any) => {
          if (res.status === "success") {
            // Support both results and draws fields just in case
            const dataResults = res.data?.results || res.data?.draws || res.data || [];
            if (Array.isArray(dataResults)) {
              setResults(dataResults)
              setMessage("")
            } else if (dataResults?.message) {
              setResults([])
              setMessage(dataResults.message)
            } else {
              setResults([])
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching results", err)
          setResults([])
          setMessage(`Failed to load results: ${err.message || "Unknown error"}`)
        })
        .finally(() => setIsLoading(false))
    } else {
      setResults([])
      setMessage("")
    }
  }, [open, game])

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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">Loading...</TableCell>
                </TableRow>
              ) : results.length > 0 ? (
                results.map((result, i) => (
                  <TableRow key={result.id || i}>
                    <TableCell className="font-mono text-xs">{result.timestamp || result.created_at || "N/A"}</TableCell>
                    <TableCell className="font-medium text-sm">{result.ticket || result.ticket_number || "N/A"}</TableCell>
                    <TableCell>
                      <Link href={`/users/${result.uid || result.user_id}`} className="text-blue-600 hover:underline text-sm font-mono">
                        {result.uid || result.user_id || "Unknown"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-green-600 font-bold text-sm">{result.amount || result.prize || result.prize_amount || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {message || "No draw results found."}
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
