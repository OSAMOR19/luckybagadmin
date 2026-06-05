export type UserRole = "super_admin" | "game_manager" | "user_manager" | "finance_admin" | "support_admin"

export interface Admin {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  balance: number
  kycStatus: "pending" | "verified" | "rejected"
  isActive: boolean
  createdAt: string
}

export interface Game {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  prizePool: number
  status: "upcoming" | "live" | "completed"
  participants: number
}

export interface Transaction {
  id: string
  userId: string
  userName: string
  amount: number
  type: "credit" | "debit"
  status: "pending" | "completed" | "failed"
  createdAt: string
  description?: string
}

export interface DashboardMetrics {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  pendingWithdrawals: number
  activeGames: number
}
