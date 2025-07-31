import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Download,
  Loader2,
  Twitter,
  Linkedin,
  Hash,
  ImageIcon,
  FileText,
  Edit3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SocialMediaOutput {
  linkedinCaption: string;
  twitterCaption: string;
  hashtags: string[];
  image: string;
  imagePrompt: string;
}

type Tab = "input" | "output";

const SocialMediaAgentPage = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<SocialMediaOutput | null>(null);
  const [mainTab, setMainTab] = useState<Tab>("input");
  const [activeTab, setActiveTab] = useState("linkedin");

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const imagePrompt = generateImagePrompt(input);
      const hashtags = generateHashtags(input);

      const mockOutput: SocialMediaOutput = {
        linkedinCaption: generateLinkedInCaption(input),
        twitterCaption: generateTwitterCaption(input),
        hashtags: hashtags,
        image: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(
          imagePrompt
        )}`,
        imagePrompt: imagePrompt,
      };

      setOutput(mockOutput);
      // Auto-switch to output tab after generation
      setMainTab("output");
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImagePrompt = (input: string): string => {
    if (
      input.toLowerCase().includes("ai") ||
      input.toLowerCase().includes("technology")
    ) {
      return "modern AI technology concept, futuristic digital interface, professional tech illustration";
    }
    if (
      input.toLowerCase().includes("business") ||
      input.toLowerCase().includes("marketing")
    ) {
      return "professional business concept, modern office setting, corporate success illustration";
    }
    if (
      input.toLowerCase().includes("productivity") ||
      input.toLowerCase().includes("tips")
    ) {
      return "productivity and efficiency concept, organized workspace, professional development";
    }
    return "professional social media post visual, modern design, engaging business concept";
  };

  const generateHashtags = (input: string): string[] => {
    const baseHashtags = ["#SocialMedia", "#Content", "#Digital"];

    if (input.toLowerCase().includes("ai")) {
      return [
        ...baseHashtags,
        "#AI",
        "#Technology",
        "#Innovation",
        "#MachineLearning",
        "#Future",
      ];
    }
    if (input.toLowerCase().includes("business")) {
      return [
        ...baseHashtags,
        "#Business",
        "#Entrepreneurship",
        "#Success",
        "#Growth",
        "#Leadership",
      ];
    }
    if (input.toLowerCase().includes("marketing")) {
      return [
        ...baseHashtags,
        "#Marketing",
        "#DigitalMarketing",
        "#Strategy",
        "#Branding",
        "#Growth",
      ];
    }

    return [
      ...baseHashtags,
      "#Professional",
      "#Networking",
      "#Career",
      "#Industry",
      "#Insights",
    ];
  };

  const generateLinkedInCaption = (input: string): string => {
    if (input.toLowerCase().includes("ai")) {
      return `🚀 The AI revolution is here, and it's transforming how we work!

I've been exploring how artificial intelligence is reshaping industries, and the results are fascinating. From automating routine tasks to providing deeper insights, AI isn't just a buzzword—it's a practical tool that's already making a difference.

Here are 3 key ways AI is changing the game:
✅ Enhanced productivity through automation
✅ Better decision-making with data insights  
✅ Personalized customer experiences at scale

The question isn't whether AI will impact your industry—it's how quickly you'll adapt to leverage its potential.

What's your experience with AI tools? Share your thoughts below! 👇

