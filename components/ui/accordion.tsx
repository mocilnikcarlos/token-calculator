"use client"
import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { CaretDown } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const Accordion=AccordionPrimitive.Root
function AccordionItem({className,...props}:React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b border-border",className)} {...props}/>
}
function AccordionTrigger({className,children,...props}:React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return <AccordionPrimitive.Header className="flex"><AccordionPrimitive.Trigger className={cn("group flex flex-1 items-center justify-between py-5 text-left text-base font-medium outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-ring",className)} {...props}>{children}<CaretDown size={20} className="shrink-0 transition-transform group-data-[state=open]:rotate-180"/></AccordionPrimitive.Trigger></AccordionPrimitive.Header>
}
function AccordionContent({className,children,...props}:React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" {...props}><div className={cn("pb-6",className)}>{children}</div></AccordionPrimitive.Content>
}
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
