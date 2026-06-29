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

  if (!response.ok) {
    throw new ApiError(response.status, data.message || "An error occurred")
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

  changePassword: (oldPassword: string, newPassword: string) =>
    fetchApi<{ status: string; message: string }>("/admin/change-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
    }),

  forgotPassword: (email: string) =>
    fetchApi<{ status: string; message: string }>("/admin/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
}

// Games APIs
export const gamesApi = {
  fetchGames: () => fetchApi<{ status: string; message: string; data: any[] | { games: any[] }; next: string | null }>("/admin/games"),
  createGame: (data: any) => fetchApi("/create-games", { method: "POST", body: JSON.stringify(data) }),
  startGame: (gameId: string) => fetchApi("/start-game", { method: "POST", body: JSON.stringify({ gameId }) }),
  stopGame: (gameId: string) => fetchApi("/admin/games/stop", { method: "POST", body: JSON.stringify({ game_id: gameId }) }),
  getDraws: (gameId: string) => fetchApi(`/get-draws?gameId=${gameId}`),
  getResults: (gameId: string) => fetchApi(`/admin/games/results/${gameId}`),
}

// Users APIs
export const usersApi = {
  fetchUsers: () => fetchApi<any>("/admin/users"),
  fetchAllBalances: () => fetchApi<any>("/admin/balances"),
  fetchUserBalances: (userId: string) => fetchApi(`/admin/users-balances?userId=${userId}`),
  creditUser: (userId: string, amount: number, otp: string) =>
    fetchApi("/admin/credit", { method: "POST", body: JSON.stringify({ userId, amount, otp }) }),
  debitUser: (userId: string, amount: number, otp: string) =>
    fetchApi("/admin/debit", { method: "POST", body: JSON.stringify({ userId, amount, otp }) }),
}

// Admins APIs
export const adminsApi = {
  fetchAllAdmins: () => fetchApi<any>("/admin/all"),
  createAdmin: (data: any) => fetchApi<any>("/admin/create", { method: "POST", body: JSON.stringify(data) }),
  activateAdmin: (adminId: string) => fetchApi<any>(`/admin/activate/${adminId}`, { method: "PUT" }),
  deactivateAdmin: (adminId: string) => fetchApi<any>(`/admin/deactivate/${adminId}`, { method: "PUT" }),
}
