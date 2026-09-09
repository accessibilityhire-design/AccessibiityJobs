import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-[color:var(--ink)]/60 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Primary action on light surfaces
        default:
          "bg-[var(--ink)] text-[var(--paper)] hover:bg-[color-mix(in_oklab,var(--ink)_92%,white)] ",
        // Compatibility alias for the brand action
        lime:
          "bg-[var(--brand)] text-white font-semibold hover:bg-[#193f68]",
        // ink = explicit alias for default
        ink:
          "bg-[var(--ink)] text-[var(--paper)] hover:bg-[color-mix(in_oklab,var(--ink)_92%,white)]",
        // inverse = paper-on-ink (for use inside dark sections)
        inverse:
          "bg-[var(--paper)] text-[var(--ink)] hover:bg-white",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30",
        outline:
          "border border-[color:var(--border)] bg-transparent text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--ink)_5%,transparent)] hover:border-[var(--ink)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--ink)_6%,transparent)]",
        link: "text-[var(--ink)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-md px-7 text-[0.95rem] has-[>svg]:px-6",
        xl: "h-14 rounded-md px-9 text-base has-[>svg]:px-7",
        pill: "h-10 rounded-full px-6",
        icon: "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
