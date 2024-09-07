import React from 'react'
import { InputWithButton } from '@/components/ui/InputWithButton'

interface FooterProps {
  inputRef: React.RefObject<HTMLInputElement>
  inputMessage: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSendMessage: () => void
  placeholderText: string
  poweredByText: string
}

const Footer: React.FC<FooterProps> = ({
  inputRef,
  inputMessage,
  onInputChange,
  onSendMessage,
  placeholderText,
  poweredByText,
}) => {
  return (
    <footer className="sticky bottom-0 z-10 bg-white pb-3 pt-0 shadow-md">
      <div className="mx-auto flex max-w-2xl flex-col space-y-3 px-4">
        <InputWithButton
          ref={inputRef}
          value={inputMessage}
          onChange={onInputChange}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
          onButtonClick={onSendMessage}
          placeholder={placeholderText}
        />
        <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
          <a
            href="https://soigne.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 transition-opacity hover:opacity-80"
          >
            <span>{poweredByText}</span>
            <svg
              width="55"
              height="18"
              viewBox="0 0 55 18"
              className="inline-block"
            >
              <image href="/soigne.svg" width="55" height="18" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
