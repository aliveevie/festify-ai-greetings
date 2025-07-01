
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Share2, Eye } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  greetingData: any;
}

const SuccessModal = ({ isOpen, onClose, greetingData }: SuccessModalProps) => {
  const handleViewGreeting = () => {
    // Navigate to view the greeting
    console.log("Viewing greeting:", greetingData);
  };

  const handleShareGreeting = () => {
    // Share functionality
    console.log("Sharing greeting:", greetingData);
  };

  const handleDownload = () => {
    // Download functionality
    console.log("Downloading greeting:", greetingData);
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
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 space-y-3">
          <Button 
            onClick={handleViewGreeting}
            className="w-full bg-festify-green hover:bg-festify-apple-green text-white"
          >
            <Eye className="w-4 h-4 mr-2" />
            View My Greeting
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
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
