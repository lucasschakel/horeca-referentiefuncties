import { InputWithButton } from "@/components/ui/InputWithButton"

interface FooterProps {
  inputMessage: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  placeholderText: string;
  poweredByText: string;
}

const Footer: React.FC<FooterProps> = ({ 
  inputMessage, 
  onInputChange, 
  onSendMessage, 
  placeholderText, 
  poweredByText 
}) => {
  return (
    <footer className="bg-white shadow-md pb-3 pt-0 sticky bottom-0 z-10">
      <div className="max-w-2xl mx-auto px-4 flex flex-col space-y-3">
        <InputWithButton
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
            className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
          >
            <span>{poweredByText}</span>
            <svg width="55" height="18" viewBox="0 0 55 18" className="inline-block">
              <image href="/soigne.svg" width="55" height="18" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;