
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, Share2, Eye } from "lucide-react";

const MyGreetings = () => {
  // Mock data for demonstration
  const greetings = [
    {
      id: 1,
      title: "Happy Diwali 2024",
      recipient: "Grandmother",
      date: "2024-01-15",
      type: "Diwali",
      status: "Sent",
      thumbnail: "🪔"
    },
    {
      id: 2,
      title: "Christmas Wishes",
      recipient: "Family Group",
      date: "2024-01-10",
      type: "Christmas",
      status: "Draft",
      thumbnail: "🎄"
    },
    {
      id: 3,
      title: "New Year Blessing",
      recipient: "College Friends",
      date: "2024-01-01",
      type: "New Year",
      status: "Sent",
      thumbnail: "🎊"
    }
  ];

  return (
    <section id="my-greetings" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            <span className="festive-text">My Greetings</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View and manage all your AI-powered NFT greetings in one place
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {greetings.length === 0 ? (
            <Card className="glass-effect border-none shadow-lg text-center py-12">
              <CardContent>
                <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-bold mb-2 text-gray-600">No Greetings Yet</h3>
                <p className="text-gray-500 mb-6">Create your first AI-powered greeting to get started</p>
                <Button className="bg-gradient-to-r from-festify-lemon-green to-festify-green hover:from-festify-green hover:to-festify-apple-green text-white">
                  Create Your First Greeting
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {greetings.map((greeting) => (
                <Card key={greeting.id} className="glass-effect border-none shadow-lg hover:transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-4xl">{greeting.thumbnail}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        greeting.status === 'Sent' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {greeting.status}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{greeting.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {greeting.date}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        To: {greeting.recipient}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 border-festify-green text-festify-green hover:bg-festify-green hover:text-white"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 border-festify-light-blue text-festify-light-blue hover:bg-festify-light-blue hover:text-white"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyGreetings;
