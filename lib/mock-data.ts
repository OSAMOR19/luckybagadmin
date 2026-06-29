import { Admin, User, Game, Transaction, DashboardMetrics, Activity } from "@/types"

export const mockDashboardMetrics: DashboardMetrics = {
  totalUsers: 15420,
  activeUsers: 8250,
  totalRevenue: 245000,
  pendingWithdrawals: 12450,
  activeGames: 5,
}

export const mockChartData = {
  gameParticipation: [
    { date: "Mon", participants: 1200, newUsers: 150 },
    { date: "Tue", participants: 1350, newUsers: 180 },
    { date: "Wed", participants: 1100, newUsers: 120 },
    { date: "Thu", participants: 1500, newUsers: 200 },
    { date: "Fri", participants: 1800, newUsers: 250 },
    { date: "Sat", participants: 2200, newUsers: 300 },
    { date: "Sun", participants: 2000, newUsers: 280 },
  ],
  transactions: [
    { date: "Mon", amount: 15000, withdrawals: 5000 },
    { date: "Tue", amount: 18000, withdrawals: 6000 },
    { date: "Wed", amount: 12000, withdrawals: 4500 },
    { date: "Thu", amount: 22000, withdrawals: 8000 },
    { date: "Fri", amount: 25000, withdrawals: 9000 },
    { date: "Sat", amount: 35000, withdrawals: 12000 },
    { date: "Sun", amount: 30000, withdrawals: 10000 },
  ]
}

export const mockActivityFeed: Activity[] = [
  { id: "act_1", type: "user_registered", title: "New User Registration", description: "John Doe created an account", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: "act_2", type: "wallet_credited", title: "Wallet Credited", description: "Jane Smith added ₦500", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: "act_3", type: "game_scheduled", title: "Game Scheduled", description: "Weekend Mega Draw created", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: "act_4", type: "withdrawal_processed", title: "Withdrawal Processed", description: "Bob Wilson withdrew ₦200", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
]

export const mockGames: Game[] = [
  { id: "game_1", title: "Daily Draw", description: "Daily chance to win", startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), endTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), prizePool: 1000, status: "upcoming", participants: 500, interval: "Daily", winPercentage: 10, maxWinners: 50 },
  { id: "game_2", title: "Weekend Mega", description: "Huge prizes for weekend", startTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), endTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), prizePool: 5000, status: "live", participants: 2500, interval: "Weekly", winPercentage: 5, maxWinners: 100 },
  { id: "game_3", title: "Monthly Grand", description: "Our biggest monthly draw", startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), prizePool: 25000, status: "completed", participants: 10000, interval: "Monthly", winPercentage: 2, maxWinners: 10 },
  { id: "game_4", title: "Flash Draw", description: "Quick 1 hour draw", startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), endTime: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(), prizePool: 500, status: "upcoming", participants: 100, interval: "Hourly", winPercentage: 20, maxWinners: 20 },
]

export const mockUsers: User[] = [
  { id: "user_1", name: "John Doe", email: "john@example.com", phone: "+1234567890", balance: 1500, kycStatus: "verified", emailVerified: true, smsVerified: true, isActive: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() },
  { id: "user_2", name: "Jane Smith", email: "jane@example.com", phone: "+1987654321", balance: 50, kycStatus: "pending", emailVerified: true, smsVerified: false, isActive: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString() },
  { id: "user_3", name: "Bob Wilson", email: "bob@example.com", phone: "+1555666777", balance: 0, kycStatus: "rejected", emailVerified: false, smsVerified: false, isActive: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
]

export const mockAdmins: Admin[] = [
  { id: "admin_1", name: "Alice Admin", email: "alice@luckybag.com", role: "super_admin", isActive: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(), lastLogin: new Date().toISOString() },
  { id: "admin_2", name: "Charlie Manager", email: "charlie@luckybag.com", role: "game_manager", isActive: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(), lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: "admin_3", name: "Diana Support", email: "diana@luckybag.com", role: "support_admin", isActive: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString() },
]

export const mockAllTransactions: Transaction[] = [
  { id: "txn_1", userId: "user_1", userName: "John Doe", amount: 500, type: "credit", status: "completed", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), description: "Deposit via Card" },
  { id: "txn_2", userId: "user_1", userName: "John Doe", amount: 50, type: "debit", status: "completed", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), description: "Ticket Purchase" },
  { id: "txn_3", userId: "user_2", userName: "Jane Smith", amount: 100, type: "credit", status: "pending", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), description: "Deposit via Bank Transfer" },
  { id: "txn_4", userId: "user_3", userName: "Bob Wilson", amount: 200, type: "debit", status: "failed", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), description: "Withdrawal Request" },
]

export const mockRecentActivity: Transaction[] = mockAllTransactions;
