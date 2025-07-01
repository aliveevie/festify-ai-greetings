
import { Heart, Twitter, Github, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/18200935-aecd-4213-bace-df22330f57e2.png" 
                alt="Festify Logo" 
                className="w-8 h-8"
              />
              <h3 className="text-2xl font-bold">Festify</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Revolutionizing digital celebrations with AI-powered festival greetings. 
              Create lasting connections through interactive NFT experiences.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#features" className="hover:text-festify-lemon-green transition-colors">Features</a></li>
              <li><a href="#create" className="hover:text-festify-lemon-green transition-colors">Create</a></li>
              <li><a href="#community" className="hover:text-festify-lemon-green transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-festify-lemon-green transition-colors">Marketplace</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-festify-green transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-festify-green transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-festify-green transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-300 flex items-center justify-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-400" /> for digital celebrations
          </p>
          <p className="text-gray-400 text-sm mt-2">
            © 2024 Festify. All rights reserved. Built on Celo & Optimism networks.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
