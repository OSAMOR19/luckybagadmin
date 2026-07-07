// // API helper functions for DEV backend integration
// const DEV_API_BASE_URL = "https://rubbyprospect.billyronks.xyz/api"
// 
// export class DevApiError extends Error {
//   constructor(
//     public status: number,
//     message: string,
//   ) {
//     super(message)
//     this.name = "DevApiError"
//   }
// }
// 
// async function fetchDevApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
//   const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
// 
//   const url = endpoint.startsWith("http") ? endpoint : `${DEV_API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
// 
//   console.log(`[API CALL] Fetching: ${url}`);
// 
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options?.headers,
//     },
//   })
// 
//   const data = await response.json().catch(() => ({}));
// 
//   if (!response.ok) {
//     let errorMessage = data.message || `Request failed with status ${response.status}`;
//     if (data.errors) {
//       errorMessage = typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors);
//     } else if (data.error) {
//       errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
//     }
//     throw new DevApiError(response.status, errorMessage);
//   }
// 
//   return data
// }
// 
// export const devAuthApi = {
//   logout: () =>
//     fetchDevApi<{ status: string; message: string; data: null }>("/auth/logout", {
//       method: "POST",
//     }),
// }
// 
// export const devGamesApi = {
//   getUpcomingRaffles: () => fetchDevApi<{ status: string; message: string; data: { games: any[] } }>("/games/upcoming"),
// }
// 
// export const devSettingsApi = {
//   changePassword: async (data: { current_password: string; new_password: string; confirm_password: string }) => {
//     console.log("[changePassword] Request payload:", data);
//     const response = await fetchDevApi<{ status: string; message: string; data: null }>("/settings/change-password", {
//       method: "POST",
//       body: JSON.stringify(data),
//     });
//     console.log("[changePassword] Response:", response);
//     return response;
//   }
// }
