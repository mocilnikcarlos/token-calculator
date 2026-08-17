"use client"
import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { CaretDown, Check } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const Select=SelectPrimitive.Root
const SelectValue=SelectPrimitive.Value
function SelectTrigger({className,children,...props}:React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return <SelectPrimitive.Trigger className={cn("flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-4 text-base text-foreground shadow-xs outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20",className)} {...props}>{children}<SelectPrimitive.Icon asChild><CaretDown size={18}/></SelectPrimitive.Icon></SelectPrimitive.Trigger>
}
function SelectContent({className,children,position="popper",...props}:React.ComponentProps<typeof SelectPrimitive.Content>) {
  return <SelectPrimitive.Portal><SelectPrimitive.Content position={position} className={cn("z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md",className)} {...props}><SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>
}
function SelectItem({className,children,...props}:React.ComponentProps<typeof SelectPrimitive.Item>) {
  return <SelectPrimitive.Item className={cn("relative flex cursor-default select-none items-center rounded-sm py-2.5 pe-9 ps-3 text-base outline-none focus:bg-accent",className)} {...props}><span className="absolute end-3 flex size-4 items-center justify-center"><SelectPrimitive.ItemIndicator><Check size={16} weight="bold"/></SelectPrimitive.ItemIndicator></span><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText></SelectPrimitive.Item>
}
export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem }
