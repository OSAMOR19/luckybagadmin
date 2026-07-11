"use client"

import Image from "next/image"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreateGameModal } from "@/components/create-game-modal"
import { DrawResultsModal } from "@/components/draw-results-modal"
import { GameParticipantsModal } from "@/components/game-participants-modal"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockGames } from "@/lib/mock-data"
import { Plus, Search, Play, Square, Users, Calendar, Trophy, LayoutGrid, List, Eye, MoreHorizontal, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { gamesApi } from "@/lib/api"

import { Game } from "@/types"

type ViewType = "grid" | "list"
type FilterTab = "all" | "active" | "upcoming" | "past"

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [games, setGames] = useState<Game[]>([])
  const [viewType, setViewType] = useState<ViewType>("list")
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [selectedParticipantsGame, setSelectedParticipantsGame] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10
  const { toast } = useToast()

  const fetchGames = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching games and upcoming raffles...")

      const [gamesResponse, upcomingResponse] = await Promise.all([
        gamesApi.fetchGames(currentPage, itemsPerPage).catch(e => ({ status: "error", message: e.message, data: [] })),
        gamesApi.getUpcomingRaffles().catch(e => ({ status: "error", message: e.message, data: { games: [] } }))
      ])

      console.log("DEBUG_API_GAMES:", JSON.stringify(gamesResponse, null, 2))
      let allGamesData: any[] = []
      let total = 0

      if (gamesResponse.status === "success") {
        allGamesData = [...(Array.isArray(gamesResponse.data) ? gamesResponse.data : (gamesResponse.data?.games || []))]

        let apiTotal = (gamesResponse as any).total ?? (gamesResponse as any).data?.total ?? (gamesResponse as any).data?.pagination?.total ?? (gamesResponse as any).pagination?.total;

        if (apiTotal !== undefined && apiTotal !== null) {
          total = apiTotal;
        } else if (allGamesData.length > 0) {
          total = currentPage * itemsPerPage + 1;
        } else {
          total = (currentPage - 1) * itemsPerPage;
        }
      }

      setTotalItems(total)

      if (upcomingResponse.status === "success") {
        const upcomingGames = upcomingResponse.data?.games || []
        // Add upcoming games if they aren't already in allGamesData
        const existingIds = new Set(allGamesData.map(g => g.game_id || g.id))
        upcomingGames.forEach((g: any) => {
          if (!existingIds.has(g.game_id || g.id)) {
            allGamesData.push(g)
          }
        })
      } else if (gamesResponse.status !== "success") {
        // If both failed, throw error to be caught below
        throw new Error(gamesResponse.message || "Failed to fetch games data")
      }

      const formattedGames: Game[] = allGamesData.map((apiGame: any) => {
        let mappedStatus = apiGame.status === "active" ? "live" : apiGame.status
        if (mappedStatus === "pending") mappedStatus = "upcoming"

        return {
          id: apiGame.game_id || apiGame.id,
          title: apiGame.game_name || apiGame.name,
          description: "",
          startTime: apiGame.created_at || new Date().toISOString(),
          endTime: apiGame.draw_time,
          prizePool: parseFloat(apiGame.amount),
          status: mappedStatus,
          participants: 0,
          interval: apiGame.draw_interval?.toString(),
          winPercentage: apiGame.winning_percentage,
          maxWinners: apiGame.max_winners,
        }
      })
      setGames(formattedGames)
    } catch (error: any) {
      console.error("Error fetching games:", error)
      toast({
        title: "Error loading games",
        description: error?.message || "Failed to fetch games from the server.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [currentPage])

  const handleStartGame = async (gameId: string) => {
    try {
      const response: any = await gamesApi.startGame(gameId)
      if (response.status !== "success") {
        throw new Error(response.message || "Failed to start game")
      }
      toast({
        title: "Game started",
        description: "The game is now live",
      })
      setGames(games.map((g) => (g.id === gameId ? { ...g, status: "live" as const } : g)))
    } catch (error: any) {
      toast({ title: "Error starting game", description: error?.message || "Failed to start game", variant: "destructive" })
    }
  }

  const handleStopGame = async (gameId: string) => {
    try {
      const response: any = await gamesApi.stopGame(gameId)
      if (response.status !== "success") {
        throw new Error(response.message || "Failed to stop game")
      }
      toast({
        title: "Game stopped",
        description: "The game has been ended",
      })
      setGames(games.map((g) => (g.id === gameId ? { ...g, status: "completed" as const } : g)))
    } catch (error: any) {
      toast({ title: "Error stopping game", description: error?.message || "Failed to stop game", variant: "destructive" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "upcoming":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "completed":
        return "bg-slate-500/10 text-slate-500 border-slate-500/20"
      default:
        return ""
    }
  }

  const formatCurrency = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
    }).format(amount)

    return (
      <span className="inline-flex items-center">
        <Image src="/naira1.png" alt="₦" width={18} height={18} className="mr-[2px] object-contain" />
        {formattedAmount}
      </span>
    )
  }

  // Calculate counts
  const counts = {
    all: games.length,
    active: games.filter((g) => g.status === "live").length,
    upcoming: games.filter((g) => g.status === "upcoming").length,
    past: games.filter((g) => g.status === "completed").length,
  }

  // Filter games based on search and tab
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.id.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    switch (activeTab) {
      case "active":
        return game.status === "live"
      case "upcoming":
        return game.status === "upcoming"
      case "past":
        return game.status === "completed"
      default:
        return true
    }
  })

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const paginatedGames = filteredGames

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-2xl dark:bg-slate-800/50">
          <Button
            variant="ghost"
            className={cn(
              "rounded-xl px-4 py-2 h-auto text-sm font-medium transition-all",
              activeTab === "all"
                ? "bg-white shadow-sm text-foreground dark:bg-slate-900"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleTabChange("all")}
          >
            All Games
            {/* We only show counts.all (which is items on current page) because the backend doesn't return a total count */}
            <Badge variant="secondary" className={cn("ml-2 rounded-md", activeTab === "all" ? "bg-slate-100 dark:bg-slate-800" : "bg-transparent border-slate-200 dark:border-slate-700")}>
              {counts.all}
            </Badge>
          </Button>
          {/* <Button
            variant="ghost"
            className={cn(
              "rounded-xl px-4 py-2 h-auto text-sm font-medium transition-all",
              activeTab === "active"
                ? "bg-white shadow-sm text-foreground dark:bg-slate-900"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab("active")}
          >
            Active Draw
            <Badge variant="secondary" className={cn("ml-2 rounded-md", activeTab === "active" ? "bg-slate-100 dark:bg-slate-800" : "bg-transparent border-slate-200 dark:border-slate-700")}>
              {counts.active}
            </Badge>
          </Button> */}
          {/* <Button
            variant="ghost"
            className={cn(
              "rounded-xl px-4 py-2 h-auto text-sm font-medium transition-all",
              activeTab === "upcoming"
                ? "bg-white shadow-sm text-foreground dark:bg-slate-900"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleTabChange("upcoming")}
          >
            Upcoming Raffles
            <Badge variant="secondary" className={cn("ml-2 rounded-md", activeTab === "upcoming" ? "bg-slate-100 dark:bg-slate-800" : "bg-transparent border-slate-200 dark:border-slate-700")}>
              {counts.upcoming}
            </Badge>
          </Button> */}
          <Button
            variant="ghost"
            className={cn(
              "rounded-xl px-4 py-2 h-auto text-sm font-medium transition-all",
              activeTab === "past"
                ? "bg-white shadow-sm text-foreground dark:bg-slate-900"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleTabChange("past")}
          >
            Past Results
            <Badge variant="secondary" className={cn("ml-2 rounded-md", activeTab === "past" ? "bg-slate-100 dark:bg-slate-800" : "bg-transparent border-slate-200 dark:border-slate-700")}>
              {counts.past}
            </Badge>
          </Button>
        </div>

        <Button className="rounded-xl" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Game
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-900"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl dark:bg-slate-800/50">
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-lg h-8 w-8", viewType === "list" ? "bg-white shadow-sm dark:bg-slate-900 text-foreground" : "text-muted-foreground")}
            onClick={() => setViewType("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-lg h-8 w-8", viewType === "grid" ? "bg-white shadow-sm dark:bg-slate-900 text-foreground" : "text-muted-foreground")}
            onClick={() => setViewType("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewType === "list" ? (
        <Card className="rounded-xl overflow-hidden shadow-sm border-slate-200/60 dark:border-slate-800">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                <TableHead className="font-medium text-slate-500">Game ID</TableHead>
                <TableHead className="font-medium text-slate-500">Name</TableHead>
                <TableHead className="font-medium text-slate-500">Amount</TableHead>
                <TableHead className="font-medium text-slate-500">Interval</TableHead>
                <TableHead className="font-medium text-slate-500">Win %</TableHead>
                <TableHead className="font-medium text-slate-500">Max W.</TableHead>
                <TableHead className="font-medium text-slate-500">Draw Time</TableHead>
                <TableHead className="font-medium text-slate-500 text-center">Status</TableHead>
                <TableHead className="font-medium text-slate-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedGames.length > 0 ? (
                paginatedGames.map((game) => (
                  <TableRow key={game.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <TableCell className="font-mono text-xs text-slate-500">
                      {game.id.replace('game_', 'LBG-GM-')}
                    </TableCell>
                    <TableCell className="font-medium">{game.title}</TableCell>
                    <TableCell>{formatCurrency(game.prizePool)}</TableCell>
                    <TableCell className="text-slate-500">{game.interval || 'N/A'}</TableCell>
                    <TableCell>{game.winPercentage || 0}%</TableCell>
                    <TableCell>{game.maxWinners || 0}</TableCell>
                    <TableCell className="text-slate-500 font-mono text-xs">
                      {format(new Date(game.endTime), "yyyy-MM-dd HH:mm")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={cn("inline-flex items-center justify-center min-w-[95px] px-2 py-1 rounded-full text-xs font-medium gap-1.5 border", getStatusColor(game.status))}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                        {game.status.toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {game.status === "live" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-24 text-red-500 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-600 dark:bg-red-950/30 dark:border-red-900/50"
                            onClick={() => handleStopGame(game.id)}
                          >
                            <Square className="mr-1.5 h-3 w-3" /> Stop
                          </Button>
                        )}
                        {game.status === "upcoming" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-24 text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700 dark:bg-green-950/30 dark:border-green-900/50"
                            onClick={() => handleStartGame(game.id)}
                          >
                            <Play className="mr-1.5 h-3 w-3" /> Start
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedParticipantsGame(game)}>
                              <Users className="mr-2 h-4 w-4" />
                              View Participants
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedGame(game)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Results
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No games found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500">
            Showing {paginatedGames.length} games on this page
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 border-dashed">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400 mb-4" />
              <p>Loading games...</p>
            </div>
          ) : paginatedGames.length > 0 ? (
            paginatedGames.map((game) => (
              <Card key={game.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{game.title}</CardTitle>
                      <CardDescription className="mt-1">{game.description}</CardDescription>
                    </div>
                    <div className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1.5 border", getStatusColor(game.status))}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      {game.status.toUpperCase()}
                    </div>
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary dark:bg-primary/10"
                      onClick={() => setSelectedGame(game)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 border-dashed">
              No games found in this view.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }

                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }

                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <CreateGameModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          fetchGames()
        }}
      />

      <DrawResultsModal
        open={!!selectedGame}
        onOpenChange={(open) => !open && setSelectedGame(null)}
        game={selectedGame}
      />

      <GameParticipantsModal
        open={!!selectedParticipantsGame}
        onOpenChange={(open) => !open && setSelectedParticipantsGame(null)}
        game={selectedParticipantsGame}
      />
    </div>
  )
}
