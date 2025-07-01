import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Palette } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <div className="animate-float mb-8">
          <img 
            src="/lovable-uploads/18200935-aecd-4213-bace-df22330f57e2.png" 
            alt="Festify Hero" 
            className="w-24 h-24 mx-auto mb-6 animate-glow"
          />
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="festive-text">AI-Powered</span>
          <br />
          Festival Greetings
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform traditional greeting cards into dynamic, AI-powered experiences. 
          Use AI agents to create personalized NFT-powered greetings that create 
          lasting connections and meaningful celebrations.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
          <Link to="/create">
            <Button className="bg-gradient-to-r from-festify-lemon-green to-festify-green hover:from-festify-green hover:to-festify-apple-green text-white px-8 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105">
              <Sparkles className="w-5 h-5 mr-2" />
              Create NFT Greeting
            </Button>
          </Link>
          <Button variant="outline" className="border-2 border-festify-green text-festify-green hover:bg-festify-green hover:text-white px-8 py-4 text-lg rounded-full transition-all duration-300">
            <Heart className="w-5 h-5 mr-2" />
            Explore Gallery
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="glass-effect p-6 rounded-2xl hover:transform hover:scale-105 transition-all duration-300">
            <Palette className="w-12 h-12 text-festify-lemon-orange mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Creation</h3>
            <p className="text-gray-600">Use AI agents to craft personalized greetings with unique cultural knowledge</p>
          </div>
          
          <div className="glass-effect p-6 rounded-2xl hover:transform hover:scale-105 transition-all duration-300">
            <Sparkles className="w-12 h-12 text-festify-light-blue mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">NFT Integration</h3>
            <p className="text-gray-600">Mint your AI-created greetings as unique, collectible NFTs</p>
          </div>
          
          <div className="glass-effect p-6 rounded-2xl hover:transform hover:scale-105 transition-all duration-300">
            <Heart className="w-12 h-12 text-festify-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Greetings</h3>
            <p className="text-gray-600">Send NFT-powered cards that create engaging, memorable experiences</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
