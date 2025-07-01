
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Palette, Code, Handshake, Trophy, MessageCircle } from "lucide-react";

const Community = () => {
  const communityRoles = [
    {
      icon: Users,
      title: "Users",
      description: "Create and send AI-powered greetings to celebrate with loved ones",
      color: "bg-gradient-to-br from-festify-lemon-green to-festify-green"
    },
    {
      icon: Palette,
      title: "Artists",
      description: "Design AI personalities and card templates for the community",
      color: "bg-gradient-to-br from-festify-light-blue to-festify-apple-green"
    },
    {
      icon: Code,
      title: "Developers",
      description: "Contribute to the open-source project and build new features",
      color: "bg-gradient-to-br from-festify-lemon-orange to-festify-light-blue"
    },
    {
      icon: Handshake,
      title: "Partners",
      description: "Collaborate on special collections and brand integrations",
      color: "bg-gradient-to-br from-festify-green to-festify-apple-green"
    }
  ];

  return (
    <section id="community" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            <span className="festive-text">Join Our Community</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Be part of the revolution in digital celebrations. Connect with creators, artists, and developers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {communityRoles.map((role, index) => (
            <Card key={index} className="glass-effect border-none shadow-lg hover:transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${role.color} flex items-center justify-center`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">{role.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center leading-relaxed">
                  {role.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-card-gradient rounded-3xl p-12 text-center">
          <Trophy className="w-16 h-16 text-festify-lemon-orange mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">Community Rewards</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Earn points for participation, unlock exclusive features, and get early access to new AI personalities and card templates.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button className="bg-gradient-to-r from-festify-lemon-green to-festify-green hover:from-festify-green hover:to-festify-apple-green text-white px-8 py-3 rounded-full transition-all duration-300">
              <MessageCircle className="w-5 h-5 mr-2" />
              Join Discord
            </Button>
            <Button variant="outline" className="border-2 border-festify-green text-festify-green hover:bg-festify-green hover:text-white px-8 py-3 rounded-full transition-all duration-300">
              <Code className="w-5 h-5 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
