import type { UserRole } from "@/types"

export type Permission =
  | "view_dashboard"
  | "view_users"
  | "manage_users"
  | "view_games"
  | "manage_games"
  | "view_transactions"
  | "manage_transactions"
  | "view_admins"
  | "manage_admins"
  | "view_settings"
  | "manage_settings"

export const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    "view_dashboard",
    "view_users",
    "manage_users",
    "view_games",
    "manage_games",
    "view_transactions",
    "manage_transactions",
    "view_admins",
    "manage_admins",
    "view_settings",
    "manage_settings",
  ],
  game_manager: ["view_dashboard", "view_users", "view_games", "manage_games", "view_transactions"],
  user_manager: ["view_dashboard", "view_users", "manage_users", "view_transactions"],
  finance_admin: ["view_dashboard", "view_users", "view_transactions", "manage_transactions"],
  support_admin: ["view_dashboard", "view_users", "view_games", "view_transactions"],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function canAccessRoute(role: UserRole, route: string): boolean {
  const routePermissions: Record<string, Permission> = {
    "/dashboard": "view_dashboard",
    "/users": "view_users",
    "/games": "view_games",
    "/transactions": "view_transactions",
    "/admins": "view_admins",
    "/settings": "view_settings",
  }

  const requiredPermission = routePermissions[route]
  if (!requiredPermission) return true

  return hasPermission(role, requiredPermission)
}
