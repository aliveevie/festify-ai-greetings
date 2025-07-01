
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Sparkles, Send, ArrowRight, Gem } from "lucide-react";
import AIResponseDisplay from "./AIResponseDisplay";
import GreetingPreview from "./GreetingPreview";

const AIGreetingCreator = () => {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [greetingData, setGreetingData] = useState(null);

  const handleGenerateGreeting = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setStep(2);

    // Simulate AI processing
    setTimeout(() => {
      const simulatedResponse = generateAIResponse(prompt);
      setAiResponse(simulatedResponse.thinking);
      
      setTimeout(() => {
        setGreetingData(simulatedResponse.greeting);
        setStep(3);
        setIsGenerating(false);
      }, 2000);
    }, 1500);
  };

  const generateAIResponse = (userPrompt: string) => {
    const responses = {
      thinking: `🤖 Analyzing your request: "${userPrompt}"

I'm crafting a personalized festival greeting with:
• Cultural elements and traditions
• Warm, heartfelt messaging
• Interactive design elements
• Personalized touches based on your description

Generating your unique NFT-powered greeting...`,
      greeting: {
        title: "Happy Diwali 2024",
        message: "May this Festival of Lights illuminate your path with joy, prosperity, and endless happiness. Like the diyas that brighten the darkest nights, may your life be filled with warmth and love.",
        design: "Golden lotus petals with floating lanterns",
        interactive: "Tap to release virtual diyas that spell out 'Happy Diwali'",
        cultural: "Traditional Diwali blessings with modern interactive elements"
      }
    };

    return responses;
  };

  const handleMintNFT = () => {
    setStep(4);
    // Simulate minting process
    setTimeout(() => {
      alert("🎉 Your AI-powered greeting has been minted as an NFT! You can now send it to your loved ones.");
    }, 2000);
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
              <div>
                <label className="block text-sm font-medium mb-2">Tell our AI agent what kind of greeting you want to create:</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Create a Diwali greeting for my grandmother who lives in Mumbai. She loves traditional sweets and always lights diyas. Make it warm and personal with golden colors and include blessings for health and happiness."
                  className="min-h-32"
                />
              </div>
              <Button 
                onClick={handleGenerateGreeting}
                disabled={!prompt.trim()}
                className="w-full bg-gradient-to-r from-festify-lemon-green to-festify-green hover:from-festify-green hover:to-festify-apple-green text-white py-3 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate with AI
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
            <GreetingPreview greetingData={greetingData} />
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => setStep(1)}
                className="px-6 py-3"
              >
                Regenerate
              </Button>
              <Button 
                onClick={handleMintNFT}
                className="bg-gradient-to-r from-festify-lemon-green to-festify-green hover:from-festify-green hover:to-festify-apple-green text-white px-8 py-3"
              >
                <Gem className="w-5 h-5 mr-2" />
                Mint as NFT
              </Button>
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
    </div>
  );
};

export default AIGreetingCreator;
