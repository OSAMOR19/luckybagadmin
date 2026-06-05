"use client"

import { useAuth } from "@/lib/auth-context"
import { hasPermission, type Permission } from "@/lib/rbac"
import type { ReactNode } from "react"

interface PermissionGuardProps {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { user } = useAuth()

  if (!user || !hasPermission(user.role, permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
