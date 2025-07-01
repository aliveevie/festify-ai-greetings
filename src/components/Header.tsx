import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleMyGreetingsClick = () => {
    navigate("/#my-greetings");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/18200935-aecd-4213-bace-df22330f57e2.png" 
            alt="Festify Logo" 
            className="w-8 h-8"
          />
          <h1 className="text-2xl font-bold festive-text">Festify</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-festify-green transition-colors">Features</a>
          <a href="#create" className="text-gray-700 hover:text-festify-green transition-colors">Create</a>
          <button 
            onClick={handleMyGreetingsClick}
            className="text-gray-700 hover:text-festify-green transition-colors"
          >
            My Greetings
          </button>
        </nav>

        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
