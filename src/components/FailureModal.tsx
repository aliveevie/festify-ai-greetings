import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface FailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
}

const FailureModal = ({ isOpen, onClose, reason }: FailureModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Transaction Failed
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {reason || "The transaction could not be completed. Please try again or check your wallet for more details."}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button onClick={onClose} className="w-full bg-red-500 hover:bg-red-600 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FailureModal; 