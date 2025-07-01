
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Eye, Palette, MessageCircle } from "lucide-react";

interface GreetingData {
  title: string;
  message: string;
  design: string;
  interactive: string;
  cultural: string;
}

interface GreetingPreviewProps {
  greetingData: GreetingData;
}

const GreetingPreview = ({ greetingData }: GreetingPreviewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Visual Preview */}
      <Card className="glass-effect border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Eye className="w-6 h-6 mr-2 text-festify-lemon-orange" />
            Visual Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 text-center">{greetingData.title}</h3>
              <div className="text-center mb-6">
                <Sparkles className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                <p className="text-sm opacity-90">{greetingData.design}</p>
              </div>
              <p className="text-sm leading-relaxed text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                {greetingData.message}
              </p>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-xs">
                  💫 Tap to interact
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Panel */}
      <div className="space-y-4">
        <Card className="glass-effect border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MessageCircle className="w-5 h-5 mr-2 text-festify-green" />
              Greeting Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-festify-green">Title:</h4>
                <p className="text-gray-700">{greetingData.title}</p>
              </div>
              <div>
                <h4 className="font-semibold text-festify-green">Message:</h4>
                <p className="text-gray-700 text-sm">{greetingData.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Palette className="w-5 h-5 mr-2 text-festify-light-blue" />
              Interactive Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-festify-light-blue">Design:</h4>
                <p className="text-gray-700 text-sm">{greetingData.design}</p>
              </div>
              <div>
                <h4 className="font-semibold text-festify-light-blue">Interaction:</h4>
                <p className="text-gray-700 text-sm">{greetingData.interactive}</p>
              </div>
              <div>
                <h4 className="font-semibold text-festify-light-blue">Cultural Elements:</h4>
                <p className="text-gray-700 text-sm">{greetingData.cultural}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GreetingPreview;
