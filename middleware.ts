import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  const isAuthRoute = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/forgot-password" || request.nextUrl.pathname === "/reset-password"
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith("/dashboard") || 
    request.nextUrl.pathname.startsWith("/users") || 
    request.nextUrl.pathname.startsWith("/games") ||
    request.nextUrl.pathname.startsWith("/admins") ||
    request.nextUrl.pathname.startsWith("/settings") ||
    request.nextUrl.pathname.startsWith("/wallet-management")

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
