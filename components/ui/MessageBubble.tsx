interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
  return (
    <div
      className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`flex items-start ${role === 'user' ? 'max-w-[70%] flex-row-reverse py-6' : ''}`}
      >
        {role === 'assistant' && (
          <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full">
            <svg viewBox="0 0 12 12" className="h-full w-full">
              <image href="/Soigne-e.svg" width="12" height="12" />
            </svg>
          </div>
        )}
        <div
          className={`rounded-3xl text-[16px] leading-7 ${role === 'user' ? 'bg-primary px-5 py-2.5 text-primary-foreground' : 'pl-4 pt-0.5'}`}
        >
          {content}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
