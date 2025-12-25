import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMyGreetingsClick = () => {
    // Navigate to home page first, then scroll to my-greetings section
    navigate("/");
    setIsMobileMenuOpen(false);
    
    // Use a timeout to ensure navigation completes before scrolling
    setTimeout(() => {
      const element = document.getElementById('my-greetings');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleFeaturesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById('features');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCreateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById('create');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/lovable-uploads/18200935-aecd-4213-bace-df22330f57e2.png" 
              alt="Festify Logo" 
              className="w-8 h-8 flex-shrink-0"
            />
            <h1 className="text-xl sm:text-2xl font-bold festive-text">Festify</h1>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <button 
              onClick={handleFeaturesClick}
              className="text-gray-700 hover:text-festify-green transition-colors whitespace-nowrap"
            >
              Features
            </button>
            <button 
              onClick={handleCreateClick}
              className="text-gray-700 hover:text-festify-green transition-colors whitespace-nowrap"
            >
              Create
            </button>
            <button 
              onClick={() => {
                navigate("/dat");
                handleNavClick();
              }}
              className="text-gray-700 hover:text-festify-green transition-colors whitespace-nowrap"
            >
              Mint DAT
            </button>
            <button 
              onClick={handleMyGreetingsClick}
              className="text-gray-700 hover:text-festify-green transition-colors whitespace-nowrap"
            >
              My Greetings
            </button>
          </nav>

          {/* Desktop Connect Button */}
          <div className="hidden lg:block">
            <ConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-festify-green transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={handleFeaturesClick}
                className="text-left text-gray-700 hover:text-festify-green transition-colors"
              >
                Features
              </button>
              <button 
                onClick={handleCreateClick}
                className="text-left text-gray-700 hover:text-festify-green transition-colors"
              >
                Create
              </button>
              <button 
                onClick={() => {
                  navigate("/dat");
                  handleNavClick();
                }}
                className="text-left text-gray-700 hover:text-festify-green transition-colors"
              >
                Mint DAT
              </button>
              <button 
                onClick={handleMyGreetingsClick}
                className="text-left text-gray-700 hover:text-festify-green transition-colors"
              >
                My Greetings
              </button>
              <div className="pt-2">
                <ConnectButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
