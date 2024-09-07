import Image from 'next/image';

interface HeaderProps {
  title: string;
  language: string;
  onLanguageChange: () => void;
  onRefresh: () => void;
  showRefresh: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, language, onLanguageChange, onRefresh, showRefresh }) => {
  return (
    <header className="bg-white py-1 sticky top-0 z-10">
      <div className="mx-auto pl-4 pr-2 flex justify-between items-center">
        <h1 className="text-lg md:text-2xl font-semibold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          {title}
        </h1>
        <div className="flex items-center space-x-2">
          {showRefresh && (
            <button 
              className="p-2.5 rounded-full hover:bg-gray-100" 
              aria-label="Refresh Chat"
              onClick={onRefresh}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
              </svg>
            </button>
          )}
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label={`Switch to ${language === 'nl' ? 'English' : 'Dutch'}`}
            onClick={onLanguageChange}
          >
            <Image 
                src={language === 'nl' ? '/flag-uk-2@2x.png' : '/flag-nl-2@2x.png'} 
                alt={language === 'nl' ? 'Switch to English' : 'Switch to Dutch'}
                width={24}
                height={18}
                className="rounded-sm"  
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;