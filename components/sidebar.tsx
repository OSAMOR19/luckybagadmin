"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authApi, dashboardApi, usersApi, gamesApi } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/use-auth-store"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  Gamepad2,
  Users,
  CreditCard,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const navigationSections = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        color: "bg-blue-500",
        badge: null,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        name: "Games",
        href: "/games",
        icon: Gamepad2,
        color: "bg-purple-500",
        badge: null,
      },
      {
        name: "Users",
        href: "/users",
        icon: Users,
        color: "bg-green-500",
        badge: null,
      },
      {
        name: "Wallet Management",
        href: "/wallet-management",
        icon: Wallet,
        color: "bg-orange-500",
        badge: null,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        name: "Admins",
        href: "/admins",
        icon: Shield,
        color: "bg-red-500",
        badge: null,
      },
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        color: "bg-gray-500",
        badge: null,
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { admin, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Logout API failed:", error)
    } finally {
      logout()
      router.push("/login")
    }
  }

  const [metrics, setMetrics] = useState({
    users: 0,
    games: 0,
    wallet: 0
  })

  useEffect(() => {
    if (!admin) return;

    const parseValue = (res: any) => {
      if (res?.data === undefined || res?.data === null) return 0;
      if (typeof res.data === 'number') return res.data;
      if (typeof res.data === 'string') return parseInt(res.data, 10) || 0;
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data[0]?.amount ?? res.data[0]?.count ?? res.data[0]?.games ?? res.data[0]?.total ?? Object.values(res.data[0] || {})[0] ?? 0;
      }
      return res.data.amount ?? res.data.count ?? res.data.total ?? res.data.games ?? Object.values(res.data)[0] ?? 0;
    };

    dashboardApi.fetchMetric("total-users")
      .then(res => setMetrics(prev => ({ ...prev, users: parseValue(res) })))
      .catch(console.error);

    dashboardApi.fetchMetric("games")
      .then(res => {
        const val = parseValue(res);
        if (val > 0) {
          setMetrics(prev => ({ ...prev, games: val }));
        } else {
          // Fallback if metric API is broken
          gamesApi.fetchGames().then(gRes => {
            const list = Array.isArray(gRes?.data) ? gRes.data : ((gRes?.data as any)?.games || []);
            setMetrics(prev => ({ ...prev, games: list.length }));
          }).catch(console.error);
        }
      })
      .catch(err => {
        console.error(err);
        // Fallback on error
        gamesApi.fetchGames().then(gRes => {
          const list = Array.isArray(gRes?.data) ? gRes.data : ((gRes?.data as any)?.games || []);
          setMetrics(prev => ({ ...prev, games: list.length }));
        }).catch(console.error);
      });
      
    usersApi.fetchWalletMetric("pending")
      .then(res => setMetrics(prev => ({ ...prev, wallet: res?.data?.amount || 0 })))
      .catch(console.error);
  }, [admin])

  const formatBadge = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
    return num.toString()
  }

  return (
    <div className="hidden md:flex h-full w-72 flex-col bg-white border-r border-gray-200 shadow-sm shrink-0">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent px-6 py-8 border-b border-gray-200">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
              <Gamepad2 className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">LuckyBag</h1>
              <p className="text-xs text-white/80 font-medium">Admin Portal</p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-accent/30 blur-xl" />
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {navigationSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                
                let dynamicBadge: string | null = item.badge
                if (item.name === "Users" && metrics.users > 0) dynamicBadge = formatBadge(metrics.users)
                if (item.name === "Games" && metrics.games > 0) dynamicBadge = formatBadge(metrics.games)
                if (item.name === "Wallet Management" && metrics.wallet > 0) dynamicBadge = formatBadge(metrics.wallet)

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-primary",
                    )}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary" />
                    )}

                    {/* Icon with colored background */}
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                        isActive ? `${item.color} shadow-md` : "bg-gray-100 group-hover:bg-gray-200",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive ? "text-white" : "text-gray-600 group-hover:text-primary",
                        )}
                      />
                    </div>

                    <span className="flex-1">{item.name}</span>

                    {/* Badge */}
                    {dynamicBadge && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "h-6 px-2 text-xs font-semibold",
                          isActive ? "bg-primary text-white" : "bg-gray-200 text-gray-700",
                        )}
                      >
                        {dynamicBadge}
                      </Badge>
                    )}

                    {/* Chevron on hover */}
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-all duration-200",
                        isActive
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                      )}
                    />
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-200 bg-gray-50/50 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm border border-gray-200">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="bg-primary text-white font-semibold">
              {admin?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "AD"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{admin?.name || "Admin User"}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium border-primary/30 text-primary">
                {admin?.role || "Super Admin"}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
            <Bell className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
