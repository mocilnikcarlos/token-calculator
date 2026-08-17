import * as React from "react"
import { cn } from "@/lib/utils"

function Input({className,type,...props}:React.ComponentProps<"input">) {
  return <input type={type} className={cn("flex h-12 w-full rounded-md border border-input bg-background px-4 text-base text-foreground shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:opacity-50",className)} {...props}/>
}
export { Input }
