import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Allow all routes for demo purposes
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