#AI #Technology #Innovation #Future #Business`;
    }

    return `💡 Just had an interesting thought about ${input.toLowerCase()}...

In today's fast-paced world, staying ahead means constantly learning and adapting. Whether you're in tech, marketing, or any other field, the key is to embrace change and turn challenges into opportunities.

Here's what I've learned:
✅ Stay curious and keep learning
✅ Network with like-minded professionals
✅ Share your knowledge with others

Success isn't just about what you know—it's about how you apply that knowledge and help others grow too.

What's your take on this? Let's discuss! 👇`;
  };

  const generateTwitterCaption = (input: string): string => {
    if (input.toLowerCase().includes("ai")) {
      return `🤖 AI isn't replacing humans—it's amplifying our capabilities!

The future belongs to those who learn to work WITH AI, not against it.

What AI tool has changed your workflow? 🚀`;
    }

    return `💭 Quick thought: ${input.toLowerCase()} is more important than ever.

The key? Stay curious, keep learning, and never stop growing.

What's your experience? 👇`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportPost = async (platform: string) => {
    if (!output) return;

    const caption =
      platform === "linkedin" ? output.linkedinCaption : output.twitterCaption;
    const hashtags = output.hashtags.join(" ");

    const content = `${caption}

${hashtags}





Image Prompt: ${output.imagePrompt}`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${platform}_post_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getCharacterCount = (text: string) => text.length;
  const getCharacterLimit = (platform: string) =>
    platform === "twitter" ? 280 : 3000;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 hover:text-white hover:bg-gray-800 p-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-8">
            <button
              onClick={() => setMainTab("input")}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                mainTab === "input"
                  ? "text-blue-400 border-blue-400"
                  : "text-gray-400 border-gray-700 hover:text-gray-300"
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Input
            </button>
            <button
              onClick={() => output && setMainTab("output")}
              disabled={!output}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                mainTab === "output" && output
                  ? "text-blue-400 border-blue-400"
                  : output
                  ? "text-gray-400 border-gray-700 hover:text-gray-300 cursor-pointer"
                  : "text-gray-600 border-gray-700 cursor-not-allowed"
              }`}
            >
              <FileText className="w-4 h-4" />
              Output
              {!output && (
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-500">
                  Generate first
                </Badge>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {/* Input Tab */}
            {mainTab === "input" && (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    Social Media Post Topic & Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder='Enter your social media post topic here...
Example: "AI tools that are revolutionizing productivity in 2024"'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[300px] bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      {input.length}/500 characters
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>Credits required:</span>
                      <Badge
                        variant="outline"
                        className="border-blue-500/30 text-blue-300"
                      >
                        15 credits
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={!input.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Social Media Posts...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Social Media Posts
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Output Tab */}
            {mainTab === "output" && (
              <>
                {isGenerating ? (
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardContent className="py-16">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></div>
                          <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-medium">
                            Creating your social media posts...
                          </p>
                          <p className="text-gray-400 text-sm">
                            Generating content for LinkedIn and Twitter
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : output ? (
            <div className="space-y-6">
              {/* Generated Image */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <ImageIcon className="w-5 h-5 text-green-400" />
                    Generated Post Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={output.image || "/placeholder.svg"}
                      alt="Generated social media post"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-green-600/90 text-white text-xs">
                        AI Generated: {output.imagePrompt}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                  <TabsTrigger
                    value="linkedin"
                    className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-300"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </TabsTrigger>
                  <TabsTrigger
                    value="twitter"
                    className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-300"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="linkedin" className="mt-6">
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Linkedin className="w-5 h-5 text-blue-500" />
                          LinkedIn Post
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                output.linkedinCaption +
                                  "\n\n" +
                                  output.hashtags.join(" ")
                              )
                            }
                            className="border-gray-600 text-gray-300 hover:bg-gray-800 cursor-pointer"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => exportPost("linkedin")}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800 cursor-pointer"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                          {output.linkedinCaption}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>
                          {getCharacterCount(output.linkedinCaption)}/
                          {getCharacterLimit("linkedin")} characters
                        </span>
                        <Badge
                          variant="outline"
                          className="border-green-500/30 text-green-300"
                        >
                          Optimal Length
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="twitter" className="mt-6">
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Twitter className="w-5 h-5 text-blue-400" />
                          Twitter Post
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                output.twitterCaption +
                                  "\n\n" +
                                  output.hashtags.slice(0, 5).join(" ")
                              )
                            }
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => exportPost("twitter")}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                          {output.twitterCaption}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>
                          {getCharacterCount(output.twitterCaption)}/
                          {getCharacterLimit("twitter")} characters
                        </span>
                        <Badge
                          variant="outline"
                          className={`${
                            getCharacterCount(output.twitterCaption) <= 280
                              ? "border-green-500/30 text-green-300"
                              : "border-red-500/30 text-red-300"
                          }`}
                        >
                          {getCharacterCount(output.twitterCaption) <= 280
                            ? "Within Limit"
                            : "Over Limit"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Hashtags Section */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Hash className="w-5 h-5 text-purple-400" />
                    Generated Hashtags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {output.hashtags.map((hashtag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-purple-500/30 text-purple-300 cursor-pointer hover:bg-purple-500/10"
                        onClick={() => copyToClipboard(hashtag)}
                      >
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {output.hashtags.length} hashtags generated
                    </span>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(output.hashtags.join(" "))}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy All
                    </Button>
                  </div>
                </CardContent>
              </Card>
                  </div>
                ) : (
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardContent className="py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                          <Sparkles className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-400 mb-2">
                          Ready to create engaging social media content
                        </h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                          Enter your post topic and we'll generate optimized content
                          for LinkedIn and Twitter with relevant hashtags.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaAgentPage;
