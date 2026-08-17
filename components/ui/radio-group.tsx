"use client"
import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function RadioGroup({className,...props}:React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-3",className)} {...props}/>
}
function RadioGroupItem({className,...props}:React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return <RadioGroupPrimitive.Item className={cn("aspect-square size-5 rounded-full border border-input text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",className)} {...props}><RadioGroupPrimitive.Indicator className="flex items-center justify-center"><span className="size-2.5 rounded-full bg-current"/></RadioGroupPrimitive.Indicator></RadioGroupPrimitive.Item>
}
export { RadioGroup, RadioGroupItem }
