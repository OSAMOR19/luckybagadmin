// API helper functions for backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, await response.text())
  }

  return response.json()
}

// Auth APIs
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<{ token: string; admin: any }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  changePassword: (oldPassword: string, newPassword: string) =>
    fetchApi("/change-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
}

// Games APIs
export const gamesApi = {
  fetchGames: () => fetchApi<any[]>("/fetch-games"),
  createGame: (data: any) => fetchApi("/create-games", { method: "POST", body: JSON.stringify(data) }),
  startGame: (gameId: string) => fetchApi("/start-game", { method: "POST", body: JSON.stringify({ gameId }) }),
  stopGame: (gameId: string) => fetchApi("/stop-game", { method: "POST", body: JSON.stringify({ gameId }) }),
  getDraws: (gameId: string) => fetchApi(`/get-draws?gameId=${gameId}`),
  getResults: (gameId: string) => fetchApi(`/get-results?gameId=${gameId}`),
}

// Users APIs
export const usersApi = {
  fetchUsers: () => fetchApi<any[]>("/fetch-users"),
  fetchUserBalances: (userId: string) => fetchApi(`/fetch-users-balances?userId=${userId}`),
  creditUser: (userId: string, amount: number, otp: string) =>
    fetchApi("/credit-user", { method: "POST", body: JSON.stringify({ userId, amount, otp }) }),
  debitUser: (userId: string, amount: number, otp: string) =>
    fetchApi("/debit-user", { method: "POST", body: JSON.stringify({ userId, amount, otp }) }),
}

// Admins APIs
export const adminsApi = {
  fetchAllAdmins: () => fetchApi<any[]>("/fetch-all-admin"),
  createAdmin: (data: any) => fetchApi("/create-admin", { method: "POST", body: JSON.stringify(data) }),
  activateAdmin: (adminId: string) => fetchApi("/activate-admin", { method: "PUT", body: JSON.stringify({ adminId }) }),
  deactivateAdmin: (adminId: string) =>
    fetchApi("/deactivate-admin", { method: "PUT", body: JSON.stringify({ adminId }) }),
}
