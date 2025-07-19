
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Eye, Palette, MessageCircle, Star, Heart, Sun, Moon, Flower, Leaf, Zap, Music, Crown, Diamond, Rainbow, Cloud, Snowflake, Gift, Target, Shield, Download } from "lucide-react";

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
  },
  {
    id: "electric-blue",
    name: "Electric Blue",
    icon: <Zap className="w-6 h-6" />,
    gradient: "from-blue-500 via-cyan-400 to-blue-600",
    pattern: "radial-gradient(circle at 25% 75%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)",
    accentColor: "text-cyan-300",
    description: "Dynamic electric blue with lightning effects"
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    icon: <Crown className="w-6 h-6" />,
    gradient: "from-purple-600 via-violet-500 to-purple-700",
    pattern: "radial-gradient(circle at 75% 25%, rgba(147, 51, 234, 0.4) 0%, transparent 50%)",
    accentColor: "text-violet-300",
    description: "Regal purple with royal elegance"
  },
  {
    id: "crystal-clear",
    name: "Crystal Clear",
    icon: <Diamond className="w-6 h-6" />,
    gradient: "from-cyan-300 via-blue-200 to-indigo-300",
    pattern: "radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.3) 0%, transparent 50%)",
    accentColor: "text-cyan-200",
    description: "Crystal clear with diamond sparkles"
  },
  {
    id: "rainbow-dream",
    name: "Rainbow Dream",
    icon: <Rainbow className="w-6 h-6" />,
    gradient: "from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400",
    pattern: "radial-gradient(circle at 40% 60%, rgba(239, 68, 68, 0.2) 0%, transparent 50%)",
    accentColor: "text-yellow-300",
    description: "Vibrant rainbow colors with dreamy effects"
  },
  {
    id: "cloudy-sky",
    name: "Cloudy Sky",
    icon: <Cloud className="w-6 h-6" />,
    gradient: "from-slate-300 via-gray-200 to-blue-100",
    pattern: "radial-gradient(circle at 60% 40%, rgba(148, 163, 184, 0.3) 0%, transparent 50%)",
    accentColor: "text-slate-400",
    description: "Soft cloudy sky with gentle tones"
  },
  {
    id: "winter-frost",
    name: "Winter Frost",
    icon: <Snowflake className="w-6 h-6" />,
    gradient: "from-blue-100 via-cyan-50 to-white",
    pattern: "radial-gradient(circle at 30% 70%, rgba(219, 234, 254, 0.4) 0%, transparent 50%)",
    accentColor: "text-blue-200",
    description: "Crisp winter frost with icy sparkles"
  },
  {
    id: "gift-wrapped",
    name: "Gift Wrapped",
    icon: <Gift className="w-6 h-6" />,
    gradient: "from-red-500 via-pink-400 to-rose-500",
    pattern: "radial-gradient(circle at 70% 30%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)",
    accentColor: "text-red-300",
    description: "Festive gift-wrapped with ribbon patterns"
  },
  {
    id: "target-focus",
    name: "Target Focus",
    icon: <Target className="w-6 h-6" />,
    gradient: "from-orange-500 via-red-500 to-pink-500",
    pattern: "radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)",
    accentColor: "text-orange-300",
    description: "Focused target with concentric circles"
  },
  {
    id: "shield-protection",
    name: "Shield Protection",
    icon: <Shield className="w-6 h-6" />,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    pattern: "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)",
    accentColor: "text-emerald-300",
    description: "Protective shield with security elements"
  },
  {
    id: "music-harmony",
    name: "Music Harmony",
    icon: <Music className="w-6 h-6" />,
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    pattern: "radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)",
    accentColor: "text-indigo-300",
    description: "Musical harmony with rhythmic patterns"
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    icon: <Sun className="w-6 h-6" />,
    gradient: "from-amber-400 via-orange-400 to-yellow-500",
    pattern: "radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.3) 0%, transparent 50%)",
    accentColor: "text-amber-300",
    description: "Warm golden hour with sunset glow"
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

  const handleDownload = () => {
    // Create a canvas element to generate the greeting image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;
    
    // Create gradient background based on selected design
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const colors = selectedDesign.gradient.split(' ').filter(c => c.startsWith('from-') || c.startsWith('via-') || c.startsWith('to-'));
    
    // Convert Tailwind classes to hex colors
    const colorMap: { [key: string]: string } = {
      'from-yellow-400': '#FCD34D', 'via-orange-500': '#F97316', 'to-red-500': '#DC2626',
      'from-purple-500': '#8B5CF6', 'via-pink-500': '#EC4899', 'to-indigo-600': '#4F46E5',
      'from-green-400': '#4ADE80', 'via-emerald-500': '#10B981', 'to-teal-600': '#0D9488',
      'from-orange-400': '#FB923C', 'to-pink-500': '#EC4899',
      'from-blue-400': '#60A5FA', 'via-cyan-500': '#06B6D4',
      'from-pink-400': '#F472B6', 'via-rose-500': '#F43F5E', 'to-red-400': '#F87171',
      'from-pink-300': '#F9A8D4', 'via-purple-400': '#A855F7', 'to-indigo-500': '#6366F1',
      'from-gray-800': '#374151', 'via-slate-700': '#475569', 'to-indigo-900': '#312E81',
      'from-blue-500': '#3B82F6', 'via-cyan-400': '#06B6D4', 'to-blue-600': '#2563EB',
      'from-purple-600': '#7C3AED', 'via-violet-500': '#8B5CF6', 'to-purple-700': '#6D28D9',
      'from-cyan-300': '#67E8F9', 'via-blue-200': '#BFDBFE', 'to-indigo-300': '#A5B4FC',
      'from-red-400': '#F87171', 'via-yellow-400': '#FCD34D', 'via-green-400': '#4ADE80', 'to-purple-400': '#A855F7',
      'from-slate-300': '#CBD5E1', 'via-gray-200': '#E2E8F0', 'to-blue-100': '#DBEAFE',
      'from-blue-100': '#DBEAFE', 'via-cyan-50': '#E0F2FE', 'to-white': '#FFFFFF',
      'from-red-500': '#EF4444', 'via-pink-400': '#F472B6', 'to-rose-500': '#F43F5E',
      'from-orange-500': '#F97316', 'to-pink-500': '#EC4899',
      'from-emerald-500': '#10B981', 'via-teal-500': '#14B8A6', 'to-cyan-500': '#06B6D4',
      'from-indigo-500': '#6366F1', 'via-purple-500': '#A855F7', 'to-pink-500': '#EC4899',
      'from-amber-400': '#F59E0B', 'via-orange-400': '#FB923C', 'to-yellow-500': '#FCD34D'
    };
    
    const hexColors = colors.map(c => colorMap[c] || '#FCD34D');
    hexColors.forEach((color, index) => {
      gradient.addColorStop(index / (hexColors.length - 1), color);
    });
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(greetingData?.title || 'Happy Festival!', canvas.width / 2, 150);
    
    // Add message
    ctx.font = '24px Arial';
    const message = greetingData?.message || 'Wishing you joy and happiness!';
    const words = message.split(' ');
    let line = '';
    let y = 250;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > 600 && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);
    
    // Add footer
    ctx.font = '18px Arial';
    ctx.fillText('Created with Festify', canvas.width / 2, canvas.height - 50);
    
    // Download the image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${greetingData?.title || 'greeting'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
    
    console.log("Downloading greeting as PNG...");
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
          <div className="relative">
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
              
              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all duration-200 text-white z-20"
                title="Download as PNG"
              >
                <Download className="w-5 h-5" />
              </button>
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


      </div>
    </div>
  );
};

export default GreetingPreview;
