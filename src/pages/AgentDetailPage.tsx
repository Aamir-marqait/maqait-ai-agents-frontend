/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Play,
  Upload,
  Download,
  Clock,
  Coins,
  Settings,
  Video,
} from "lucide-react";

const AgentDetailPage = () => {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");

  // Mock agent data - in real app, fetch based on ID
  const agent = {
    id: 1,
    name: "Pixverse",
    category: "Image-to-Video",
    description:
      "Transform static images into dynamic video content with AI-powered motion generation. Create engaging videos from your images with customizable motion patterns and effects.",
    credits: 25,
    features: [
      "High-quality video generation",
      "Multiple motion styles",
      "Customizable duration",
      "HD output resolution",
    ],
    runHistory: [
      {
        id: 1,
        input: "Sunset landscape transformation",
        output: "Generated 5-second video with flowing clouds",
        timestamp: "2 hours ago",
        credits: 25,
        status: "completed",
      },
      {
        id: 2,
        input: "Portrait animation",
        output: "Created subtle facial animation",
        timestamp: "1 day ago",
        credits: 25,
        status: "completed",
      },
    ],
  };

  const handleRun = async () => {
    setIsRunning(true);
    // Simulate API call
    setTimeout(() => {
      setIsRunning(false);
      // Show success message or redirect to results
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/agents")}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Agents
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agent Info */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl text-white flex items-center">
                    <Video className="w-6 h-6 mr-3 text-violet-400" />
                    {agent.name}
                  </CardTitle>
                  <Badge className="mt-2 bg-violet-500/20 text-violet-400 border-violet-500/30">
                    {agent.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-gray-400 mb-1">
                    <Coins className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {agent.credits} credits per run
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 leading-relaxed mb-4">
                {agent.description}
              </CardDescription>
              <div className="space-y-2">
                <h4 className="text-white font-medium">Features:</h4>
                <ul className="text-gray-400 space-y-1">
                  {agent.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Input Parameters */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Input Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload" className="text-white">
                  Upload Image
                </Label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-violet-500/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-white">
                  Motion Description
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the motion you want to add to your image..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-violet-500"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="style" className="text-white">
                  Motion Style
                </Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select motion style" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="smooth">Smooth Motion</SelectItem>
                    <SelectItem value="dynamic">Dynamic Motion</SelectItem>
                    <SelectItem value="subtle">Subtle Animation</SelectItem>
                    <SelectItem value="cinematic">Cinematic Flow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleRun}
                disabled={isRunning}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-6"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Agent ({agent.credits} credits)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Output Preview */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Output Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Video className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    Output will appear here
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-400 bg-transparent"
                disabled
              >
                <Download className="w-4 h-4 mr-2" />
                Download Result
              </Button>
            </CardContent>
          </Card>

          {/* Run History */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Run History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {agent.runHistory.map((run) => (
                <div key={run.id} className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        {run.input}
                      </p>
                      <p className="text-gray-400 text-xs">{run.output}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                    >
                      {run.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{run.credits} credits</span>
                    <span>{run.timestamp}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
