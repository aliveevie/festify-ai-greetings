import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Share2, Eye, Twitter, MessageCircle, Copy, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  greetingData: any;
  txHash?: string | null;
  txStatus?: 'pending' | 'confirmed' | 'failed' | null;
  selectedDesign?: string;
}

const SuccessModal = ({ isOpen, onClose, greetingData, txHash, txStatus, selectedDesign }: SuccessModalProps) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareOptionsRef = useRef<HTMLDivElement>(null);

  // Close share options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }
    };

    if (showShareOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareOptions]);

  // Design options mapping (same as in GreetingPreview)
  const designOptions = {
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

  const handleViewGreeting = () => {
    // Navigate to My Greetings section
    navigate("/#my-greetings");
    onClose();
  };

  const handleCopyHash = async () => {
    if (txHash) {
      await navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleShareGreeting = async () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareToX = () => {
    const message = greetingData?.message || "Wishing you joy and happiness!";
    const text = `🎉 Just created a beautiful AI-powered greeting with Festify!\n\n${message}\n\n✨ Create your own at: https://festify-ai.vercel.app/`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShowShareOptions(false);
  };

  const shareToTelegram = () => {
    const message = greetingData?.message || "Wishing you joy and happiness!";
    const text = `🎉 Just created a beautiful AI-powered greeting with Festify!\n\n${message}\n\n✨ Create your own at: https://festify-ai.vercel.app/`;
    const url = `https://t.me/share/url?url=${encodeURIComponent('https://festify-ai.vercel.app/')}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShowShareOptions(false);
  };

  const shareToHyperionForum = () => {
    const message = greetingData?.message || "Wishing you joy and happiness!";
    const text = `🎉 Just created a beautiful AI-powered greeting with Festify!\n\n${message}\n\n✨ Create your own at: https://festify-ai.vercel.app/`;
    const url = `https://forum.ceg.vote/invites/SzmGCxb8bs`;
    // For forum sharing, we'll open the forum and copy text to clipboard
    window.open(url, '_blank');
    navigator.clipboard.writeText(text);
    toast.success("Text copied! Paste it in the Hyperion forum.");
    setShowShareOptions(false);
  };

  const copyToClipboard = async () => {
    const message = greetingData?.message || "Wishing you joy and happiness!";
    const shareText = `🎉 Just created a beautiful AI-powered greeting with Festify!\n\n${message}\n\n✨ Create your own at: https://festify-ai.vercel.app/`;
    await navigator.clipboard.writeText(shareText);
    toast.success("Greeting copied to clipboard!");
    setShowShareOptions(false);
  };

  const handleDownload = () => {
    // Create a canvas element to generate the greeting image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;
    
    // Get the selected design or default to festive-gold
    const designId = selectedDesign || 'festive-gold';
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            NFT Greeting Created Successfully!
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            <div className="mb-2">Your AI-powered greeting has been minted as an NFT. 🎉</div>
            {txStatus === 'pending' && (
              <div className="mb-2 text-yellow-600 font-semibold">Transaction Pending Confirmation...</div>
            )}
            {txStatus === 'confirmed' && (
              <div className="mb-2 text-green-700 font-semibold">Transaction Confirmed!</div>
            )}
            {txStatus === 'failed' && (
              <div className="mb-2 text-red-600 font-semibold">Transaction Failed! Please check the explorer for details.</div>
            )}
            {txHash && (
              <div className="mt-4 text-xs text-gray-500 break-all flex flex-col items-center gap-2">
                <span className="font-semibold text-gray-700">Transaction Hash:</span>
                <a
                  href={`https://hyperion-testnet-explorer.metisdevops.link/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-festify-green underline break-all"
                >
                  {txHash}
                </a>
                <button
                  onClick={handleCopyHash}
                  className="mt-1 px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 border border-gray-300"
                >
                  {copied ? "Copied!" : "Copy Hash"}
                </button>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 space-y-3">
          <Button 
            onClick={handleViewGreeting}
            className="w-full bg-festify-green hover:bg-festify-apple-green text-white"
          >
            <Eye className="w-4 h-4 mr-2" />
            View My Greetings
          </Button>
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-festify-lemon-green to-festify-green text-white"
          >
            Create Another Greeting
          </Button>
          <div className="space-y-3">
            {/* Share Button with Dropdown */}
            <div className="relative" ref={shareOptionsRef}>
              <Button 
                onClick={handleShareGreeting}
                variant="outline"
                className="w-full border-festify-green text-festify-green hover:bg-festify-green hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showShareOptions ? 'rotate-180' : ''}`} />
              </Button>
              
              {showShareOptions && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2 space-y-1">
                    <div className="text-xs font-semibold text-gray-500 px-2 py-1 border-b border-gray-100">
                      Share your greeting:
                    </div>
                    <button
                      onClick={shareToX}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Twitter className="w-4 h-4 mr-2 text-blue-500" />
                      Share on X (Twitter)
                    </button>
                    <button
                      onClick={shareToTelegram}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2 text-blue-400" />
                      Share on Telegram
                    </button>
                    <button
                      onClick={shareToHyperionForum}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2 text-purple-500" />
                      Share on Hyperion Forum
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Copy className="w-4 h-4 mr-2 text-gray-500" />
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleDownload}
              variant="outline"
              className="w-full border-festify-light-blue text-festify-light-blue hover:bg-festify-light-blue hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PNG
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
