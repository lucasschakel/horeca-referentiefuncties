interface ThinkingAnimationProps {
  thinkingText: string;
}

const ThinkingAnimation: React.FC<ThinkingAnimationProps> = ({ thinkingText }) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start max-w-[70%]">
        <div className="w-6 h-6 mr-2 rounded-full overflow-hidden flex-shrink-0">
          <svg viewBox="0 0 12 12" className="w-full h-full">
            <image href="/Soigne-e.svg" width="12" height="12" />
          </svg>
        </div>
        <div className="mx-2 p-3 rounded-2xl bg-[#E7E1DE] animate-pulse">
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
  );
};

export default ThinkingAnimation;