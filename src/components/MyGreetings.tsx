
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, Share2, Eye, Download, ExternalLink, Trash2, RefreshCw } from "lucide-react";
import { storageService, UserGreeting } from "@/lib/storage";
import { useAccount } from 'wagmi';
import { toast } from "sonner";

const MyGreetings = () => {
  const { address, isConnected } = useAccount();
  const [greetings, setGreetings] = useState<UserGreeting[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user greetings from storage
  useEffect(() => {
    if (isConnected && address) {
      loadGreetings();
    } else {
      setGreetings([]);
      setLoading(false);
    }
  }, [address, isConnected]);

  const loadGreetings = () => {
    if (!address) return;
    
    try {
      setLoading(true);
      const userGreetings = storageService.getUserGreetings(address);
      // Sort by date (newest first)
      const sortedGreetings = userGreetings.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setGreetings(sortedGreetings);
    } catch (error) {
      console.error('Error loading greetings:', error);
      toast.error('Failed to load greetings');
    } finally {
      setLoading(false);
    }
  };

  // Get emoji for festival type
  const getFestivalEmoji = (type: string): string => {
    const emojiMap: { [key: string]: string } = {
      'Diwali': '🪔',
      'Christmas': '🎄',
      'New Year': '🎊',
      'Holi': '🌈',
      'Eid': '🌙',
      'Dussehra': '🏹',
      'Ganesh Chaturthi': '🐘',
      'Navratri': '💃',
      'Karva Chauth': '🌕',
      'Raksha Bandhan': '🎗️',
      'Valentine': '💝',
      'Birthday': '🎂',
      'Anniversary': '💍',
      'Graduation': '🎓'
    };
    return emojiMap[type] || '🎉';
  };

  const handleShare = async (greeting: UserGreeting) => {
    const shareText = `🎉 Just created a beautiful AI-powered greeting with Festify!\n\n${greeting.message}\n\n✨ Create your own at: https://festify-ai.vercel.app/`;
    
    try {
      // Check if Web Share API is available and supported
      if (navigator.share && typeof navigator.share === 'function') {
        try {
          await navigator.share({
            title: greeting.title,
            text: shareText,
            url: 'https://festify-ai.vercel.app/'
          });
          return; // Success, exit function
        } catch (shareError) {
          console.log("Web Share API failed, falling back to clipboard:", shareError);
          // Continue to clipboard fallback
        }
      }
      
      // Fallback to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        toast.success("Greeting details copied to clipboard!");
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          toast.success("Greeting details copied to clipboard!");
        } catch (fallbackError) {
          console.error("Fallback copy failed:", fallbackError);
          toast.error("Unable to copy. Please manually copy the greeting details.");
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error("Error in handleShare:", error);
      toast.error("Failed to share greeting. Please try again.");
    }
  };

  const handleViewOnBlockchain = (greeting: UserGreeting) => {
    if (greeting.txHash) {
      // Use the same explorer URL as in SuccessModal
      const explorerUrl = `https://hyperion-testnet-explorer.metisdevops.link/tx/${greeting.txHash}`;
      window.open(explorerUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error("No transaction hash available");
    }
  };

  const handleDelete = (greeting: UserGreeting) => {
    try {
      storageService.deleteGreeting(greeting.id);
      setGreetings(prev => prev.filter(g => g.id !== greeting.id));
      toast.success("Greeting deleted successfully");
    } catch (error) {
      console.error("Error deleting greeting:", error);
      toast.error("Failed to delete greeting");
    }
  };

  const handleDownload = (greeting: UserGreeting) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      toast.error("Failed to create image. Canvas not supported.");
      return;
    }
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Design options mapping (same as in SuccessModal)
    const designOptions: { [key: string]: { gradient: string[], pattern: string } } = {
      "festive-gold": {
        gradient: ["#FCD34D", "#F97316", "#DC2626"],
        pattern: "radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)"
      },
      "cosmic-purple": {
        gradient: ["#8B5CF6", "#EC4899", "#4F46E5"],
        pattern: "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)"
      },
      "nature-green": {
        gradient: ["#4ADE80", "#10B981", "#0D9488"],
        pattern: "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)"
      },
      "sunset-orange": {
        gradient: ["#FB923C", "#DC2626", "#EC4899"],
        pattern: "radial-gradient(circle at 30% 70%, rgba(251, 146, 60, 0.3) 0%, transparent 50%)"
      },
      "ocean-blue": {
        gradient: ["#60A5FA", "#06B6D4", "#0D9488"],
        pattern: "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)"
      },
      "romantic-pink": {
        gradient: ["#F472B6", "#F43F5E", "#F87171"],
        pattern: "radial-gradient(circle at 40% 60%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)"
      },
      "spring-floral": {
        gradient: ["#F9A8D4", "#A855F7", "#6366F1"],
        pattern: "radial-gradient(circle at 60% 40%, rgba(244, 114, 182, 0.3) 0%, transparent 50%)"
      },
      "midnight-dark": {
        gradient: ["#374151", "#475569", "#312E81"],
        pattern: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)"
      },
      "electric-blue": {
        gradient: ["#3B82F6", "#06B6D4", "#2563EB"],
        pattern: "radial-gradient(circle at 25% 75%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)"
      },
      "royal-purple": {
        gradient: ["#7C3AED", "#8B5CF6", "#6D28D9"],
        pattern: "radial-gradient(circle at 75% 25%, rgba(147, 51, 234, 0.4) 0%, transparent 50%)"
      },
      "crystal-clear": {
        gradient: ["#67E8F9", "#BFDBFE", "#A5B4FC"],
        pattern: "radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.3) 0%, transparent 50%)"
      },
      "rainbow-dream": {
        gradient: ["#F87171", "#FCD34D", "#4ADE80", "#60A5FA", "#A855F7"],
        pattern: "radial-gradient(circle at 40% 60%, rgba(239, 68, 68, 0.2) 0%, transparent 50%)"
      },
      "cloudy-sky": {
        gradient: ["#CBD5E1", "#E2E8F0", "#DBEAFE"],
        pattern: "radial-gradient(circle at 60% 40%, rgba(148, 163, 184, 0.3) 0%, transparent 50%)"
      },
      "winter-frost": {
        gradient: ["#DBEAFE", "#E0F2FE", "#FFFFFF"],
        pattern: "radial-gradient(circle at 30% 70%, rgba(219, 234, 254, 0.4) 0%, transparent 50%)"
      },
      "gift-wrapped": {
        gradient: ["#EF4444", "#F472B6", "#F43F5E"],
        pattern: "radial-gradient(circle at 70% 30%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)"
      },
      "target-focus": {
        gradient: ["#F97316", "#DC2626", "#EC4899"],
        pattern: "radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)"
      },
      "shield-protection": {
        gradient: ["#10B981", "#14B8A6", "#06B6D4"],
        pattern: "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)"
      },
      "music-harmony": {
        gradient: ["#6366F1", "#A855F7", "#EC4899"],
        pattern: "radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)"
      },
      "golden-hour": {
        gradient: ["#F59E0B", "#FB923C", "#FCD34D"],
        pattern: "radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.3) 0%, transparent 50%)"
      }
    };
    
    // Get the selected design or default to festive-gold
    const designId = greeting.selectedDesign || 'festive-gold';
    const design = designOptions[designId] || designOptions['festive-gold'];
    
    // Create gradient background based on selected design
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    design.gradient.forEach((color, index) => {
      gradient.addColorStop(index / (design.gradient.length - 1), color);
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
    ctx.fillText(greeting.title, canvas.width / 2, 150);
    
    // Add emoji
    ctx.font = '72px Arial';
    ctx.fillText(getFestivalEmoji(greeting.type), canvas.width / 2, 250);
    
    // Add message
    ctx.font = '24px Arial';
    const words = greeting.message.split(' ');
    let line = '';
    let y = 350;
    
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
    ctx.fillText('Created with Festify AI', canvas.width / 2, canvas.height - 50);
    
    // Download the image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${greeting.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Greeting downloaded successfully!");
      } else {
        toast.error("Failed to generate image for download.");
      }
    }, 'image/png');
  };

  const getStatusColor = (status: UserGreeting['status']) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: UserGreeting['status']) => {
    switch (status) {
      case 'sent': return 'Sent';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  };

  if (!isConnected) {
    return (
      <section id="my-greetings" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="festive-text">My Greetings</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              View and manage all your AI-powered NFT greetings in one place
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="glass-effect border-none shadow-lg text-center py-12">
              <CardContent>
                <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-bold mb-2 text-gray-600">Connect Your Wallet</h3>
                <p className="text-gray-500 mb-6">Please connect your wallet to view your greetings</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="my-greetings" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            <span className="festive-text">My Greetings</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View and manage all your AI-powered NFT greetings in one place
          </p>
          <div className="flex justify-center mt-6">
            <Button
              onClick={loadGreetings}
              variant="outline"
              className="border-festify-green text-festify-green hover:bg-festify-green hover:text-white"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <Card className="glass-effect border-none shadow-lg text-center py-12">
              <CardContent>
                <RefreshCw className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-spin" />
                <h3 className="text-2xl font-bold mb-2 text-gray-600">Loading Greetings...</h3>
                <p className="text-gray-500">Please wait while we fetch your greetings</p>
              </CardContent>
            </Card>
          ) : greetings.length === 0 ? (
            <Card className="glass-effect border-none shadow-lg text-center py-12">
              <CardContent>
                <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-bold mb-2 text-gray-600">No Greetings Yet</h3>
                <p className="text-gray-500 mb-6">Create your first AI-powered greeting to get started</p>
                <Button 
                  className="bg-gradient-to-r from-festify-lemon-green to-festify-green hover:from-festify-green hover:to-festify-apple-green text-white"
                  onClick={() => window.location.href = '/create'}
                >
                  Create Your First Greeting
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {greetings.map((greeting) => (
                <Card key={greeting.id} className="glass-effect border-none shadow-lg hover:transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-4xl">{getFestivalEmoji(greeting.type)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(greeting.status)}`}>
                        {getStatusText(greeting.status)}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{greeting.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(greeting.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        To: {greeting.recipient.slice(0, 6)}...{greeting.recipient.slice(-4)}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {greeting.message}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {greeting.txHash && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                          onClick={() => handleViewOnBlockchain(greeting)}
                          title="View on blockchain"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-festify-light-blue text-festify-light-blue hover:bg-festify-light-blue hover:text-white"
                        onClick={() => handleShare(greeting)}
                        title="Share greeting"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
                        onClick={() => handleDownload(greeting)}
                        title="Download as image"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleDelete(greeting)}
                        title="Delete greeting"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyGreetings;
