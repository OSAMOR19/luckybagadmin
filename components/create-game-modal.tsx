"use client"

import type React from "react"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CalendarIcon, Check } from "lucide-react"

interface CreateGameModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateGameModal({ open, onOpenChange, onSuccess }: CreateGameModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    title: "",
    prizePool: "",
    interval: "24h",
    winningPercentage: 10,
    maxWinners: 1,
    drawDateTime: "",
    weightedDistribution: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        className: "bg-emerald-50 border-emerald-200 text-emerald-800 px-4 py-3 shadow-md",
        title: (
          <div className="flex items-center gap-3 text-sm font-medium">
            <div className="flex items-center justify-center rounded-full bg-emerald-600 w-5 h-5 shrink-0">
              <Check className="h-3 w-3 text-white stroke-[3]" />
            </div>
            Game created and scheduled successfully
          </div>
        ),
      })

      onSuccess()
      onOpenChange(false)
      setFormData({
        title: "",
        prizePool: "",
        interval: "24h",
        winningPercentage: 10,
        maxWinners: 1,
        drawDateTime: "",
        weightedDistribution: false,
      })
    } catch (error) {
      toast({
        title: "Failed to create game",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto w-full p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Create New Game</SheetTitle>
          <SheetDescription>Configure game parameters and schedule</SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="flex-1 p-6 space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="title">Game Name <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="e.g. Summer Jackpot 2026"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prizePool">Prize Amount (USD) <span className="text-red-500">*</span></Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="prizePool"
                  type="number"
                  placeholder="0.00"
                  className="pl-7"
                  value={formData.prizePool}
                  onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interval">Draw Interval</Label>
              <Select 
                value={formData.interval} 
                onValueChange={(value) => setFormData({ ...formData, interval: value })}
              >
                <SelectTrigger id="interval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12h</SelectItem>
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="48h">48h</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Winning % <span className="text-blue-600 font-medium">({formData.winningPercentage}%)</span></Label>
                </div>
                <Slider
                  value={[formData.winningPercentage]}
                  onValueChange={(vals) => setFormData({ ...formData, winningPercentage: vals[0] })}
                  max={100}
                  step={1}
                  className="[&_[data-slot=slider-range]]:bg-blue-600 [&_[data-slot=slider-thumb]]:border-blue-600 [&_[data-slot=slider-thumb]]:bg-blue-600"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Max Winners <span className="text-blue-600 font-medium">({formData.maxWinners})</span></Label>
                </div>
                <Slider
                  value={[formData.maxWinners]}
                  onValueChange={(vals) => setFormData({ ...formData, maxWinners: vals[0] })}
                  max={100}
                  step={1}
                  className="[&_[data-slot=slider-range]]:bg-blue-600 [&_[data-slot=slider-thumb]]:border-blue-600 [&_[data-slot=slider-thumb]]:bg-blue-600"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="drawDateTime">Draw Date & Time <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="drawDateTime"
                  type="datetime-local"
                  placeholder="dd/mm/yyyy --:--"
                  value={formData.drawDateTime}
                  onChange={(e) => setFormData({ ...formData, drawDateTime: e.target.value })}
                  required
                  className="pr-10"
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Weighted Distribution</Label>
                <p className="text-sm text-muted-foreground">Weight entries by ticket purchase amount</p>
              </div>
              <Switch
                checked={formData.weightedDistribution}
                onCheckedChange={(checked) => setFormData({ ...formData, weightedDistribution: checked })}
              />
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced" className="border-none">
                <AccordionTrigger className="bg-slate-50 dark:bg-slate-900 rounded-lg px-4 hover:no-underline">
                  Advanced Settings
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-4">
                  <div className="text-sm text-muted-foreground">Additional advanced configuration options...</div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
          </div>
          
          <SheetFooter className="px-6 py-4 border-t mt-auto flex-row justify-end gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Game"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
