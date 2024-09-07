import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const exampleQuestionVariants = cva(
  "inline-flex items-center justify-start rounded-xl shadow-sm text-[15px] ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  {
    variants: {
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-2",
        lg: "px-5 py-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface ExampleQuestionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof exampleQuestionVariants> {}

const ExampleQuestion = React.forwardRef<HTMLButtonElement, ExampleQuestionProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(exampleQuestionVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
ExampleQuestion.displayName = "ExampleQuestion"

export { ExampleQuestion, exampleQuestionVariants }