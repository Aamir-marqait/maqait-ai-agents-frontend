/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Copy,
  Download,
  Loader2,
  Edit3,
  History,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  PenTool,
  BookOpen,
  Target,
  Sparkles,
  X,
  Maximize2,
} from "lucide-react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";
import { useNavigate, useLocation } from "react-router-dom";
import { apiClient } from "../../lib/apiClient";
import { useAuth } from "../../contexts/AuthContext";

interface BlogInputs {
  about_blog: string;
  category: string;
}

interface AgentExecution {
  id: string;
  user_id: string;
  agent_id: string;
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  status: "pending" | "running" | "completed" | "failed";
  cost_deducted: string;
  execution_time_seconds?: number;
  error_message?: string;
  created_at: string;
  completed_at?: string;
  agent: {
    name: string;
    description: string;
    cost_per_run: string;
  };
}

interface Agent {
  id: string;
  name: string;
  description: string;
  cost_per_run: string;
}

interface ParsedBlogOutput {
  title: string;
  content: string;
  image?: string;
  raw_response?: string;
}

const BlogAgentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUserProfile } = useAuth();

  const [agent, setAgent] = useState<Agent | null>(
    location.state?.agent || null
  );
  const [agentId, setAgentId] = useState<string>(location.state?.agentId || "");

  const [inputs, setInputs] = useState<BlogInputs>({
    about_blog: "",
    category: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState("");
  const [generationStep, setGenerationStep] = useState(0);
  const [output, setOutput] = useState<ParsedBlogOutput | null>(null);
  const [activeTab, setActiveTab] = useState("input");
  const [executionHistory, setExecutionHistory] = useState<AgentExecution[]>(
    []
  );
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New states for improved UX
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [selectedBlogForModal, setSelectedBlogForModal] =
    useState<ParsedBlogOutput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Find blog agent if not passed via navigation
  useEffect(() => {
    const findBlogAgent = async () => {
      if (!agent || !agentId) {
        try {
          const response = await apiClient.get("/api/v0/agents/");
          const agents = response.data;
          const blogAgent = agents.find((a: any) => a.name === "Blog Agent");
          if (blogAgent) {
            setAgent(blogAgent);
            setAgentId(blogAgent.id);
          }
        } catch (error) {
          console.error("Error finding agent:", error);
          setError("Failed to load agent information");
        }
      }
    };

    findBlogAgent();
  }, [agent, agentId]);

  // Parse n8n response into structured blog data
  const parseN8nResponse = (rawData: any): ParsedBlogOutput | null => {
    try {
      let outputData = rawData;

      if (typeof outputData === "string") {
        try {
          outputData = JSON.parse(outputData);
        } catch {
          // Handle raw text response from n8n
          console.log("Raw text response detected, parsing manually...");
          outputData = { raw_response: outputData };
        }
      }

      if (outputData?.output) {
        try {
          const parsed =
            typeof outputData.output === "string"
              ? JSON.parse(outputData.output)
              : outputData.output;
          return parsed;
        } catch {
          return outputData.output;
        }
      } else if (outputData?.raw_response) {
        // Parse the structured text response
        const rawText = outputData.raw_response;
        const imageMatch = rawText.match(/image\s*:\s*(.+?)(?:\n|$)/i);
        const titleMatch = rawText.match(/Title\s*:\s*(.+?)(?:\n|$)/i);
        const contentMatch = rawText.match(/content\s*:\s*([\s\S]+)$/i);

        return {
          image: imageMatch ? imageMatch[1].trim() : undefined,
          title: titleMatch ? titleMatch[1].trim() : "Generated Blog Post",
          content: contentMatch ? contentMatch[1].trim() : rawText,
          raw_response: rawText,
        };
      } else {
        return outputData;
      }
    } catch (error) {
      console.error("Error parsing n8n response:", error);
      return null;
    }
  };

  const handleInputChange = (field: keyof BlogInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Dynamic thinking messages for AI generation process
  const thinkingMessages = [
    "Analyzing your blog topic and requirements...",
    "Researching relevant information and trends...",
    "Crafting engaging headlines and structure...",
    "Writing compelling content with AI insights...",
    "Optimizing for readability and SEO...",
    "Adding final touches and polish...",
    "Almost ready! Finalizing your blog post...",
  ];

  // Cycle through thinking messages during generation
  const startThinkingAnimation = () => {
    let stepIndex = 0;
    setThinkingMessage(thinkingMessages[0]);
    setGenerationStep(0);

    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % thinkingMessages.length;
      setThinkingMessage(thinkingMessages[stepIndex]);
      setGenerationStep(stepIndex);
    }, 2000); // Change message every 2 seconds

    return interval;
  };

  const handleGenerate = async () => {
    if (!isFormValid || !agentId) return;

    setIsGenerating(true);
    setError(null);

    // Start thinking animation
    const thinkingInterval = startThinkingAnimation();

    // Don't auto-navigate - let user choose when to view output

    try {
      const response = await apiClient.post(
        `/api/v0/agents/${agentId}/execute`,
        inputs
      );
      const executionId = response.data.execution_id;

      // If result is immediately available
      if (response.data.result) {
        const parsedOutput = parseN8nResponse(response.data.result);
        if (parsedOutput) {
          setOutput(parsedOutput);
          // Only switch to output tab if generation completes and user hasn't manually switched away
          if (activeTab !== "input") {
            setActiveTab("output");
          }
          // Refresh user profile silently without triggering global loader
          refreshUserProfile(true).catch(console.error);
        }
        clearInterval(thinkingInterval);
        setIsGenerating(false);
        return;
      }

      // Poll for the result
      const pollResult = async () => {
        try {
          const historyResponse = await apiClient.get(
            "/api/v0/agents/executions/history",
            {
              params: { limit: 50, offset: 0 },
            }
          );

          const latestExecution = historyResponse.data.find(
            (ex: AgentExecution) => ex.id === executionId
          );

          if (latestExecution) {
            if (
              latestExecution.status === "completed" &&
              latestExecution.output_data
            ) {
              const parsedOutput = parseN8nResponse(
                latestExecution.output_data
              );
              if (parsedOutput) {
                setOutput(parsedOutput);
                // Only switch to output tab if generation completes and user hasn't manually switched away
                if (activeTab !== "input") {
                  setActiveTab("output");
                }
                // Refresh user profile silently without triggering global loader
                refreshUserProfile(true).catch(console.error);
              }
              clearInterval(thinkingInterval);
              setIsGenerating(false);
            } else if (latestExecution.status === "failed") {
              setError(latestExecution.error_message || "Generation failed");
              clearInterval(thinkingInterval);
              setIsGenerating(false);
            } else {
              setTimeout(pollResult, 3000);
            }
          } else {
            setTimeout(pollResult, 3000);
          }
        } catch (pollError) {
          console.error("Error polling result:", pollError);
          setError("Failed to get results");
          clearInterval(thinkingInterval);
          setIsGenerating(false);
        }
      };

      setTimeout(pollResult, 1000);
    } catch (error: any) {
      console.error("Generation failed:", error);
      let errorMessage = "Failed to generate blog post";

      if (error.response?.status === 402) {
        errorMessage = "Insufficient credits to run this agent";
      } else if (error.response?.status === 404) {
        errorMessage = "Agent not found";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      setError(errorMessage);
      clearInterval(thinkingInterval);
      setIsGenerating(false);
    }
  };

  // Fetch execution history
  const fetchHistory = async () => {
    if (!agentId) return;

    try {
      setLoadingHistory(true);
      const response = await apiClient.get(
        "/api/v0/agents/executions/history",
        {
          params: { limit: 20, offset: 0 },
        }
      );

      const agentHistory = response.data.filter(
        (execution: AgentExecution) => execution.agent_id === agentId
      );
      setExecutionHistory(agentHistory);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Open history panel
  const openHistoryPanel = async () => {
    setIsHistoryPanelOpen(true);
    await fetchHistory();
  };

  // View blog in modal
  const viewBlogInModal = (execution: AgentExecution) => {
    const parsedOutput = parseN8nResponse(execution.output_data);
    if (parsedOutput) {
      setSelectedBlogForModal(parsedOutput);
      setIsModalOpen(true);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Helper function to fetch image as base64 and detect type
  const fetchImageAsBase64 = async (
    imageUrl: string
  ): Promise<{ data: string; type: string } | null> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          // Extract image type from data URL
          const mimeMatch = base64.match(/data:image\/([^;]+);base64,/);
          const imageType = mimeMatch ? mimeMatch[1] : "png";

          resolve({
            data: base64.split(",")[1],
            type: imageType,
          });
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  // Export as TXT file (existing functionality)
  const exportBlogAsTxt = async (blogData?: ParsedBlogOutput) => {
    const dataToExport = blogData || output;
    if (!dataToExport) return;

    const content = `BLOG POST
Topic: ${inputs.about_blog}
Category: ${inputs.category}
Generated: ${new Date().toLocaleDateString()}

Title: ${dataToExport.title}

Content:
${dataToExport.content}

---
Generated by AI Blog Agent`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${inputs.category
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_blog_post.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export as DOCX file with image support
  const exportBlogAsDocx = async (blogData?: ParsedBlogOutput) => {
    const dataToExport = blogData || output;
    if (!dataToExport) return;

    try {
      const children: any[] = [];

      // Add title
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: dataToExport.title,
              bold: true,
              size: 32,
              color: "2D3748",
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );

      // Add metadata
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Topic: ${inputs.about_blog}`,
              italics: true,
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Category: ${inputs.category}`,
              italics: true,
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Generated: ${new Date().toLocaleDateString()}`,
              italics: true,
              size: 20,
            }),
          ],
          spacing: { after: 400 },
        })
      );

      // Add image if available
      if (dataToExport.image) {
        try {
          const imageResult = await fetchImageAsBase64(dataToExport.image);
          if (imageResult) {
            children.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageResult.data,
                    transformation: {
                      width: 500,
                      height: 300,
                    },
                    type: imageResult.type as any,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              })
            );
          }
        } catch (error) {
          console.error("Error adding image to DOCX:", error);
        }
      }

      // Add content paragraphs
      const contentParagraphs = dataToExport.content.split("\n\n");
      contentParagraphs.forEach((paragraph) => {
        if (paragraph.trim()) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: paragraph.trim(),
                  size: 24,
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED,
            })
          );
        }
      });

      // Add footer
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "---",
              size: 20,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Generated by AI Blog Agent",
              italics: true,
              size: 20,
              color: "718096",
            }),
          ],
          alignment: AlignmentType.CENTER,
        })
      );

      // Create document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: children,
          },
        ],
      });

      // Generate and save file
      const buffer = await Packer.toBuffer(doc);
      const filename = `${inputs.category
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_blog_post.docx`;

      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }),
        filename
      );
    } catch (error) {
      console.error("Error exporting DOCX:", error);
      // Fallback to TXT export if DOCX fails
      exportBlogAsTxt(blogData);
    }
  };

  // Default export function - DOCX with image support
  const exportBlog = exportBlogAsDocx;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "running":
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-400";
      case "failed":
        return "text-red-400";
      case "running":
        return "text-blue-400";
      default:
        return "text-amber-400";
    }
  };

  const isFormValid = inputs.about_blog.trim() && inputs.category.trim();
  const agentCost = agent ? Math.round(parseFloat(agent.cost_per_run)) : 35;

  // Blog Post Component
  const BlogPostDisplay = ({
    blogData,
    showActions = true,
  }: {
    blogData: ParsedBlogOutput;
    showActions?: boolean;
  }) => (
    <div className="space-y-6">
      {blogData.image && (
        <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border-slate-700/50 backdrop-blur-sm overflow-hidden">
          <div className="relative h-64 md:h-80">
            <img
              src={blogData.image}
              alt="Blog cover"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-violet-600/90 text-white text-xs">
                AI Generated Image
              </Badge>
            </div>
          </div>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div>
              <Badge className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 mb-4">
                Ready to publish
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                {blogData.title}
              </h1>

              {/* Blog Meta */}
              <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">AI</span>
                  </div>
                  <span>AI Generated Blog</span>
                </div>
                <span>•</span>
                <span>
                  {Math.ceil(blogData.content.split(" ").length / 200)} min read
                </span>
                <span>•</span>
                <span>{blogData.content.split(" ").length} words</span>
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              {blogData.content
                .split("\n\n")
                .map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="text-gray-300 leading-relaxed mb-6 text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
            </div>

            {/* Bottom Stats */}
            <div className="mt-12 pt-8 border-t border-slate-700">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {blogData.content.split(" ").length}
                  </div>
                  <div className="text-sm text-gray-400">Total Words</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {Math.ceil(blogData.content.split(" ").length / 200)}
                  </div>
                  <div className="text-sm text-gray-400">Minutes to Read</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {blogData.content.length}
                  </div>
                  <div className="text-sm text-gray-400">Characters</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {showActions && (
              <div className="flex justify-center gap-3 pt-6">
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(blogData.content)}
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Content
                </Button>
                <Button
                  size="sm"
                  onClick={() => exportBlog(blogData)}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export DOCX
                  {blogData.image && (
                    <Badge className="ml-2 bg-emerald-600/20 text-emerald-300 text-xs">
                      +Image
                    </Badge>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header with Back Button and History Button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agents
          </Button>

          {/* History Button */}
          <Button
            variant="ghost"
            onClick={openHistoryPanel}
            className="text-gray-400 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 transition-all duration-200 relative"
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
                  <PenTool className="w-8 h-8 text-violet-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                    {agent?.name || "Blog Agent"}
                  </h1>
                  <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                    {agent?.description ||
                      "Generate high-quality blog posts with AI-powered content creation"}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 px-3 py-1">
                      {agentCost} Credits/Post
                    </Badge>
                    {user && (
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 text-emerald-300"
                      >
                        Credits: {Math.floor(user.credits)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="hidden lg:flex flex-col gap-2 text-right">
                <div className="text-2xl font-bold text-white">30-45s</div>
                <div className="text-xs text-gray-400">Generation Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-red-500/10 to-red-600/5 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-red-300 font-medium">Generation Failed</p>
                  <p className="text-red-400/80 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Only Input and Output Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-slate-900/50 border border-slate-700/50 p-1 rounded-xl">
            <TabsTrigger
              value="input"
              className="data-[state=active]:bg-violet-600 text-white cursor-pointer data-[state=active]:text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Input
            </TabsTrigger>
            <TabsTrigger
              value="output"
              disabled={!output && !isGenerating}
              className="data-[state=active]:bg-violet-600 text-white cursor-pointer data-[state=active]:text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              <BookOpen className="w-4 h-4" />
              {isGenerating ? "AI Generating..." : "Blog Post"}
              {!output && !isGenerating && (
                <Badge
                  variant="outline"
                  className="text-xs border-gray-600 text-gray-500 ml-2"
                >
                  Generate first
                </Badge>
              )}
              {isGenerating && (
                <Badge
                  variant="outline"
                  className="text-xs border-violet-500 text-violet-300 ml-2 animate-pulse"
                >
                  Live
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Input Tab */}
          <TabsContent value="input" className="focus-within:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Form */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Zap className="w-5 h-5 text-violet-400" />
                      Blog Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="aboutBlog"
                        className="text-gray-300 font-medium"
                      >
                        Blog Topic & Description *
                      </Label>
                      <Textarea
                        id="aboutBlog"
                        placeholder="e.g., This blog explores how AI agents are transforming business workflows and improving productivity in modern organizations..."
                        value={inputs.about_blog}
                        onChange={(e) =>
                          handleInputChange("about_blog", e.target.value)
                        }
                        disabled={isGenerating}
                        className="min-h-[200px] bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500/20 resize-none disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                      />
                      <div className="text-sm text-gray-400">
                        {inputs.about_blog.length}/1000 characters
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="category"
                        className="text-gray-300 font-medium"
                      >
                        Category *
                      </Label>
                      <div className="relative">
                        <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="category"
                          placeholder="e.g., Artificial Intelligence, Technology, Marketing"
                          value={inputs.category}
                          onChange={(e) =>
                            handleInputChange("category", e.target.value)
                          }
                          disabled={isGenerating}
                          className="pl-12 bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500/20 h-12 text-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={
                        !isFormValid ||
                        isGenerating ||
                        !user ||
                        user.credits < agentCost
                      }
                      className="w-full bg-gradient-to-r cursor-pointer from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isGenerating ? (
                        <>
                          <div className="flex items-center">
                            <div className="relative mr-3">
                              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 animate-pulse"></div>
                              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 animate-ping opacity-25"></div>
                            </div>
                            <span className="bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent font-medium">
                              AI is thinking...
                            </span>
                          </div>
                        </>
                      ) : !user ? (
                        <>Please sign in to continue</>
                      ) : user.credits < agentCost ? (
                        <>Insufficient credits (₹{user.credits} available)</>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-3" />
                          Generate Blog Post
                        </>
                      )}
                    </Button>

                    {/* Inline Generation Status */}
                    {isGenerating && (
                      <div className="mt-6 p-4 bg-slate-800/30 border border-violet-500/20 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 animate-pulse"></div>
                            <div
                              className="absolute inset-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 animate-pulse"
                              style={{ animationDelay: "0.5s" }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-white animate-pulse" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-violet-300 font-medium text-sm">
                              {thinkingMessage ||
                                "AI is generating your blog post..."}
                            </p>
                            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                              <div
                                className="bg-gradient-to-r from-violet-600 to-purple-600 h-1.5 rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${Math.min(
                                    ((generationStep + 1) /
                                      thinkingMessages.length) *
                                      100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                          <span>💡 Switch to</span>
                          <button
                            onClick={() => setActiveTab("output")}
                            className="text-violet-400 hover:text-violet-300 underline font-medium transition-colors"
                          >
                            Output tab
                          </button>
                          <span>to watch live progress</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Features Card */}
              <div>
                <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Eye className="w-5 h-5 text-emerald-400" />
                      Blog Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          icon: <PenTool className="w-4 h-4" />,
                          text: "AI-Powered Content",
                          color: "text-blue-400",
                        },
                        {
                          icon: <BookOpen className="w-4 h-4" />,
                          text: "SEO Optimized",
                          color: "text-purple-400",
                        },
                        {
                          icon: <Target className="w-4 h-4" />,
                          text: "Category Focused",
                          color: "text-emerald-400",
                        },
                        {
                          icon: <Sparkles className="w-4 h-4" />,
                          text: "Ready to Publish",
                          color: "text-orange-400",
                        },
                        {
                          icon: <Copy className="w-4 h-4" />,
                          text: "Easy Export",
                          color: "text-cyan-400",
                        },
                        {
                          icon: <Zap className="w-4 h-4" />,
                          text: "Fast Generation",
                          color: "text-yellow-400",
                        },
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/30 transition-colors"
                        >
                          <div className={`${feature.color}`}>
                            {feature.icon}
                          </div>
                          <span className="text-gray-300 text-sm">
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Output Tab */}
          <TabsContent value="output">
            {output ? (
              <div className="space-y-8">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Generated Blog Post
                    </h2>
                    <p className="text-gray-400">
                      AI-powered content for {inputs.category}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(output.content)}
                      className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => exportBlog()}
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export DOCX
                      {output?.image && (
                        <Badge className="ml-2 bg-emerald-600/20 text-emerald-300 text-xs">
                          +Image
                        </Badge>
                      )}
                    </Button>
                  </div>
                </div>

                <BlogPostDisplay blogData={output} />
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="py-16">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    {isGenerating ? (
                      <>
                        {/* Compact Generation State */}
                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-white animate-pulse" />
                          <div
                            className="absolute inset-0 rounded-full border-2 border-dashed border-violet-300/30 animate-spin"
                            style={{ animationDuration: "3s" }}
                          ></div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-violet-300 mb-2">
                            AI is Creating Your Blog Post
                          </h3>
                          <p className="text-violet-400/80 max-w-md leading-relaxed mb-4">
                            {thinkingMessage ||
                              "Analyzing your topic and generating engaging content..."}
                          </p>
                          <div className="w-64 bg-slate-800 rounded-full h-2 mx-auto">
                            <div
                              className="bg-gradient-to-r from-violet-600 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                              style={{
                                width: `${Math.min(
                                  ((generationStep + 1) /
                                    thinkingMessages.length) *
                                    100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            {Math.min(
                              Math.round(
                                ((generationStep + 1) /
                                  thinkingMessages.length) *
                                  100
                              ),
                              100
                            )}
                            % complete
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          💡 Generation in progress - stay on this tab to watch!
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Empty State */}
                        <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-400 mb-2">
                            Ready to Create Amazing Content
                          </h3>
                          <p className="text-gray-500 max-w-md leading-relaxed">
                            Enter your blog topic and category to generate
                            high-quality, AI-powered content ready for
                            publishing.
                          </p>
                        </div>
                        <Button
                          onClick={() => setActiveTab("input")}
                          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Start Creating
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* History Sliding Panel */}
      {isHistoryPanelOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsHistoryPanelOpen(false)}
          />

          {/* Sliding Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              {/* Panel Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-violet-400" />
                  <h2 className="text-xl font-bold text-white">Blog History</h2>
                  {executionHistory.length > 0 && (
                    <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                      {executionHistory.length} posts
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsHistoryPanelOpen(false)}
                  className="text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                      <span className="text-gray-400">Loading history...</span>
                    </div>
                  </div>
                ) : executionHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                      <History className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">
                      No Blog History
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Your blog post generations will appear here. Create your
                      first blog post to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {executionHistory.map((execution) => (
                      <Card
                        key={execution.id}
                        className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/50 hover:border-violet-500/30 transition-all duration-200"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(execution.status)}
                              <div>
                                <p
                                  className={`font-medium text-sm ${getStatusColor(
                                    execution.status
                                  )}`}
                                >
                                  {execution.status.charAt(0).toUpperCase() +
                                    execution.status.slice(1)}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(
                                    execution.created_at
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-slate-700/50 text-gray-300 border-slate-600 text-xs">
                              {execution.cost_deducted} Credits
                            </Badge>
                          </div>

                          {execution.input_data && (
                            <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                              <div className="space-y-2">
                                <div>
                                  <span className="text-xs text-gray-400">
                                    Topic:
                                  </span>
                                  <p className="text-white text-sm font-medium line-clamp-2">
                                    {execution.input_data.about_blog}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-400">
                                    Category:
                                  </span>
                                  <p className="text-violet-400 text-sm">
                                    {execution.input_data.category}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {execution.status === "completed" &&
                            execution.output_data && (
                              <Button
                                size="sm"
                                onClick={() => viewBlogInModal(execution)}
                                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                              >
                                <Maximize2 className="w-4 h-4 mr-2" />
                                View Blog
                              </Button>
                            )}

                          {execution.error_message && (
                            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-1 mt-2">
                              <div className="flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                <span>Error: {execution.error_message}</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {isModalOpen && selectedBlogForModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal */}
          <div className="absolute inset-4 md:inset-8 lg:inset-16 bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900/50">
                <h2 className="text-xl font-bold text-white">
                  Blog Post Preview
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <BlogPostDisplay blogData={selectedBlogForModal} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogAgentPage;
