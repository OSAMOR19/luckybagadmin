"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CreateGameModal } from "@/components/create-game-modal"
import { mockGames } from "@/lib/mock-data"
import { Plus, Search, Play, Square, Users, Calendar, Trophy } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [games, setGames] = useState(mockGames)
  const { toast } = useToast()

  const filteredGames = games.filter((game) => game.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleStartGame = async (gameId: string) => {
    toast({
      title: "Game started",
      description: "The game is now live",
    })
    // Mock update - replace with actual API call
    setGames(games.map((g) => (g.id === gameId ? { ...g, status: "live" as const } : g)))
  }

  const handleStopGame = async (gameId: string) => {
    toast({
      title: "Game stopped",
      description: "The game has been ended",
    })
    // Mock update - replace with actual API call
    setGames(games.map((g) => (g.id === gameId ? { ...g, status: "completed" as const } : g)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "upcoming":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "completed":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return ""
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Games Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage LuckyBag games</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Game
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Games Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGames.map((game) => (
          <Card key={game.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{game.title}</CardTitle>
                  <CardDescription className="mt-1">{game.description}</CardDescription>
                </div>
                <Badge variant="outline" className={getStatusColor(game.status)}>
                  {game.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Start:</span>
                  <span className="font-medium">{format(new Date(game.startTime), "MMM dd, HH:mm")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">End:</span>
                  <span className="font-medium">{format(new Date(game.endTime), "MMM dd, HH:mm")}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Prize Pool</p>
                    <p className="text-sm font-semibold">{formatCurrency(game.prizePool)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Participants</p>
                    <p className="text-sm font-semibold">{game.participants.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {game.status === "upcoming" && (
                  <Button size="sm" className="flex-1" onClick={() => handleStartGame(game.id)}>
                    <Play className="mr-2 h-4 w-4" />
                    Start Game
                  </Button>
                )}
                {game.status === "live" && (
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleStopGame(game.id)}>
                    <Square className="mr-2 h-4 w-4" />
                    Stop Game
                  </Button>
                )}
                {game.status === "completed" && (
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    View Results
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateGameModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          // Refresh games list
        }}
      />
    </div>
  )
}
