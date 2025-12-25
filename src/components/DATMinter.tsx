import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Upload, CheckCircle, Loader2, AlertCircle, FileText } from "lucide-react";
import { useAccount } from 'wagmi';
import { toast } from "sonner";
import { DATClient, DATMintingProgress, DATMintingResult } from "@/lib/dat-client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DATMinter = () => {
  const [step, setStep] = useState(1);
  const [privacyData, setPrivacyData] = useState("");
  const [fileName, setFileName] = useState("privacy_data.txt");
  const [rewardAmount, setRewardAmount] = useState("100");
  const [isMinting, setIsMinting] = useState(false);
  const [progress, setProgress] = useState<DATMintingProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DATMintingResult | null>(null);
  const [datClient] = useState(() => new DATClient());

  const { address, isConnected } = useAccount();

  const handleMintDAT = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!privacyData.trim()) {
      toast.error("Please enter privacy data to mint");
      return;
    }

    if (!address) {
      toast.error("Wallet address not available");
      return;
    }

    setIsMinting(true);
    setError(null);
    setProgress(null);
    setStep(2);

    try {
      const amount = parseInt(rewardAmount) || 100;

      const result = await datClient.mintDAT(
        address, // Will be used for wallet-based authentication once mainnet DAT is live
        privacyData,
        fileName,
        amount,
        (progress) => {
          setProgress(progress);
          setStep(progress.step + 1);
        }
      );

      setResult(result);
      setStep(6);
      toast.success("DAT minted successfully!");
    } catch (error: any) {
      console.error('DAT minting error:', error);
      setError(error?.message || "Failed to mint DAT");
      toast.error(error?.message || "Failed to mint DAT");
      setStep(1);
    } finally {
      setIsMinting(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="festive-text">Mint Your Data Anchor Token (DAT)</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Securely contribute privacy-sensitive data and earn rewards on LazAI
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4, 5, 6].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= stepNum ? 'bg-festify-green text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 6 && (
                <div className={`w-16 h-1 mx-2 ${step > stepNum ? 'bg-festify-green' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Data Input */}
        {step === 1 && (
          <Card className="glass-effect border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <FileText className="w-8 h-8 mr-3 text-festify-lemon-green" />
                Enter Your Privacy Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isConnected && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please connect your wallet to mint DAT tokens.
                  </AlertDescription>
                </Alert>
              )}

              {isConnected && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    DAT minting will be available on LazAI Mainnet once the mainnet DAT functionality is live.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="fileName">File Name</Label>
                <Input
                  id="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="privacy_data.txt"
                  disabled={true}
                />
              </div>

              <div>
                <Label htmlFor="privacyData">Privacy Data</Label>
                <Textarea
                  id="privacyData"
                  value={privacyData}
                  onChange={(e) => setPrivacyData(e.target.value)}
                  placeholder="Enter your privacy-sensitive data here..."
                  className="min-h-32"
                  disabled={true}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Your data will be encrypted before upload. Only authorized parties can decrypt it.
                </p>
              </div>

              <div>
                <Label htmlFor="rewardAmount">Reward Amount</Label>
                <Input
                  id="rewardAmount"
                  type="number"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                  placeholder="100"
                  disabled={true}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Amount of DAT tokens to request as reward
                </p>
              </div>

              <Button
                onClick={handleMintDAT}
                disabled={true}
                className="w-full py-3 text-lg bg-gradient-to-r from-festify-lemon-green to-festify-green hover:from-festify-green hover:to-festify-apple-green text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shield className="w-5 h-5 mr-2" />
                Start DAT Minting
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2-5: Processing Steps */}
        {(step >= 2 && step <= 5) && progress && (
          <Card className="glass-effect border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                {isMinting ? (
                  <Loader2 className="w-8 h-8 mr-3 text-festify-lemon-green animate-spin" />
                ) : (
                  <Lock className="w-8 h-8 mr-3 text-festify-lemon-green" />
                )}
                {step === 2 && "Encrypting Data"}
                {step === 3 && "Uploading to IPFS"}
                {step === 4 && "Registering with LazAI"}
                {step === 5 && "Requesting Proof & Reward"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg">{progress.message}</p>
                {progress.fileId && (
                  <p className="text-sm text-gray-600">
                    File ID: {progress.fileId.toString()}
                  </p>
                )}
                {progress.jobId && (
                  <p className="text-sm text-gray-600">
                    Job ID: {progress.jobId.toString()}
                  </p>
                )}
                {progress.url && (
                  <p className="text-sm text-gray-600 break-all">
                    IPFS URL: {progress.url}
                  </p>
                )}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-festify-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Success */}
        {step === 6 && result && (
          <Card className="glass-effect border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <CheckCircle className="w-8 h-8 mr-3 text-green-500" />
                DAT Minted Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your Data Anchor Token has been minted successfully!
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div>
                  <Label>File ID</Label>
                  <p className="text-lg font-mono">{result.fileId}</p>
                </div>
                <div>
                  <Label>Job ID</Label>
                  <p className="text-lg font-mono">{result.jobId}</p>
                </div>
                <div>
                  <Label>IPFS URL</Label>
                  <p className="text-sm break-all text-gray-600">{result.url}</p>
                </div>
              </div>

              <Button
                onClick={() => {
                  setStep(1);
                  setPrivacyData("");
                  setResult(null);
                  setProgress(null);
                }}
                className="w-full bg-festify-green hover:bg-festify-apple-green text-white"
              >
                Mint Another DAT
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};


export default DATMinter;

