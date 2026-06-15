"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { mockActivityFeed } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"
import { Bell } from "lucide-react"

interface NotificationsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  // We duplicate the mock data slightly to simulate a longer history of "all" notifications
  const extendedFeed = [
    ...mockActivityFeed,
    ...mockActivityFeed.map(act => ({
      ...act,
      id: `${act.id}-past`,
      timestamp: new Date(new Date(act.timestamp).getTime() - 86400000 * 3).toISOString() // 3 days older
    }))
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto bg-slate-50 border-l border-slate-200">
        <SheetHeader className="pb-6 mb-6 border-b border-slate-200/60 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-slate-900 leading-tight">
                All Notifications
              </SheetTitle>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                Activity and system alerts history
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-4 pb-10">
          {extendedFeed.map((activity) => (
            <div key={activity.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2 gap-4">
                <span className="text-sm font-bold text-slate-900 leading-tight">{activity.title}</span>
                <span className="text-[10px] font-medium text-slate-500 shrink-0 mt-0.5">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {activity.description}
              </p>
              <div className="mt-4">
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 capitalize text-[10px] px-2 py-0.5">
                  {activity.type.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
