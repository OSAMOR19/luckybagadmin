"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PasswordManagementModal } from "@/components/password-management-modal"
import { NotificationsSheet } from "@/components/notifications-sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/use-auth-store"
import { LogOut, User, Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { mockActivityFeed } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"

export function Navbar() {
  const router = useRouter()
  const { admin, logout } = useAuthStore()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isNotificationsSheetOpen, setIsNotificationsSheetOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const initials =
    admin?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "AD"

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-card-foreground whitespace-nowrap">Admin Portal</h2>
        <div className="hidden md:block h-6 w-px bg-border mx-2"></div>
        <div className="hidden md:flex relative w-80 lg:w-96 items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users, games, or IDs..."
            className="w-full bg-secondary/50 pl-9 pr-4 h-9 rounded-md border-0 focus-visible:ring-1 focus-visible:ring-primary shadow-none text-sm"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-full border-border bg-background hover:bg-muted">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-background"></span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="font-semibold px-3 py-2">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[350px] overflow-y-auto">
              {mockActivityFeed.map((activity) => (
                <DropdownMenuItem key={activity.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex w-full justify-between items-start gap-2">
                    <span className="text-sm font-medium leading-none">{activity.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {activity.description}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="w-full text-center text-xs text-primary justify-center font-medium cursor-pointer p-2.5"
              onClick={() => setIsNotificationsSheetOpen(true)}
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{admin?.name}</p>
                <p className="text-xs text-muted-foreground">{admin?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{admin?.role.replace("_", " ")}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsPasswordModalOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              Password Management
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <PasswordManagementModal 
        open={isPasswordModalOpen} 
        onOpenChange={setIsPasswordModalOpen} 
      />

      <NotificationsSheet
        open={isNotificationsSheetOpen}
        onOpenChange={setIsNotificationsSheetOpen}
      />
    </header>
  )
}
