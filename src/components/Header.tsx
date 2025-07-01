
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = async () => {
    // Placeholder for wallet connection logic
    console.log("Connecting wallet...");
    setIsWalletConnected(true);
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
          <a href="#community" className="text-gray-700 hover:text-festify-green transition-colors">Community</a>
        </nav>

        <Button 
          onClick={connectWallet}
          className={`${
            isWalletConnected 
              ? 'bg-festify-green hover:bg-festify-apple-green' 
              : 'bg-gradient-to-r from-festify-lemon-green to-festify-green hover:from-festify-green hover:to-festify-apple-green'
          } text-white transition-all duration-300`}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isWalletConnected ? 'Connected' : 'Connect Wallet'}
        </Button>
      </div>
    </header>
  );
};

export default Header;
