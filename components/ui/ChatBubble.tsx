import React from 'react'

interface ChatBubbleProps {
  role: 'user' | 'assistant' | 'thinking'
  content: string
  thinkingText?: string
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  content,
  thinkingText,
}) => {
  const isUser = role === 'user'
  const isThinking = role === 'thinking'

  return (
    <div
      className={`flex w-full justify-start py-[18px] ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } items-start`}
    >
      {!isUser && (
        <div className="mr-2 h-7 w-7 flex-shrink-0 overflow-hidden rounded-full">
          <svg viewBox="0 0 12 12" className="h-full w-full">
            <image href="/Soigne-e.svg" width="12" height="12" />
          </svg>
        </div>
      )}
      <div
        className={`overflow-hidden break-words text-[16px] leading-7 ${
          isUser
            ? 'max-w-[70%] rounded-3xl bg-primary px-5 py-2.5 text-primary-foreground'
            : isThinking
              ? 'animate-pulse pl-1'
              : 'max-w-[95%] pl-1'
        }`}
      >
        {isThinking ? (
          <span>
            {thinkingText}
            <span className="pl-0.5">
              <span className="thinking-dot">.</span>
              <span className="thinking-dot">.</span>
              <span className="thinking-dot">.</span>
            </span>
          </span>
        ) : (
          content
        )}
      </div>
    </div>
  )
}

export default ChatBubble
