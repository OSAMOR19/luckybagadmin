// API helper functions for backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rubbyprospect.billyronks.xyz/api"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`

  console.log(`[API CALL] Fetching: ${url}`);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })

  const data = await response.json().catch(() => ({}));

  console.log(`[API RESPONSE] for ${url}:`, data);

  if (!response.ok) {
    let errorMessage = data.message || data.description || `Request failed with status ${response.status}`;
    if (data.errors) {
      errorMessage = typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors);
    } else if (data.error) {
      errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
    }
    throw new ApiError(response.status, errorMessage);
  }

  return data
}

// Auth APIs
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<{ status: string; message: string; data: { token: string; user_details?: any; admin_details?: any } }>(
      "/admin/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    ),

  changePassword: async (data: { current_password: string; new_password: string; confirm_password: string }) => {
    console.log("[changePassword] Request payload:", data);
    const response = await fetchApi<{ status: string; message: string; data: null; next: null }>("/admin/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log("[changePassword] Response:", response);
    return response;
  },

  forgotPassword: (email: string) =>
    fetchApi<{ status: string; message: string; data: any; next: null }>("/admin/request-reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (data: { token: string; new_password: string; confirm_password: string }) =>
    fetchApi<{ status: string; message: string; data: null; next: null }>("/admin/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${data.token}` },
    }),
  logout: () =>
    fetchApi<{ status: string; message: string; data: null }>("/auth/logout", {
      method: "POST",
    }),
}

// Games APIs
export const gamesApi = {
  fetchGames: (page: number = 1, limit: number = 10) => fetchApi<{ status: string; message: string; data: any[] | { games: any[] }; next: string | null }>(`/admin/games?page=${page}&limit=${limit}`),
  getUpcomingRaffles: () => fetchApi<{ status: string; message: string; data: { games: any[] } }>("/games/upcoming"),
  createGame: async (data: any) => {
    console.log("[createGame] Request payload:", data);
    const response = await fetchApi<{ status: string; message: string; data: { game: { message: string; game_id: string } }; next: null }>("https://rubbyprospect.billyronks.xyz/api/admin/games", { method: "POST", body: JSON.stringify(data) });
    console.log("[createGame] Response:", response);
    return response;
  },
  startGame: (gameId: string) => fetchApi("/start-game", { method: "POST", body: JSON.stringify({ gameId }) }),
  stopGame: (gameId: string) => fetchApi("/admin/games/stop", { method: "POST", body: JSON.stringify({ game_id: gameId }) }),
  getDraws: (gameId: string) => fetchApi(`/get-draws?gameId=${gameId}`),
  getResults: (gameId: string) => fetchApi(`/admin/games/results/${gameId}`),
  fetchGameParticipants: (gameId: string, page: number = 1) => fetchApi<any>(`/admin/games/participants/${gameId}?page=${page}`),
}

// Users APIs
export const usersApi = {
  fetchUsers: (page: number = 1, limit: number = 10) => fetchApi<any>(`/admin/users?page=${page}&limit=${limit}`),
  fetchAllBalances: () => fetchApi<any>("/admin/balances"),
  fetchUserBalances: (userId: string) => fetchApi(`/admin/users-balances?userId=${userId}`),
  fetchWalletHistory: (page: number = 1) => fetchApi<any>(`/admin/wallet/history?page=${page}`),
  fetchSingleUserWalletHistory: (userId: string, page: number = 1, limit: number = 10) => fetchApi<any>(`/admin/user/${userId}/wallet/history?page=${page}&limit=${limit}`),
  fetchWalletMetric: (type: "pending" | "credit" | "debit") => fetchApi<{ status: string; message: string; data: { amount: number }; next: null }>(`/admin/wallet/metric?type=${type}`),
  creditUser: (userId: string, amount: number) =>
    fetchApi("/admin/credit", { method: "POST", body: JSON.stringify({ user_id: userId, amount }) }),
  debitUser: (userId: string, amount: number) =>
    fetchApi("/admin/debit", { method: "POST", body: JSON.stringify({ user_id: userId, amount }) }),
  fetchUserTickets: (userId: string, page: number = 1) => fetchApi<any>(`/admin/users/${userId}/tickets?page=${page}`),
}

// Admins APIs
export const adminsApi = {
  fetchAllAdmins: () => fetchApi<any>("/admin/all"),
  createAdmin: (data: any) => fetchApi<any>("/admin/create", { method: "POST", body: JSON.stringify(data) }),
  activateAdmin: (adminId: string) => fetchApi<any>(`/admin/activate/${adminId}`, { method: "PUT" }),
  deactivateAdmin: (adminId: string) => fetchApi<any>(`/admin/deactivate/${adminId}`, { method: "PUT" }),
}

// Dashboard APIs
export const dashboardApi = {
  fetchMetric: (type: "revenue" | "total-users" | "games" | "active-users" | "pending-withdrawals") => 
    fetchApi<any>(`/admin/dashboard/metrics?type=${type}`),
  fetchGameParticipationChart: () => 
    fetchApi<any>("/admin/dashboard/analytics/game-participation"),
  fetchTransactionVolumeChart: () => 
    fetchApi<any>("/admin/dashboard/analytics/transaction-volume"),
}
