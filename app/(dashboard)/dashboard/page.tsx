"use client"

import Image from "next/image"

import { StatCard } from "@/components/ui/stat-card"
import { ChartCard } from "@/components/ui/chart-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, UserCheck, DollarSign, Clock, Gamepad2, TrendingUp, TrendingDown, CheckCircle2, Wallet, AlertTriangle } from "lucide-react"
import { mockDashboardMetrics, mockActivityFeed, mockGames, mockChartData } from "../../../lib/mock-data"
import { Activity, Game } from "../../../types"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, Legend } from "recharts"
import { formatDistanceToNow, format } from "date-fns"
import { useState, useEffect } from "react"
import { usersApi, dashboardApi, gamesApi } from "../../../lib/api"

export default function DashboardPage() {
  const generateEmptyChartData = () => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()],
        participants: 0,
        newUsers: 0,
        amount: 0,
        withdrawals: 0,
        winnings: 0,
      };
    });
  };

  const [pendingAmount, setPendingAmount] = useState(0)
  const [creditAmount, setCreditAmount] = useState(0)
  const [debitAmount, setDebitAmount] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [activeUsers, setActiveUsers] = useState(0)
  const [activeGames, setActiveGames] = useState(0)
  const [gameParticipationData, setGameParticipationData] = useState<any[]>(generateEmptyChartData())
  const [transactionVolumeData, setTransactionVolumeData] = useState<any[]>(generateEmptyChartData())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const parseValue = (res: any) => {
      if (res?.data === undefined || res?.data === null) return undefined;
      if (typeof res.data === 'number') return res.data;
      if (typeof res.data === 'string') return parseInt(res.data, 10) || 0;
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data[0]?.amount ?? res.data[0]?.count ?? res.data[0]?.games ?? res.data[0]?.total ?? Object.values(res.data[0] || {})[0] ?? 0;
      }
      return res.data.amount ?? res.data.count ?? res.data.total ?? res.data.games ?? Object.values(res.data)[0];
    };

    const loadData = async () => {
      setIsLoading(true);
      await Promise.allSettled([
        // Wallet metrics
        usersApi.fetchWalletMetric("pending").then((res) => {
          if (res?.data?.amount !== undefined) setPendingAmount(res.data.amount)
        }).catch(e => console.log("[METRIC ERROR]", e.message)),

        usersApi.fetchWalletMetric("credit").then((res) => {
          if (res?.data?.amount !== undefined) setCreditAmount(res.data.amount)
        }).catch(e => console.log("[METRIC ERROR]", e.message)),

        usersApi.fetchWalletMetric("debit").then((res) => {
          if (res?.data?.amount !== undefined) setDebitAmount(res.data.amount)
        }).catch(e => console.log("[METRIC ERROR]", e.message)),
        
        // Dashboard metrics
        dashboardApi.fetchMetric("total-users").then((res) => {
          console.log("[DASHBOARD METRIC] total-users response:", res);
          const val = parseValue(res);
          if (val !== undefined) setTotalUsers(val)
        }).catch(e => console.log("[METRIC ERROR]", e.message)),

        dashboardApi.fetchMetric("active-users").then((res) => {
          console.log("[DASHBOARD METRIC] active-users response:", res);
          const val = parseValue(res);
          if (val !== undefined) setActiveUsers(val)
        }).catch(e => console.log("[METRIC ERROR]", e.message)),

        dashboardApi.fetchMetric("games").then((res) => {
          console.log("[DASHBOARD METRIC] games response:", res);
          const val = parseValue(res);
          if (val > 0) {
            setActiveGames(val)
          } else {
            // Fallback
            return gamesApi.fetchGames().then(gRes => {
              const list = Array.isArray(gRes?.data) ? gRes.data : ((gRes?.data as any)?.games || []);
              setActiveGames(list.length);
            }).catch(e => console.log("[METRIC ERROR]", e.message));
          }
        }).catch(err => {
          console.log("[METRIC ERROR]", err.message);
          // Fallback
          return gamesApi.fetchGames().then(gRes => {
            const list = Array.isArray(gRes?.data) ? gRes.data : ((gRes?.data as any)?.games || []);
            setActiveGames(list.length);
          }).catch(e => console.log("[METRIC ERROR]", e.message));
        }),

        // Game participation chart
        dashboardApi.fetchGameParticipationChart().then((res) => {
          console.log("[DASHBOARD METRIC] game participation response:", res);
          if (res?.data && Array.isArray(res.data)) {
            if (res.data.length > 0) {
              const formattedData = res.data.map((item: any) => ({
                date: item.day || item.date || "",
                participants: item.totalParticipants || 0,
                newUsers: item.newUsers || 0,
              }));
              setGameParticipationData(formattedData);
            } else {
              setGameParticipationData(generateEmptyChartData());
            }
          }
        }).catch(e => console.log("[METRIC ERROR]", e.message)),

        // Transaction volume chart
        dashboardApi.fetchTransactionVolumeChart().then((res) => {
          console.log("[DASHBOARD METRIC] transaction volume response:", res);
          if (res?.data && Array.isArray(res.data)) {
            if (res.data.length > 0) {
              const formattedData = res.data.map((item: any) => ({
                date: item.day || item.date || "",
                amount: item.deposits || 0,
                withdrawals: item.withdrawals || 0,
                winnings: item.winnings || 0,
              }));
              setTransactionVolumeData(formattedData);
            } else {
              setTransactionVolumeData(generateEmptyChartData());
            }
          }
        }).catch(e => console.log("[METRIC ERROR]", e.message))
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [])

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

  const NairaIcon = ({ className }: { className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 20V4l12 16V4" />
      <path d="M4 10h16" />
      <path d="M4 14h16" />
    </svg>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your LuckyBag platform performance</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px] w-full rounded-xl" />
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={totalUsers.toLocaleString()}
              icon={Users}
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatCard
              title="Active Users"
              value={activeUsers.toLocaleString()}
              icon={UserCheck}
              trend={{ value: 8.2, isPositive: true }}
            />
            {/* <StatCard
              title="Total Credit"
              value={formatCurrency(creditAmount)}
              icon={NairaIcon}
              iconClassName="bg-blue-500/10 text-blue-500"
              trend={{ value: 15.3, isPositive: true }}
            />
            <StatCard
              title="Total Debit"
              value={formatCurrency(debitAmount)}
              icon={Wallet}
              trend={{ value: -2.4, isPositive: false }}
            /> */}
            <StatCard
              title="Pending Withdrawals"
              value={formatCurrency(pendingAmount)}
              icon={Clock}
              trend={{ value: -5.1, isPositive: false }}
            />
            <StatCard title="Active Games" value={activeGames} icon={Gamepad2} />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </>
        ) : (
          <>
            <ChartCard title="Game Participation" description="Daily participants over the last week" className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={gameParticipationData}>
                  <defs>
                    <linearGradient id="colorParticipants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                  <XAxis dataKey="date" className="text-xs font-medium" tick={{ fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" className="text-xs font-medium" tick={{ fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" className="text-xs font-medium" tick={{ fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                      padding: "12px",
                      fontWeight: 500,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Bar yAxisId="left" name="Total Participants" dataKey="participants" fill="url(#colorParticipants)" radius={[6, 6, 0, 0]} barSize={32} />
                  <Line yAxisId="right" type="monotone" name="New Users" dataKey="newUsers" stroke="var(--success)" strokeWidth={3} dot={{ fill: "var(--card)", stroke: "var(--success)", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: "var(--success)" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Transaction Volume" description="Daily transaction amounts over the last week" className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={transactionVolumeData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--warning)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--warning)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                  <XAxis dataKey="date" className="text-xs font-medium" tick={{ fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" className="text-xs font-medium" tick={{ fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" className="text-xs font-medium" tick={{ fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value/1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                      padding: "12px",
                      fontWeight: 500,
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Bar yAxisId="left" name="Deposits" dataKey="amount" fill="url(#colorAmount)" radius={[6, 6, 0, 0]} barSize={32} />
                  <Area yAxisId="right" type="monotone" name="Withdrawals" dataKey="withdrawals" stroke="var(--warning)" fill="url(#colorWithdrawals)" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>

      {/* Activity and Draws Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-primary/10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <CardHeader className="border-b border-border/40 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold tracking-tight">Recent Activity</CardTitle>
            <a href="#" className="text-sm font-medium text-primary hover:underline">View audit log</a>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col">
              {mockActivityFeed.map((activity: Activity) => {
                let Icon = CheckCircle2
                let iconColorClass = "text-emerald-500 bg-emerald-50"

                if (activity.type === "user_registered") {
                  Icon = Users
                  iconColorClass = "text-blue-500 bg-blue-50"
                } else if (activity.type === "wallet_credited") {
                  Icon = Wallet
                  iconColorClass = "text-purple-500 bg-purple-50"
                } else if (activity.type === "game_scheduled") {
                  Icon = AlertTriangle
                  iconColorClass = "text-amber-500 bg-amber-50"
                } else if (activity.type === "withdrawal_processed") {
                  Icon = Wallet
                  iconColorClass = "text-rose-500 bg-rose-50"
                }

                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between border-b border-border/40 py-3 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{activity.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0 text-right">
                      <p className="text-xs font-medium text-muted-foreground" suppressHydrationWarning>
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Draws */}
        {/*
        <Card className="border-primary/10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <CardHeader className="border-b border-border/40 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold tracking-tight">Upcoming Draws</CardTitle>
            <a href="#" className="text-sm font-medium text-primary hover:underline">Manage games &rarr;</a>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col">
              {mockGames.filter((g: Game) => g.status === 'upcoming' || g.status === 'live').map((game: Game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between border-b border-border/40 py-3 last:border-0"
                >
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{game.title}</p>
                    <p className="text-[13px] font-mono text-muted-foreground uppercase">{game.id.replace('_', '-')}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-muted-foreground" suppressHydrationWarning>
                      <Clock className="h-3.5 w-3.5" />
                      {format(new Date(game.startTime), "MMM dd · HH:mm")}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={
                        game.status === "live"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      }
                    >
                      {game.status.toUpperCase()}
                    </Badge>
                    <p className="font-bold text-foreground">
                      {formatCurrency(game.prizePool)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        */}
      </div>
    </div>
  )
}
