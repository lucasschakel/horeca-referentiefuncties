interface ThinkingAnimationProps {
  thinkingText: string
}

const ThinkingAnimation: React.FC<ThinkingAnimationProps> = ({
  thinkingText,
}) => {
  return (
    <div className="mb-4 flex justify-start">
      <div className="flex max-w-[70%] items-start">
        <div className="mr-2 h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
          <svg viewBox="0 0 12 12" className="h-full w-full">
            <image href="/Soigne-e.svg" width="12" height="12" />
          </svg>
        </div>
        <div className="mx-2 animate-pulse rounded-2xl bg-[#E7E1DE] p-3">
          <span className="inline-flex items-center">
            {thinkingText}
            <span className="ml-1">
              <span className="thinking-dot">.</span>
              <span className="thinking-dot">.</span>
              <span className="thinking-dot">.</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default ThinkingAnimation
