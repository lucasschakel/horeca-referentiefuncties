interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`flex items-start ${role === 'user' ? 'flex-row-reverse max-w-[70%] py-6' : ''}`}>
        {role === 'assistant' && (
          <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
            <svg viewBox="0 0 12 12" className="w-full h-full">
              <image href="/Soigne-e.svg" width="12" height="12" />
            </svg>
          </div>
        )}
        <div className={`rounded-3xl text-[16px] ${role === 'user' ? 'bg-primary text-primary-foreground px-5 py-2.5' : 'pl-4 pt-0.5'}`}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;