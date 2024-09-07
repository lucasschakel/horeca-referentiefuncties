import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  button?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, button, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-lg border border-input bg-background px-4 text-[16px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            "focus:outline-none focus:ring-0",
            button ? "pr-12" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {button && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            {button}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }