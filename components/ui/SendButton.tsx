import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sendButtonVariants = cva(
  "inline-flex items-center justify-center rounded-r-lg text-sm ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90",
  {
    variants: {
      size: {
        default: "h-12 w-12",
        sm: "h-9 w-9",
        lg: "h-11 w-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface SendButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sendButtonVariants> {}

const SendButton = React.forwardRef<HTMLButtonElement, SendButtonProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <button
        className={cn(sendButtonVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19V5"/>
          <path d="m5 12 7-7 7 7"/>
        </svg>
      </button>
    )
  }
)
SendButton.displayName = "SendButton"

export { SendButton, sendButtonVariants }