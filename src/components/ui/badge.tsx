import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        
        // Estados de validación
        validado:
          "border-emerald-300 bg-emerald-100 text-emerald-800 [a&]:hover:bg-emerald-200 dark:border-emerald-700/50 dark:bg-emerald-900/60 dark:text-emerald-300",
        pendiente:
          "border-amber-300 bg-amber-100 text-amber-800 [a&]:hover:bg-amber-200 dark:border-amber-700/50 dark:bg-amber-900/60 dark:text-amber-300",
        rechazado:
          "border-rose-300 bg-rose-100 text-rose-800 [a&]:hover:bg-rose-200 dark:border-rose-700/50 dark:bg-rose-900/60 dark:text-rose-300",
        
        // Tipos de inscripción
        presencial:
          "border-blue-300 bg-blue-100 text-blue-800 [a&]:hover:bg-blue-200 dark:border-blue-700/50 dark:bg-blue-900/60 dark:text-blue-300",
        formulario:
          "border-rose-300 bg-rose-100 text-rose-800 [a&]:hover:bg-rose-200 dark:border-rose-700/50 dark:bg-rose-900/60 dark:text-rose-300",
        
        // Información general
        info:
          "border-sky-300 bg-sky-100 text-sky-800 [a&]:hover:bg-sky-200 dark:border-sky-700/50 dark:bg-sky-900/60 dark:text-sky-300",
        warning:
          "border-yellow-300 bg-yellow-100 text-yellow-800 [a&]:hover:bg-yellow-200 dark:border-yellow-700/50 dark:bg-yellow-900/60 dark:text-yellow-300",
        
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
