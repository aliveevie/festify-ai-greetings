import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Sparkles, Send, ArrowRight, Gem } from "lucide-react";
import AIResponseDisplay from "./AIResponseDisplay";
import GreetingPreview from "./GreetingPreview";
import SuccessModal from "./SuccessModal";
import FailureModal from "./FailureModal";
import { useAccount } from 'wagmi';
import { useWriteContract, useReadContract } from 'wagmi';
import { toast } from "sonner";
import { useEffect } from "react";
import FestivalGreetingsArtifact from "../../artifacts/FestivalGreetings.json";
import { pinataService } from "@/lib/pinata";
import { storageService, UserGreeting } from "@/lib/storage";

const CONTRACT_ADDRESS = "0xD9BF55E8bC7642AE6931A94ac361559C2F34298e";
const CONTRACT_ABI = FestivalGreetingsArtifact.abi;

const HYPERION_CHAIN_ID = 133717;

const AIGreetingCreator = () => {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [greetingData, setGreetingData] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [failureReason, setFailureReason] = useState<string>("");
  const [txStatus, setTxStatus] = useState<'pending' | 'confirmed' | 'failed' | null>(null);
  // TODO: Add FailureModal for error display
  const [recipient, setRecipient] = useState("");
  const [minting, setMinting] = useState(false);
  const [mintError, setMintError] = useState("");
  const [selectedDesign, setSelectedDesign] = useState("festive-gold");
  const [currentGreetingId, setCurrentGreetingId] = useState<string | null>(null);

  const { address, isConnected } = useAccount();

  // Helper function to generate greeting title from AI response
  const generateGreetingTitle = (greetingData: any): string => {
    if (greetingData?.title) return greetingData.title;
    if (greetingData?.festival) return `${greetingData.festival} Greeting`;
    return `Festival Greeting ${new Date().getFullYear()}`;
  };

  // Helper function to extract festival type from greeting data
  const extractFestivalType = (greetingData: any): string => {
    if (greetingData?.festival) return greetingData.festival;
    if (greetingData?.occasion) return greetingData.occasion;
    return "Festival";
  };

  // Write contract for minting
  const { writeContractAsync } = useWriteContract();

  const handleGenerateGreeting = async () => {
    // Check if wallet is connected first
    if (!isConnected) {
      toast.error("Please connect your wallet first to create a greeting.");
      return;
    }
    
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setStep(2);
    setAiResponse(`🤖 Analyzing your request: "${prompt}"
\nI'm crafting a personalized festival greeting...`);
    setGreetingData(null);
    try {
      const API_BASE_URL = 
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:3001'
          : 'https://festify-server-iwil.onrender.com';
      const res = await fetch(`${API_BASE_URL}/api/generate-greeting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error from API");
      setAiResponse("AI greeting generated successfully!");
      setGreetingData(data.result);
      setStep(3);
    } catch (error: any) {
      setAiResponse(
        "❌ There was an error generating your greeting. Please try again.\n" +
          (error?.message || error?.toString())
      );
      setIsGenerating(false);
      return;
    }
    setIsGenerating(false);
  };

  const handleMintNFT = async () => {
    setMintError("");
    setTxHash(null);
    setTxStatus(null);
    if (!isConnected) {
      setMintError("Please connect your wallet.");
      toast.error("Please connect your wallet.");
      return;
    }
    if (!recipient || !/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      setMintError("Please enter a valid recipient address.");
      toast.error("Please enter a valid recipient address.");
      return;
    }
    if (!greetingData) {
      setMintError("No greeting data to mint.");
      toast.error("No greeting data to mint.");
      return;
    }
    
    // Add selected design to the greeting data
    const enhancedGreetingData = {
      ...greetingData,
      selectedDesign: selectedDesign
    };
    setMinting(true);
    setStep(4);
    
    // Generate unique ID for this greeting
    const greetingId = `greeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentGreetingId(greetingId);
    
    try {
      // Upload the greeting image to Pinata
      console.log('[MintNFT] Starting Pinata upload...');
      
      // Generate and upload the greeting image with selected design
      const imageUrl = await pinataService.generateAndUploadGreetingImage(
        greetingData,
        selectedDesign
      );
      
      console.log('[MintNFT] Image uploaded to Pinata:', imageUrl);
      
      // Create and upload metadata with the image URL
      const metadataURI = await pinataService.createAndUploadMetadata(
        greetingData,
        selectedDesign,
        imageUrl
      );
      
      console.log('[MintNFT] Metadata uploaded to Pinata:', metadataURI);
      
      console.log('[MintNFT] Attempting to mint:', { recipient, metadataURI, address });
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "mint",
        args: [recipient, metadataURI],
        chainId: HYPERION_CHAIN_ID,
        account: address,
        chain: undefined
      });
      if (typeof tx === 'string') {
        setTxHash(tx);
        setTxStatus('pending');
        setShowSuccessModal(true);
        
        // Save greeting to storage with pending status
        const newGreeting: UserGreeting = {
          id: greetingId,
          title: generateGreetingTitle(greetingData),
          message: greetingData?.message || greetingData?.greeting || "AI-generated festival greeting",
          recipient: recipient,
          date: new Date().toISOString().split('T')[0],
          type: extractFestivalType(greetingData),
          status: 'pending',
          txHash: tx,
          metadataURI: metadataURI,
          imageUrl: imageUrl,
          selectedDesign: selectedDesign,
          userAddress: address!,
          greetingData: greetingData
        };
        
        storageService.saveGreeting(newGreeting);
        console.log('[MintNFT] Greeting saved to storage:', newGreeting);
        
        (async () => {
          let confirmed = false;
          let errorMsg = "";
          for (let i = 0; i < 30; i++) {
            try {
              const receipt = await (window as any).ethereum.request({
                method: 'eth_getTransactionReceipt',
                params: [tx],
              });
              console.log('[MintNFT] Receipt poll:', receipt);
              if (receipt && receipt.status === '0x1') {
                confirmed = true;
                break;
              } else if (receipt && receipt.status === '0x0') {
                errorMsg = 'Transaction failed on-chain.';
                console.log('[MintNFT] Transaction failed on-chain:', receipt);
                break;
              }
            } catch (e: any) {
              console.log('[MintNFT] Error polling for receipt:', e);
              errorMsg = e?.message || e?.toString();
              break;
            }
            await new Promise(res => setTimeout(res, 2000));
          }
          if (confirmed) {
            setTxStatus('confirmed');
            // Update greeting status to sent
            storageService.updateGreetingStatus(greetingId, 'sent', tx);
            console.log('[MintNFT] Greeting status updated to sent');
            setStep(1);
            setPrompt("");
            setGreetingData(null);
            setRecipient("");
            setSelectedDesign("festive-gold");
            setCurrentGreetingId(null);
            toast.success("NFT minted successfully!");
          } else if (errorMsg) {
            setTxStatus('failed');
            // Update greeting status to failed
            storageService.updateGreetingStatus(greetingId, 'failed', tx);
            console.log('[MintNFT] Greeting status updated to failed');
            setFailureReason(errorMsg || "Transaction was not confirmed in time.");
            setShowFailureModal(true);
            setStep(3);
          }
          setMinting(false);
        })();
        return;
      } else {
        console.log('[MintNFT] No transaction hash returned:', tx);
        setFailureReason("No transaction hash returned.");
        setShowFailureModal(true);
        setStep(3);
      }
    } catch (error: any) {
      console.log('[MintNFT] Error in minting try/catch:', error);
      setMintError(error?.message || error?.toString());
      toast.error(error?.message || error?.toString());
      setFailureReason(error?.message || error?.toString());
      setShowFailureModal(true);
      setStep(3);
    }
    setMinting(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="festive-text">Create AI-Powered Greeting</span>
        </h1>
        <p className="text-gray-600 text-lg">Let AI help you craft the perfect festival greeting</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= stepNum ? 'bg-festify-green text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 4 && (
                <ArrowRight className={`w-6 h-6 mx-4 ${step > stepNum ? 'text-festify-green' : 'text-gray-300'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Input Prompt */}
        {step === 1 && (
          <Card className="glass-effect border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Brain className="w-8 h-8 mr-3 text-festify-lemon-green" />
                Describe Your Greeting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isConnected && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Wallet Not Connected
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Please connect your wallet to create and mint AI-powered greetings.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Tell our AI agent what kind of greeting you want to create:</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Create a Diwali greeting for my grandmother who lives in Mumbai. She loves traditional sweets and always lights diyas. Make it warm and personal with golden colors and include blessings for health and happiness."
                  className="min-h-32"
                  disabled={!isConnected}
                />
              </div>
              <Button 
                onClick={handleGenerateGreeting}
                disabled={!isConnected || !prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-festify-lemon-green to-festify-green hover:from-festify-green hover:to-festify-apple-green text-white py-3 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {!isConnected ? "Connect Wallet First" : "Generate with AI"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: AI Processing */}
        {step === 2 && (
          <AIResponseDisplay 
            isGenerating={isGenerating}
            response={aiResponse}
          />
        )}

        {/* Step 3: Preview & Customize */}
        {step === 3 && greetingData && (
          <div className="space-y-6">
            <GreetingPreview 
              greetingData={greetingData} 
              selectedDesign={selectedDesign}
              onDesignChange={setSelectedDesign}
            />
            <div className="flex flex-col gap-4 items-center">
              <div className="w-full max-w-md">
                <label className="block text-sm font-medium mb-2">Recipient Wallet Address</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-festify-green"
                  disabled={minting}
                />
              </div>
              {mintError && <div className="text-red-500 text-sm mb-2">{mintError}</div>}
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setStep(1);
                    setSelectedDesign("festive-gold");
                  }}
                  className="px-6 py-3"
                  disabled={minting}
                >
                  Regenerate
                </Button>
                <Button 
                  onClick={handleMintNFT}
                  className="bg-gradient-to-r from-festify-lemon-green to-festify-green hover:from-festify-green hover:to-festify-apple-green text-white px-8 py-3"
                  disabled={minting}
                >
                  <Gem className="w-5 h-5 mr-2" />
                  {minting ? "Minting..." : "Mint as NFT"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Minting Complete */}
        {step === 4 && (
          <Card className="glass-effect border-none shadow-lg text-center">
            <CardContent className="py-12">
              <div className="animate-bounce mb-6">
                <Gem className="w-16 h-16 mx-auto text-festify-lemon-green" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Minting Your NFT...</h3>
              <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto mb-4">
                <div className="h-full bg-gradient-to-r from-festify-lemon-green to-festify-green rounded-full animate-pulse" style={{width: '75%'}}></div>
              </div>
              <p className="text-gray-600">Creating your unique AI-powered greeting NFT...</p>
            </CardContent>
          </Card>
        )}
      </div>

      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        greetingData={greetingData}
        txHash={txHash}
        txStatus={txStatus}
        selectedDesign={selectedDesign}
      />
      <FailureModal
        isOpen={showFailureModal}
        onClose={() => setShowFailureModal(false)}
        reason={failureReason}
      />
    </div>
  );
};

export default AIGreetingCreator;
