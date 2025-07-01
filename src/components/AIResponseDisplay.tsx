
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2 } from "lucide-react";

interface AIResponseDisplayProps {
  isGenerating: boolean;
  response: string;
}

const AIResponseDisplay = ({ isGenerating, response }: AIResponseDisplayProps) => {
  return (
    <Card className="glass-effect border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Brain className="w-8 h-8 mr-3 text-festify-light-blue" />
          AI Agent Working
          {isGenerating && <Loader2 className="w-6 h-6 ml-2 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-500 ml-2">AI Agent Terminal</span>
          </div>
          <div className="whitespace-pre-wrap text-gray-800">
            {response}
            {isGenerating && <span className="animate-pulse">|</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIResponseDisplay;
