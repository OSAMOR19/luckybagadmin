"use client"

import Image from "next/image"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Filter, TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { usersApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function WalletManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasNextPage, setHasNextPage] = useState(false)
  const { toast } = useToast()

  const [totalCredits, setTotalCredits] = useState(0)
  const [totalDebits, setTotalDebits] = useState(0)
  const [pendingAmount, setPendingAmount] = useState(0)

  useEffect(() => {
    usersApi.fetchWalletMetric("credit").then(res => {
      if (res?.data?.amount !== undefined) setTotalCredits(res.data.amount)
    }).catch(console.error)
    
    usersApi.fetchWalletMetric("debit").then(res => {
      if (res?.data?.amount !== undefined) setTotalDebits(res.data.amount)
    }).catch(console.error)
    
    usersApi.fetchWalletMetric("pending").then(res => {
      if (res?.data?.amount !== undefined) setPendingAmount(res.data.amount)
    }).catch(console.error)
  }, [])

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true)
      try {
        const response = await usersApi.fetchWalletHistory(currentPage)
        if (response.status === "success") {
          const mappedData = (response.data || []).map((trx: any) => ({
            id: trx.trxId,
            userId: trx.user?.uid || "N/A",
            userName: trx.user?.name || "Unknown",
            type: trx.trxType || "credit",
            amount: trx.amount || 0,
            description: trx.description || "",
            status: trx.status?.toLowerCase() === "successful" ? "completed" : (trx.status?.toLowerCase() || "pending"),
            createdAt: trx.createdAt || new Date().toISOString()
          }))
          setTransactions(mappedData)
          setHasNextPage(response.next !== null)
        } else {
          throw new Error(response.message || "Failed to fetch history")
        }
      } catch (error: any) {
        toast({
          title: "Error fetching history",
          description: error?.message || "Please try again later.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [currentPage])

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  // Reset to first page when filters change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
  }

  const handleTypeChange = (val: string) => {
    setTypeFilter(val)
  }

  const handleStatusChange = (val: string) => {
    setStatusFilter(val)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all platform wallet transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Credits</p>
              <p className="text-2xl font-bold text-green-500">{formatCurrency(totalCredits)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Debits</p>
              <p className="text-2xl font-bold text-red-500">{formatCurrency(totalDebits)}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10">
              <TrendingDown className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingAmount}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <Filter className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by user, transaction ID..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
            <SelectItem value="debit">Debit</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
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
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <span className="font-mono text-sm">{transaction.id}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{transaction.userName}</p>
                      <p className="text-sm text-muted-foreground">{transaction.userId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === "credit" ? "default" : "secondary"}>
                      {transaction.type === "credit" ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-semibold ${transaction.type === "credit" ? "text-green-500" : "text-red-500"}`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{transaction.description}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{format(new Date(transaction.createdAt), "MMM dd, HH:mm")}</span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No transactions found on this page.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            <PaginationItem>
              <span className="px-4 text-sm font-medium">Page {currentPage}</span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext 
                onClick={() => { if (hasNextPage) setCurrentPage(p => p + 1) }}
                className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
