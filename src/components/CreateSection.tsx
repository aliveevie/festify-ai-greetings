
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brush, Brain, Gem, Send } from "lucide-react";

const CreateSection = () => {
  const steps = [
    {
      icon: Brain,
      title: "Use AI Agent",
      description: "Leverage AI agents to craft personalized greetings with cultural knowledge and emotional depth",
      color: "from-festify-lemon-green to-festify-green"
    },
    {
      icon: Brush,
      title: "Customize Design",
      description: "Design beautiful card templates and personalize the greeting content with AI assistance",
      color: "from-festify-light-blue to-festify-apple-green"
    },
    {
      icon: Gem,
      title: "Mint as NFT",
      description: "Transform your AI-created greeting into a unique, collectible NFT on the blockchain",
      color: "from-festify-lemon-orange to-festify-light-blue"
    },
    {
      icon: Send,
      title: "Send & Share",
      description: "Share your interactive NFT-powered greetings with friends and family",
      color: "from-festify-green to-festify-apple-green"
    }
  ];

  return (
    <section id="create" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            <span className="festive-text">How It Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create your first AI-powered NFT greeting in just four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="glass-effect border-none shadow-lg hover:transform hover:scale-105 transition-all duration-300 h-full">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 mx-auto mb-4">
                    {index + 1}
                  </div>
                  <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-festify-green w-8 h-8 z-10" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button className="bg-gradient-to-r from-festify-lemon-green to-festify-green hover:from-festify-green hover:to-festify-apple-green text-white px-12 py-4 text-xl rounded-full transition-all duration-300 transform hover:scale-105">
            <Brain className="w-6 h-6 mr-3" />
            Start Creating Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CreateSection;
