import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Copy, Download, Loader2, FileText, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Tab = "input" | "output";

const BlogAgentPage = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("input");
  const [output, setOutput] = useState<{
    title: string;
    content: string;
    image: string;
    imagePrompt?: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setIsGenerating(true);

    try {
      // Simulate generating both blog content and image
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Extract key topics from input for image generation
      const imagePrompt = generateImagePrompt(input);

      // Mock response with both generated text and image
      const mockOutput = {
        title: generateTitle(input),
        content: generateBlogContent(),
        image: `/1.png`, // Using available asset
        imagePrompt: imagePrompt,
      };

      setOutput(mockOutput);
      // Auto-switch to output tab after generation
      setActiveTab("output");
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to generate image prompt from blog input
  const generateImagePrompt = (input: string): string => {
    // Extract key concepts for image generation
    if (
      input.toLowerCase().includes("ai") &&
      input.toLowerCase().includes("marketing")
    ) {
      return "modern AI technology in marketing, digital analytics dashboard, futuristic business graphics";
    }
    if (input.toLowerCase().includes("social media")) {
      return "social media marketing concept, digital engagement, modern social platforms";
    }
    // Add more conditions based on common topics
    return "professional business concept, modern technology, clean corporate style";
  };

  // Helper function to generate title from input
  const generateTitle = (input: string): string => {
    if (
      input.toLowerCase().includes("ai") &&
      input.toLowerCase().includes("marketing")
    ) {
      return "AI in Marketing: How Agencies Can Leverage Technology for Better ROI";
    }
    return "Generated Blog Post Title";
  };

  // Helper function to generate blog content from input
  const generateBlogContent = (): string => {
    // This would call your AI text generation service
    // For now, returning the example content
    return `If you're working in marketing, you've probably heard a lot about AI lately – not just as a buzzword but as a real game-changer. The question is, how can marketing agencies actually use AI to boost their ROI and get sharper customer insights? There's some solid data on this, and a few practical ways to make AI work for you.

First off, according to a 2024 McKinsey report, companies using AI in their marketing campaigns see about 20 to 30 percent higher ROI than those relying on traditional methods. That's a big jump. But here's the catch – many marketers still struggle to measure AI's impact properly. It's easy to get caught up in nice-sounding metrics like click-through rates that don't always translate into real revenue. So, if you want AI to pay off, you'll need clear performance indicators that connect AI-driven insights directly to sales and customer growth.

Now, about how AI actually helps with customer insight: AI tools can process huge amounts of data way faster than humans. This means better segmentation, personalization, and targeting. For example, some agencies use generative AI to create personalized ad content at scale, which not only saves time but often performs better. Others rely on AI-powered predictive analytics to anticipate customer behavior and adjust campaigns accordingly.

There's a growing number of AI in marketing courses and certifications too, like those on Coursera or NPTEL, that can help marketers get up to speed on these tools quickly. If you're serious about leveraging AI, investing some time in education can really pay off.

But heads up – AI isn't magic. It's not about replacing your marketing team but augmenting their skills. Ethical AI use is also something to keep in mind, especially with customer data privacy concerns rising.

In short, AI in marketing is proving to be a practical way to boost ROI and gain deeper customer insights when used thoughtfully. If you're curious, check out some AI in marketing research papers or recent conferences to keep up with new trends.

Hope this helped clear things up. Let us know what you think or if you want tips on specific AI tools for marketing agencies.`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportBlog = async (blogData: {
    title: string;
    content: string;
    image: string;
    imagePrompt?: string;
  }) => {
    try {
      // Create a document content
      const docContent = `${blogData.title}

${blogData.content}

---
Generated by AI Blog Agent
Image: ${blogData.image}
${blogData.imagePrompt ? `Image Prompt: ${blogData.imagePrompt}` : ""}
`;

      // Create and download the document file
      const blob = new Blob([docContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${blogData.title
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);


      
      // Download the image separately
      if (blogData.image && !blogData.image.includes("1.png")) {
        const imageLink = document.createElement("a");
        imageLink.href = blogData.image;
        imageLink.download = `${blogData.title
          .replace(/[^a-z0-9]/gi, "_")
          .toLowerCase()}_cover.jpg`;
        document.body.appendChild(imageLink);
        imageLink.click();
        document.body.removeChild(imageLink);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back CTA */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 hover:text-white hover:bg-gray-800 p-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 " />
          Back
        </Button>
        
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-8">
            <button
              onClick={() => setActiveTab("input")}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "input"
                  ? "text-violet-400 border-violet-400"
                  : "text-gray-400 border-gray-700 hover:text-gray-300"
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Input
            </button>
            <button
              onClick={() => output && setActiveTab("output")}
              disabled={!output}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "output" && output
                  ? "text-violet-400 border-violet-400"
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
            {activeTab === "input" && (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                    Blog Topic & Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder='Enter your blog topic and requirements here...

Example: "Blog post about AI and how we can use them for our benefits from marketing agency perspective"'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[300px] bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      {input.length}/1000 characters
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>Credits required:</span>
                      <Badge
                        variant="outline"
                        className="border-violet-500/30 text-violet-300"
                      >
                        20 credits
                      </Badge>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!input.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Blog Post...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Blog Post
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Output Tab */}
            {activeTab === "output" && (
              <>
                {isGenerating ? (
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardContent className="py-16">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 animate-pulse"></div>
                          <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-medium">
                            Creating your blog post...
                          </p>
                          <p className="text-gray-400 text-sm">
                            This may take a few moments
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : output ? (
            <article className="bg-gray-950 text-white rounded-lg overflow-hidden shadow-2xl border border-violet-500/30">
              {/* Cover Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={output.image || "/1.png"}
                  alt="Blog cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                {output.imagePrompt && (
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-blue-600/90 text-white text-xs">
                      AI Generated: {output.imagePrompt}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <div className="p-8 lg:p-12">
                {/* Header with Actions */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex-1">
                    <Badge className="bg-green-600/20 border border-green-500/30 text-green-300 mb-4">
                      Ready to publish
                    </Badge>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                      {output.title}
                    </h1>

                    {/* Blog Meta */}
                    <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            AI
                          </span>
                        </div>
                        <span>AI Generated Blog</span>
                      </div>
                      <span>•</span>
                      <span>
                        {Math.ceil(output.content.split(" ").length / 200)} min
                        read
                      </span>
                      <span>•</span>
                      <span>{output.content.split(" ").length} words</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(output.content)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 cursor-pointer"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => exportBlog(output)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 cursor-pointer"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Blog Text Content */}
                <div className="prose prose-lg max-w-none">
                  {output.content.split("\n\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-gray-300 leading-relaxed mb-6 text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Bottom Stats */}
                <div className="mt-12 pt-8 border-t border-gray-700">
                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {output.content.split(" ").length}
                      </div>
                      <div className="text-sm text-gray-400">Total Words</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {Math.ceil(output.content.split(" ").length / 200)}
                      </div>
                      <div className="text-sm text-gray-400">
                        Minutes to Read
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {output.content.length}
                      </div>
                      <div className="text-sm text-gray-400">Characters</div>
                    </div>
                  </div>
                </div>
              </div>
                  </article>
                ) : (
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardContent className="py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                          <Sparkles className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-400 mb-2">
                          Ready to create amazing content
                        </h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                          Enter your blog topic and requirements in the input field,
                          then click generate to create your blog post.
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

export default BlogAgentPage;
