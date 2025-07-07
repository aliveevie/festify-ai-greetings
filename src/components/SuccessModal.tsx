import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Share2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  greetingData: any;
  txHash?: string | null;
}

const SuccessModal = ({ isOpen, onClose, greetingData, txHash }: SuccessModalProps) => {
  const navigate = useNavigate();

  const handleViewGreeting = () => {
    // Navigate to My Greetings section
    navigate("/#my-greetings");
    onClose();
  };

  const handleShareGreeting = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: greetingData?.title || "AI-Powered Greeting",
          text: `Check out this beautiful greeting I created with Festify: ${greetingData?.message}`,
          url: window.location.origin
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `Check out this beautiful greeting I created with Festify: ${greetingData?.title}\n\n${greetingData?.message}\n\nCreate yours at ${window.location.origin}`;
        await navigator.clipboard.writeText(shareText);
        console.log("Greeting details copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing greeting:", error);
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
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FCD34D'); // Yellow
    gradient.addColorStop(0.5, '#F97316'); // Orange
    gradient.addColorStop(1, '#DC2626'); // Red
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
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
            Your AI-powered greeting has been minted as an NFT. You can now share it with your loved ones.
            {txHash && (
              <div className="mt-4 text-xs text-gray-500 break-all">
                <span>Transaction Hash: </span>
                <a
                  href={`https://hyperion-testnet-explorer.metisdevops.link/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-festify-green underline"
                >
                  {txHash}
                </a>
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
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleShareGreeting}
              variant="outline"
              className="border-festify-green text-festify-green hover:bg-festify-green hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            
            <Button 
              onClick={handleDownload}
              variant="outline"
              className="border-festify-light-blue text-festify-light-blue hover:bg-festify-light-blue hover:text-white"
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
