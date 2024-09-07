import React from 'react'
import { Input, InputProps } from '@/components/ui/Input'
import { SendButton } from '@/components/ui/SendButton'

interface InputWithButtonProps extends Omit<InputProps, 'button'> {
  onButtonClick: () => void
}

const InputWithButton = React.forwardRef<
  HTMLInputElement,
  InputWithButtonProps
>(({ className, onButtonClick, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      className={className}
      button={
        <SendButton
          type="button"
          onMouseDown={onButtonClick}
          className="rounded-l-none"
        />
      }
      {...props}
    />
  )
})

InputWithButton.displayName = 'InputWithButton'

export { InputWithButton }
