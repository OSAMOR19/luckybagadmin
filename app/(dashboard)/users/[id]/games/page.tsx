"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockUsers, mockGames } from "@/lib/mock-data"
import { ArrowLeft, Gamepad2 } from "lucide-react"
import { format } from "date-fns"

export default function UserGamesPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const user = mockUsers.find((u) => u.id === userId)

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold">User not found</h2>
          <Button onClick={() => router.push("/users")} className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    )
  }

  // Use a subset of games to simulate participation
  const participatedGames = mockGames.slice(0, 4)

  const formatUID = (id: string) => {
    return id.replace("user_", "LBG-")
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/users")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Game Participation</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            {user.name} &middot; {formatUID(user.id)}
          </p>
        </div>
      </div>

      <Card className="rounded-xl border-slate-100 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Gamepad2 className="h-4 w-4 text-primary" />
            </div>
            Games History
          </CardTitle>
          <CardDescription>
            A detailed log of games {user.name} has participated in.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-medium text-slate-500 px-6 py-3">Game ID</TableHead>
                  <TableHead className="font-medium text-slate-500 py-3">Title</TableHead>
                  <TableHead className="font-medium text-slate-500 py-3">Join Date</TableHead>
                  <TableHead className="font-medium text-slate-500 py-3">Ticket #</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participatedGames.map((game, index) => (
                  <TableRow key={game.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-mono text-xs text-slate-500 px-6">
                      {game.id.replace('game_', 'LBG-GM-')}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">{game.title}</TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {format(new Date(Date.now() - 1000 * 60 * 60 * 24 * (index * 3 + 1)), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-slate-700">
                      TKT-{Math.floor(10000 + Math.random() * 90000)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
