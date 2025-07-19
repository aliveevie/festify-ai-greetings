
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Eye, Palette, MessageCircle, Star, Heart, Sun, Moon, Flower, Leaf } from "lucide-react";

interface GreetingData {
  title: string;
  message: string;
  design: string;
  interactive: string;
  cultural: string;
}

interface GreetingPreviewProps {
  greetingData: GreetingData;
  selectedDesign?: string;
  onDesignChange?: (designId: string) => void;
}

interface DesignOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  gradient: string;
  pattern: string;
  accentColor: string;
  description: string;
}

const designOptions: DesignOption[] = [
  {
    id: "festive-gold",
    name: "Festive Gold",
    icon: <Star className="w-6 h-6" />,
    gradient: "from-yellow-400 via-orange-500 to-red-500",
    pattern: "radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)",
    accentColor: "text-yellow-300",
    description: "Elegant golden theme with festive sparkles"
  },
  {
    id: "cosmic-purple",
    name: "Cosmic Purple",
    icon: <Moon className="w-6 h-6" />,
    gradient: "from-purple-500 via-pink-500 to-indigo-600",
    pattern: "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
    accentColor: "text-purple-300",
    description: "Mystical cosmic theme with starlight effects"
  },
  {
    id: "nature-green",
    name: "Nature Green",
    icon: <Leaf className="w-6 h-6" />,
    gradient: "from-green-400 via-emerald-500 to-teal-600",
    pattern: "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)",
    accentColor: "text-green-300",
    description: "Fresh nature-inspired design with organic elements"
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    icon: <Sun className="w-6 h-6" />,
    gradient: "from-orange-400 via-red-500 to-pink-500",
    pattern: "radial-gradient(circle at 30% 70%, rgba(251, 146, 60, 0.3) 0%, transparent 50%)",
    accentColor: "text-orange-300",
    description: "Warm sunset colors with golden hour glow"
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-blue-400 via-cyan-500 to-teal-600",
    pattern: "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
    accentColor: "text-blue-300",
    description: "Calming ocean waves with aquatic elements"
  },
  {
    id: "romantic-pink",
    name: "Romantic Pink",
    icon: <Heart className="w-6 h-6" />,
    gradient: "from-pink-400 via-rose-500 to-red-400",
    pattern: "radial-gradient(circle at 40% 60%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
    accentColor: "text-pink-300",
    description: "Romantic pink theme with love-inspired elements"
  },
  {
    id: "spring-floral",
    name: "Spring Floral",
    icon: <Flower className="w-6 h-6" />,
    gradient: "from-pink-300 via-purple-400 to-indigo-500",
    pattern: "radial-gradient(circle at 60% 40%, rgba(244, 114, 182, 0.3) 0%, transparent 50%)",
    accentColor: "text-pink-200",
    description: "Fresh spring flowers with blooming patterns"
  },
  {
    id: "midnight-dark",
    name: "Midnight Dark",
    icon: <Moon className="w-6 h-6" />,
    gradient: "from-gray-800 via-slate-700 to-indigo-900",
    pattern: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)",
    accentColor: "text-indigo-300",
    description: "Elegant dark theme with subtle highlights"
  }
];

const GreetingPreview = ({ greetingData, selectedDesign: propSelectedDesign, onDesignChange }: GreetingPreviewProps) => {
  const [internalSelectedDesign, setInternalSelectedDesign] = useState<DesignOption>(designOptions[0]);
  
  // Use prop if provided, otherwise use internal state
  const selectedDesign = propSelectedDesign 
    ? designOptions.find(d => d.id === propSelectedDesign) || designOptions[0]
    : internalSelectedDesign;
    
  const handleDesignChange = (design: DesignOption) => {
    if (onDesignChange) {
      onDesignChange(design.id);
    } else {
      setInternalSelectedDesign(design);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Visual Preview */}
      <Card className="glass-effect border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Eye className="w-6 h-6 mr-2 text-festify-lemon-orange" />
            Visual Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className={`aspect-square bg-gradient-to-br ${selectedDesign.gradient} rounded-xl p-8 text-white relative overflow-hidden`}
            style={{
              backgroundImage: `${selectedDesign.pattern}, linear-gradient(to bottom right, var(--tw-gradient-stops))`
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-center">{greetingData.title}</h3>
                <div className="text-center mb-6">
                  <div className={`w-12 h-12 mx-auto mb-2 animate-pulse ${selectedDesign.accentColor}`}>
                    {selectedDesign.icon}
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center">
                <p className="text-sm leading-relaxed text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 w-full">
                  {greetingData.message}
                </p>
              </div>
              <div className="mt-4">
                <div className="flex justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-xs">
                    💫 Tap to interact
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Design Selection & Details Panel */}
      <div className="space-y-4">
        {/* Design Selection */}
        <Card className="glass-effect border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Palette className="w-5 h-5 mr-2 text-festify-light-blue" />
              Choose Design Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {designOptions.map((design) => (
                <button
                  key={design.id}
                  onClick={() => handleDesignChange(design)}
                  className={`relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    selectedDesign.id === design.id
                      ? 'border-festify-green shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-16 rounded-md bg-gradient-to-br ${design.gradient} mb-2 flex items-center justify-center`}>
                    <div className="text-white">
                      {design.icon}
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-800 truncate">{design.name}</p>
                    <p className="text-xs text-gray-500 truncate">{design.description}</p>
                  </div>
                  {selectedDesign.id === design.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-festify-green rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Greeting Details */}
        <Card className="glass-effect border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MessageCircle className="w-5 h-5 mr-2 text-festify-green" />
              Greeting Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-festify-green">Title:</h4>
                <p className="text-gray-700">{greetingData.title}</p>
              </div>
              <div>
                <h4 className="font-semibold text-festify-green">Message:</h4>
                <p className="text-gray-700 text-sm">{greetingData.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Features */}
        <Card className="glass-effect border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Sparkles className="w-5 h-5 mr-2 text-festify-light-blue" />
              Interactive Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-festify-light-blue">Interaction:</h4>
                <p className="text-gray-700 text-sm">{greetingData.interactive}</p>
              </div>
              <div>
                <h4 className="font-semibold text-festify-light-blue">Cultural Elements:</h4>
                <p className="text-gray-700 text-sm">{greetingData.cultural}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GreetingPreview;
