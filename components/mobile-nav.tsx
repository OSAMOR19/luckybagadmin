"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Gamepad2, ChevronRight } from "lucide-react"
import { navigationSections } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 flex flex-col bg-white">
        <SheetHeader className="p-0 text-left border-b border-gray-200">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent px-6 py-8">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                  <Gamepad2 className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <SheetTitle className="text-2xl font-bold text-white tracking-tight">LuckyBag</SheetTitle>
                  <p className="text-xs text-white/80 font-medium">Admin Portal</p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-accent/30 blur-xl" />
          </div>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {navigationSections.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{section.title}</h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-primary",
                      )}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary" />
                      )}

                      {/* Icon with colored background */}
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                          isActive ? `${item.color} shadow-md` : "bg-gray-100 group-hover:bg-gray-200",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            isActive ? "text-white" : "text-gray-600 group-hover:text-primary",
                          )}
                        />
                      </div>

                      <span className="flex-1">{item.name}</span>

                      {/* Badge */}
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "h-6 px-2 text-xs font-semibold",
                            isActive ? "bg-primary text-white" : "bg-gray-200 text-gray-700",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}

                      {/* Chevron on hover */}
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-all duration-200",
                          isActive
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                        )}
                      />
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
