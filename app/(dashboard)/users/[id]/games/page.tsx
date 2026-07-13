"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Gamepad2, Loader2, Trophy } from "lucide-react"
import { format } from "date-fns"
import { usersApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

interface Ticket {
  gamePlayed: {
    name: string;
    id: string;
  };
  ticket: string;
  joinedAt: string;
  isWinner: boolean;
  wonAt: string | null;
}

export default function UserGamesPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const { toast } = useToast()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true)
        const res = await usersApi.fetchUserTickets(userId, 1)
        console.log(`[USER TICKETS DEBUG] Response for user ${userId}:`, res);
        let ticketsData = [];
        if (res.status === "success") {
          if (Array.isArray(res.data)) {
            ticketsData = res.data;
          } else if (res.data && Array.isArray(res.data.data)) {
            ticketsData = res.data.data;
          } else if (res.data && Array.isArray(res.data.tickets)) {
            ticketsData = res.data.tickets;
          }
        }
        
        if (ticketsData.length > 0) {
          ticketsData.forEach((ticket: any) => {
            console.log("[USER TICKET INFO] Ticket:", ticket.ticket, "Game Played:", ticket.gamePlayed);
          });
          setTickets(ticketsData)
        } else {
          console.log("[USER TICKETS] No tickets found in parsed data structure", ticketsData);
          setTickets([])
        }
      } catch (error: any) {
        console.error("Failed to fetch user tickets:", error)
        toast({
          title: "Error",
          description: "Could not fetch user's game participation.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchTickets()
    }
  }, [userId, toast])

  const formatUID = (id: string) => {
    return id.startsWith("LBG-") ? id : id.replace("user_", "LBG-")
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
            User &middot; {formatUID(userId)}
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
            A detailed log of games this user has participated in.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-medium text-slate-500 px-6 py-3">Game Title</TableHead>
                  <TableHead className="font-medium text-slate-500 py-3">Game ID</TableHead>
                  <TableHead className="font-medium text-slate-500 py-3">Ticket #</TableHead>
                  <TableHead className="font-medium text-slate-500 py-3">Join Date</TableHead>
                  <TableHead className="font-medium text-slate-500 py-3">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : tickets.length > 0 ? (
                  tickets.map((t, index) => (
                    <TableRow key={index} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-900 px-6 capitalize">
                        {t.gamePlayed?.name || 'Unknown Game'}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">
                        {t.gamePlayed?.id ? t.gamePlayed.id.substring(0, 8) + "..." : "N/A"}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-slate-700">
                        {t.ticket}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm" suppressHydrationWarning>
                        {t.joinedAt ? format(new Date(t.joinedAt), "MMM dd, yyyy HH:mm") : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {t.isWinner ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                            <Trophy className="w-3 h-3 mr-1" />
                            Winner
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                            Participant
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                      No game participation found for this user.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
