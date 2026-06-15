import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <Card className={cn("overflow-hidden border-primary/10 shadow-sm transition-all duration-300 hover:shadow-md", className)}>
      <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
        <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
        {description && <CardDescription className="text-sm mt-1">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-6 pt-8">
        {children}
      </CardContent>
    </Card>
  )
}
