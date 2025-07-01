
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Coins, Users, Zap, Globe, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Bot,
      title: "AI Agent Assistance",
      description: "Use intelligent AI agents to create personalized greetings with cultural knowledge and emotional understanding.",
      color: "text-festify-lemon-green"
    },
    {
      icon: Coins,
      title: "NFT Integration",
      description: "ERC721 standard implementation with IPFS metadata storage for permanent, ownable digital greetings.",
      color: "text-festify-light-blue"
    },
    {
      icon: Users,
      title: "Community Engagement",
      description: "Points system for participation, artist collaborations, and social sharing features.",
      color: "text-festify-green"
    },
    {
      icon: Zap,
      title: "Interactive Experience",
      description: "AI-powered NFT greetings that respond to recipients and create engaging conversations.",
      color: "text-festify-lemon-orange"
    },
    {
      icon: Globe,
      title: "Cross-Chain Support",
      description: "Multi-chain compatibility ensuring your NFT greetings work across different blockchain networks.",
      color: "text-festify-apple-green"
    },
    {
      icon: Shield,
      title: "Permanent Ownership",
      description: "True ownership through blockchain technology with royalty mechanisms for creators.",
      color: "text-festify-lemon-green"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            <span className="festive-text">Revolutionary Features</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how Festify transforms digital celebrations with AI-powered NFT greetings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:transform hover:scale-105 transition-all duration-300 glass-effect border-none shadow-lg">
              <CardHeader className="text-center">
                <feature.icon className={`w-16 h-16 mx-auto mb-4 ${feature.color}`} />
                <CardTitle className="text-2xl mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center text-lg leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
