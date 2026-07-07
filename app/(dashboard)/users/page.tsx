"use client"

import Image from "next/image"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, CheckCircle, Clock, User, Wallet, MoreVertical, Gamepad2, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserProfileSheet } from "@/components/user-profile-sheet"
import { WalletAdjustmentModal } from "@/components/wallet-adjustment-modal"
import { User as UserType } from "@/types"
import { usersApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [selectedWalletUser, setSelectedWalletUser] = useState<UserType | null>(null)
  const { toast } = useToast()

  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      setDebugInfo(null)
      
      // Let it throw if it fails so we can catch it
      const usersRes = await usersApi.fetchUsers() as any;
      let balancesRes = null;
      
      try {
        balancesRes = await usersApi.fetchAllBalances() as any;
      } catch (e) {
        console.warn("Failed to fetch balances, continuing without them", e);
      }
      
      const rawData = usersRes?.data;
      let usersArray: any[] = [];
      
      console.log("----- API RESPONSE DEBUG -----");
      console.log("Raw usersRes:", usersRes);
      console.log("Raw balancesRes:", balancesRes);
      
      if (Array.isArray(rawData)) {
        usersArray = rawData;
      } else if (rawData?.user_details) {
        usersArray = Array.isArray(rawData.user_details) ? rawData.user_details : [rawData.user_details];
      } else if (rawData?.users) {
        usersArray = Array.isArray(rawData.users) ? rawData.users : [rawData.users];
      } else if (rawData && typeof rawData === 'object') {
        // If it's a single object without a wrapper array
        usersArray = [rawData];
      }

      console.log("Extracted usersArray:", usersArray);
      console.log("------------------------------");

      if (usersArray.length === 0) {
        setDebugInfo(`Raw API Response: ${JSON.stringify(usersRes, null, 2)}`);
      }
      
      const balancesData = balancesRes?.data?.balances?.["wallet Balance"] || []
      const balanceMap = new Map<string, number>()
      balancesData.forEach((b: any) => {
        balanceMap.set(b.username, b.wallet_balance)
      })
      
      const mappedUsers = usersArray.map((u: any) => {
        // Try extracting username from email to match balance username
        const username = u.email ? u.email.split('@')[0] : ""
        return {
          id: u.uid || String(u.id || Math.random()),
          name: u.fullname || u.name || "Unknown",
          email: u.email || "",
          phone: u.phone_number || u.phone || "",
          balance: balanceMap.get(username) || 0,
          kycStatus: "verified" as const,
          emailVerified: u.email_verified || u.emailVerified || false,
          smsVerified: u.sms_otp_verified || u.smsVerified || false,
          isActive: u.is_verified || u.isActive || false,
          createdAt: u.createdAt || new Date().toISOString()
        }
      })
      
      setUsers(mappedUsers)
    } catch (error: any) {
      console.error("Failed to load users", error)
      setDebugInfo(`API Error: ${error?.message || 'Unknown error'}`);
      toast({
        title: "Error fetching users",
        description: error?.message || "Failed to load users. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [toast])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatCurrency = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
    }).format(amount)
    
    return (
      <span className="inline-flex items-center">
        <Image src="/naira1.png" alt="₦" width={18} height={18} className="mr-[2px] object-contain" />
        {formattedAmount}
      </span>
    )
  }

  const formatUID = (id: string) => {
    return id.startsWith("LBG-") ? id : id.replace("user_", "LBG-")
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center space-x-4 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 border-r border-slate-300 pr-4 py-1">
          User Directory
        </h1>
        {/* <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by UID, name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200"
          />
        </div> */}
        <div className="text-sm text-slate-500 font-medium">
          <span className="text-slate-900 font-semibold">{filteredUsers.length}</span> users
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium text-slate-500">S/N</TableHead>
              <TableHead className="font-medium text-slate-500">Full Name</TableHead>
              <TableHead className="font-medium text-slate-500">Email</TableHead>
              <TableHead className="font-medium text-slate-500">Phone Number</TableHead>
              <TableHead className="font-medium text-slate-500">Verification Status</TableHead>
              <TableHead className="font-medium text-slate-500">Balance</TableHead>
              <TableHead className="font-medium text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <TableRow key={user.id} className="group hover:bg-slate-50/50">
                  <TableCell>
                    <span className="text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-slate-900">{user.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{user.email}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{user.phone}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.emailVerified ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 rounded-md font-medium text-xs px-2 py-0.5">
                          <CheckCircle className="mr-1.5 h-3 w-3" />
                          Email Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 rounded-md font-medium text-xs px-2 py-0.5">
                          <Clock className="mr-1.5 h-3 w-3" />
                          Email Unverified
                        </Badge>
                      )}
                      
                      {user.smsVerified ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 rounded-md font-medium text-xs px-2 py-0.5">
                          <CheckCircle className="mr-1.5 h-3 w-3" />
                          SMS Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 rounded-md font-medium text-xs px-2 py-0.5">
                          <Clock className="mr-1.5 h-3 w-3" />
                          SMS Unverified
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-slate-900">{formatCurrency(user.balance)}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4 text-slate-500" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => setSelectedUser(user)}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => setSelectedWalletUser(user)}>
                          <Wallet className="mr-2 h-4 w-4" />
                          <span>Wallet</span>
                        </DropdownMenuItem>
                        <Link href={`/users/${user.id}/games`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Gamepad2 className="mr-2 h-4 w-4" />
                            <span>Games</span>
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {debugInfo && (
          <div className="p-4 bg-red-50 border-t border-red-100 text-sm overflow-auto text-red-800">
            <strong>Debug Info (API Response/Error):</strong>
            <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">{debugInfo}</pre>
          </div>
        )}

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredUsers.length}</span> of <span className="font-semibold text-slate-700">{users.length}</span> registered users
          </p>
        </div>
      </div>

      <UserProfileSheet 
        user={selectedUser} 
        open={!!selectedUser} 
        onOpenChange={(open) => !open && setSelectedUser(null)} 
        onModifyBalance={() => {
          setSelectedWalletUser(selectedUser)
          setSelectedUser(null)
        }}
      />

      <WalletAdjustmentModal
        user={selectedWalletUser}
        open={!!selectedWalletUser}
        onOpenChange={(open) => !open && setSelectedWalletUser(null)}
        onSuccess={loadUsers}
      />
    </div>
  )
}
