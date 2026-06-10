"use client"

import { useAuthStore } from "@/store/use-auth-store"
import { hasPermission, type Permission } from "@/lib/rbac"
import type { ReactNode } from "react"

interface PermissionGuardProps {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { admin } = useAuthStore()

  if (!admin || !hasPermission(admin.role, permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
