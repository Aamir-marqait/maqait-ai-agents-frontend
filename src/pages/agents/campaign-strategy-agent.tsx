import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Copy,
  Download,
  Loader2,
  Target,
  Users,
  Calendar,
  Zap,
  FileText,
  Edit3,
  Building,
  Globe,
  History,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Eye,
  Clock,
  Share2,
  TrendingUp,
  Lightbulb,
  Rocket,
  MessageCircle,
  DollarSign,
  Star,
  Trophy,
  Megaphone,
  Activity,
  BarChart3,
  MapPin,
  Briefcase,
  Play,
  Pause,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiClient } from "../../lib/apiClient";
import { useAuth } from "../../contexts/AuthContext";

interface CampaignInputs {
  company_name: string;
  company_website: string;
  platform: string;
  start_date: string;
  end_date: string;
  objective: string;
}

interface AgentExecution {
  id: string;
  user_id: string;
  agent_id: string;
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
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

const platformOptions = [
  { 
    value: "linkedin", 
    label: "LinkedIn", 
    icon: "💼",
    description: "Professional networking & B2B targeting",
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30"
  },
  { 
    value: "twitter", 
    label: "Twitter", 
    icon: "🐦",
    description: "Real-time engagement & thought leadership",
    color: "bg-sky-500/20 text-sky-300 border-sky-500/30"
  },
  { 
    value: "facebook", 
    label: "Facebook", 
    icon: "📘",
    description: "Broad audience reach & community building",
    color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
  },
  { 
    value: "instagram", 
    label: "Instagram", 
    icon: "📸",
    description: "Visual storytelling & brand awareness",
    color: "bg-pink-500/20 text-pink-300 border-pink-500/30"
  },
];

const objectiveOptions = [
  { 
    value: "awareness", 
    label: "Brand Awareness", 
    icon: "👁️",
    description: "Increase brand visibility and recognition",
    color: "bg-purple-500/20 text-purple-300 border-purple-500/30"
  },
  { 
    value: "lead generation", 
    label: "Lead Generation", 
    icon: "🎯",
    description: "Capture high-quality leads and prospects",
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
  },
  { 
    value: "engagement", 
    label: "Engagement", 
    icon: "💬",
    description: "Drive interactions and community building",
    color: "bg-orange-500/20 text-orange-300 border-orange-500/30"
  },
  { 
    value: "sales", 
    label: "Sales & Conversions", 
    icon: "💰",
    description: "Drive direct sales and revenue growth",
    color: "bg-green-500/20 text-green-300 border-green-500/30"
  },
];

const CampaignStrategyAgentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUserProfile } = useAuth();
  
  const [agent, setAgent] = useState<Agent | null>(location.state?.agent || null);
  const [agentId, setAgentId] = useState<string>(location.state?.agentId || "");
  
  const [inputs, setInputs] = useState<CampaignInputs>({
    company_name: "",
    company_website: "",
    platform: "",
    start_date: "",
    end_date: "",
    objective: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("input");
  const [executionHistory, setExecutionHistory] = useState<AgentExecution[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find campaign generator agent if not passed via navigation
  useEffect(() => {
    const findCampaignAgent = async () => {
      if (!agent || !agentId) {
        try {
          const response = await apiClient.get('/api/v0/agents/');
          const agents = response.data;
          const campaignAgent = agents.find((a: any) => a.name === 'Campaign Generator');
          if (campaignAgent) {
            setAgent(campaignAgent);
            setAgentId(campaignAgent.id);
          }
        } catch (error) {
          console.error('Error finding agent:', error);
          setError('Failed to load agent information');
        }
      }
    };

    findCampaignAgent();
  }, [agent, agentId]);

  // Auto-fetch execution history when component loads or agentId changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!agentId) return;
      
      try {
        setLoadingHistory(true);
        const response = await apiClient.get('/api/v0/agents/executions/history', {
          params: { limit: 20, offset: 0 }
        });
        
        const agentHistory = response.data.filter((execution: AgentExecution) => 
          execution.agent_id === agentId
        );
        setExecutionHistory(agentHistory);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [agentId]);

  const handleInputChange = (field: keyof CampaignInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!isFormValid || !agentId) return;

    setIsGenerating(true);
    setError(null);
    
    try {
      // Use the special executeAgent method with extended timeout
      const response = await apiClient.executeAgent(`/api/v0/agents/${agentId}/execute`, inputs);
      const executionId = response.data.execution_id;
      
      // If result is immediately available
      if (response.data.result) {
        let parsedOutput = response.data.result;
        
        if (parsedOutput.output) {
          setOutput(parsedOutput.output);
        } else {
          setOutput(parsedOutput);
        }
        
        setActiveTab("output");
        await refreshUserProfile();
        setIsGenerating(false);
        return;
      }
      
      // Fallback: Poll for the result if not immediately available
      const pollResult = async () => {
        try {
          const historyResponse = await apiClient.get('/api/v0/agents/executions/history', {
            params: { limit: 50, offset: 0 }
          });
          
          const latestExecution = historyResponse.data.find((ex: AgentExecution) => ex.id === executionId);
          
          if (latestExecution) {
            if (latestExecution.status === 'completed' && latestExecution.output_data) {
              let outputData = latestExecution.output_data;
              
              if (typeof outputData === 'string') {
                outputData = JSON.parse(outputData);
              }
              
              let parsedOutput;
              if (outputData.output) {
                parsedOutput = typeof outputData.output === 'string' 
                  ? outputData.output
                  : outputData.output;
              } else {
                parsedOutput = outputData;
              }
              
              setOutput(parsedOutput);
              setActiveTab("output");
              await refreshUserProfile();
              setIsGenerating(false);
              
              // Refresh history
              const updatedHistory = await apiClient.get('/api/v0/agents/executions/history', {
                params: { limit: 20, offset: 0 }
              });
              const agentHistory = updatedHistory.data.filter((execution: AgentExecution) => 
                execution.agent_id === agentId
              );
              setExecutionHistory(agentHistory);
              
            } else if (latestExecution.status === 'failed') {
              setError(latestExecution.error_message || 'Generation failed');
              setIsGenerating(false);
            } else {
              setTimeout(pollResult, 3000);
            }
          } else {
            setTimeout(pollResult, 3000);
          }
        } catch (pollError) {
          console.error('Error polling result:', pollError);
          setError('Failed to get results');
          setIsGenerating(false);
        }
      };
      
      setTimeout(pollResult, 1000);
      
    } catch (error: any) {
      console.error("Generation failed:", error);
      let errorMessage = 'Failed to generate campaign strategy';
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. The campaign is still being generated. Please check your history in a few moments.';
      } else if (error.response?.status === 402) {
        errorMessage = 'Insufficient credits to run this agent';
      } else if (error.response?.status === 404) {
        errorMessage = 'Agent not found';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      setError(errorMessage);
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportStrategy = async () => {
    if (!output) return;

    const content = `CAMPAIGN STRATEGY REPORT
Company: ${inputs.company_name}
Website: ${inputs.company_website}
Platform: ${inputs.platform}
Campaign Objective: ${inputs.objective}
Start Date: ${inputs.start_date}
End Date: ${inputs.end_date}
Generated: ${new Date().toLocaleDateString()}

${output}

---
Generated by AI Campaign Strategy Agent`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${inputs.company_name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_campaign_strategy.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400';
      case 'failed':
        return 'text-red-400';
      case 'running':
        return 'text-blue-400';
      default:
        return 'text-amber-400';
    }
  };

  const isFormValid = 
    inputs.company_name.trim() && 
    inputs.company_website.trim() && 
    inputs.platform && 
    inputs.start_date && 
    inputs.end_date && 
    inputs.objective;

  const agentCost = agent ? Math.round(parseFloat(agent.cost_per_run)) : 40;

  const campaignDuration = inputs.start_date && inputs.end_date 
    ? Math.ceil((new Date(inputs.end_date).getTime() - new Date(inputs.start_date).getTime()) / (1000 * 3600 * 24))
    : 0;

  const selectedPlatform = platformOptions.find(p => p.value === inputs.platform);
  const selectedObjective = objectiveOptions.find(o => o.value === inputs.objective);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agents
          </Button>
          
          <div className="flex items-center gap-3">
            {user && (
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3 py-1">
                ₹{user.credits} credits
              </Badge>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative mb-10">
          <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 shadow-lg">
                    <Megaphone className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-3">
                    Campaign Strategy Generator
                  </h1>
                  <p className="text-gray-400 text-lg max-w-2xl leading-relaxed mb-4">
                    Create comprehensive marketing campaigns with AI-powered strategy, timeline planning, and platform-specific recommendations
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 px-4 py-2 text-sm font-medium">
                      ₹{agentCost} per campaign
                    </Badge>
                    <Badge variant="outline" className="border-slate-600 text-slate-300 px-3 py-1">
                      <Clock className="w-3 h-3 mr-1" />
                      60-90s generation
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="text-right space-y-2">
                  <div className="text-3xl font-bold text-white">{executionHistory.length}</div>
                  <div className="text-xs text-gray-400">Campaigns Created</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-500/10 via-red-600/5 to-red-500/10 border border-red-500/30 rounded-xl p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-400 mt-0.5" />
                <div>
                  <p className="text-red-300 font-semibold mb-1">Campaign Generation Failed</p>
                  <p className="text-red-400/80 text-sm leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-slate-900/50 border border-slate-700/50 p-1.5 rounded-xl backdrop-blur-sm">
            <TabsTrigger 
              value="input" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium"
            >
              <Edit3 className="w-4 h-4" />
              Campaign Builder
            </TabsTrigger>
            <TabsTrigger 
              value="output" 
              disabled={!output}
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2 px-6 py-3 rounded-lg transition-all disabled:opacity-50 font-medium"
            >
              <Rocket className="w-4 h-4" />
              Strategy
              {!output && (
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-500 ml-2">
                  Generate first
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium"
            >
              <History className="w-4 h-4" />
              Campaign History
              {executionHistory.length > 0 && (
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-400 ml-2">
                  {executionHistory.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Input Tab */}
          <TabsContent value="input">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Main Form */}
              <div className="xl:col-span-3">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm shadow-xl">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-white text-xl">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <Zap className="w-5 h-5 text-blue-400" />
                      </div>
                      Campaign Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Company Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Building className="w-5 h-5 text-blue-400" />
                        Company Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="companyName" className="text-gray-300 font-medium flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Company Name *
                          </Label>
                          <Input
                            id="companyName"
                            placeholder="e.g., Marqait Technologies"
                            value={inputs.company_name}
                            onChange={(e) => handleInputChange("company_name", e.target.value)}
                            className="bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg transition-all"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="companyWebsite" className="text-gray-300 font-medium flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Company Website *
                          </Label>
                          <Input
                            id="companyWebsite"
                            placeholder="e.g., www.marqait.com"
                            value={inputs.company_website}
                            onChange={(e) => handleInputChange("company_website", e.target.value)}
                            className="bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Platform Selection */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-purple-400" />
                        Target Platform *
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {platformOptions.map((platform) => (
                          <div
                            key={platform.value}
                            onClick={() => handleInputChange("platform", platform.value)}
                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                              inputs.platform === platform.value
                                ? `${platform.color} shadow-lg`
                                : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{platform.icon}</span>
                              <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">{platform.label}</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">{platform.description}</p>
                              </div>
                            </div>
                            {inputs.platform === platform.value && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="w-5 h-5 text-blue-400" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Campaign Timeline */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-400" />
                        Campaign Timeline
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="startDate" className="text-gray-300 font-medium">
                            Start Date *
                          </Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={inputs.start_date}
                            onChange={(e) => handleInputChange("start_date", e.target.value)}
                            className="bg-slate-800/50 border-slate-600/50 text-white focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="endDate" className="text-gray-300 font-medium">
                            End Date *
                          </Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={inputs.end_date}
                            onChange={(e) => handleInputChange("end_date", e.target.value)}
                            className="bg-slate-800/50 border-slate-600/50 text-white focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg"
                          />
                        </div>
                      </div>
                      {campaignDuration > 0 && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                          <p className="text-blue-300 text-sm font-medium">
                            Campaign Duration: {campaignDuration} days
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Campaign Objective */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-emerald-400" />
                        Campaign Objective *
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {objectiveOptions.map((objective) => (
                          <div
                            key={objective.value}
                            onClick={() => handleInputChange("objective", objective.value)}
                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                              inputs.objective === objective.value
                                ? `${objective.color} shadow-lg`
                                : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{objective.icon}</span>
                              <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">{objective.label}</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">{objective.description}</p>
                              </div>
                            </div>
                            {inputs.objective === objective.value && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <div className="pt-6">
                      <Button
                        onClick={handleGenerate}
                        disabled={!isFormValid || isGenerating || !user || user.credits < agentCost}
                        className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 text-white font-semibold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                            Creating Your Campaign Strategy...
                          </>
                        ) : !user ? (
                          <>Please sign in to continue</>
                        ) : user.credits < agentCost ? (
                          <>Insufficient credits (₹{user.credits} available)</>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-3" />
                            Generate Campaign Strategy
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Strategy Preview */}
                <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Eye className="w-5 h-5 text-emerald-400" />
                      Strategy Includes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { icon: <Building className="w-4 h-4" />, text: "Company Analysis", color: "text-blue-400" },
                        { icon: <Target className="w-4 h-4" />, text: "Objective Breakdown", color: "text-purple-400" },
                        { icon: <Users className="w-4 h-4" />, text: "Audience Segmentation", color: "text-emerald-400" },
                        { icon: <Calendar className="w-4 h-4" />, text: "Phased Timeline", color: "text-orange-400" },
                        { icon: <MessageCircle className="w-4 h-4" />, text: "Content Strategy", color: "text-cyan-400" },
                        { icon: <BarChart3 className="w-4 h-4" />, text: "Performance Metrics", color: "text-yellow-400" },
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                          <div className={`${feature.color}`}>
                            {feature.icon}
                          </div>
                          <span className="text-gray-300 text-sm font-medium">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Current Selection Summary */}
                {(inputs.platform || inputs.objective) && (
                  <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-white text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        Current Selection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedPlatform && (
                        <div className="flex items-center gap-2">
                          <span>{selectedPlatform.icon}</span>
                          <span className="text-white text-sm font-medium">{selectedPlatform.label}</span>
                        </div>
                      )}
                      {selectedObjective && (
                        <div className="flex items-center gap-2">
                          <span>{selectedObjective.icon}</span>
                          <span className="text-white text-sm font-medium">{selectedObjective.label}</span>
                        </div>
                      )}
                      {campaignDuration > 0 && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-400" />
                          <span className="text-white text-sm font-medium">{campaignDuration} days</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Quick Stats */}
                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-emerald-400">₹{agentCost}</div>
                      <div className="text-xs text-gray-400">Cost per Campaign</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Output Tab */}
          <TabsContent value="output">
            {isGenerating ? (
              <Card className="bg-slate-900/50 border-slate-700/50 shadow-xl">
                <CardContent className="py-20">
                  <div className="flex flex-col items-center justify-center space-y-8">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 animate-pulse"></div>
                      <Loader2 className="w-12 h-12 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                    </div>
                    <div className="text-center space-y-3">
                      <p className="text-2xl font-bold text-white">
                        Crafting Your Campaign Strategy
                      </p>
                      <p className="text-gray-400 max-w-lg leading-relaxed">
                        Our AI is analyzing market trends, audience behavior, and platform dynamics to create your personalized campaign strategy
                      </p>
                    </div>
                    <div className="grid grid-cols-4 gap-6 w-full max-w-lg">
                      {[
                        { label: "Analysis", icon: <BarChart3 className="w-4 h-4" /> },
                        { label: "Targeting", icon: <Target className="w-4 h-4" /> },
                        { label: "Timeline", icon: <Calendar className="w-4 h-4" /> },
                        { label: "Strategy", icon: <Rocket className="w-4 h-4" /> }
                      ].map((step, index) => (
                        <div key={index} className="text-center">
                          <div className="w-3 h-3 bg-blue-400 rounded-full mx-auto mb-2 animate-pulse" style={{ animationDelay: `${index * 0.2}s` }}></div>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {step.icon}
                          </div>
                          <p className="text-xs text-gray-500">{step.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : output ? (
              <div className="space-y-8">
                {/* Strategy Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Campaign Strategy Report</h2>
                    <p className="text-gray-400 text-lg">Comprehensive strategy for {inputs.company_name}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(output)}
                      className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Strategy
                    </Button>
                    <Button
                      size="sm"
                      onClick={exportStrategy}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>

                {/* Campaign Overview Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                          <Building className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Company</p>
                          <p className="text-lg font-bold text-white">{inputs.company_name}</p>
                          <p className="text-xs text-gray-400">Target Organization</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                          <Share2 className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Platform</p>
                          <p className="text-lg font-bold text-white">{inputs.platform.charAt(0).toUpperCase() + inputs.platform.slice(1)}</p>
                          <p className="text-xs text-gray-400">Primary Channel</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/20">
                          <Target className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Objective</p>
                          <p className="text-lg font-bold text-white">{inputs.objective.charAt(0).toUpperCase() + inputs.objective.slice(1)}</p>
                          <p className="text-xs text-gray-400">Campaign Goal</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/20">
                          <Calendar className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Duration</p>
                          <p className="text-lg font-bold text-white">{campaignDuration} days</p>
                          <p className="text-xs text-gray-400">Campaign Length</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Complete Strategy Display */}
                <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border-slate-700/50 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white text-xl">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <Rocket className="w-6 h-6 text-blue-400" />
                      </div>
                      Complete Campaign Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/30">
                      <div className="prose prose-invert prose-blue max-w-none">
                        <div className="whitespace-pre-wrap text-gray-300 leading-relaxed text-base">
                          {output}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Strategy Metadata */}
                <Card className="bg-slate-900/30 border-slate-700/30">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Generated: {new Date().toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Platform: {inputs.platform}
                        </span>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          AI Generated Strategy
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-slate-700/50 shadow-xl">
                <CardContent className="py-20">
                  <div className="flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-700/50 flex items-center justify-center">
                      <Rocket className="w-12 h-12 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-400 mb-3">
                        Ready to Build Your Campaign
                      </h3>
                      <p className="text-gray-500 max-w-md leading-relaxed">
                        Configure your campaign details to receive a comprehensive marketing strategy
                        with timeline, audience targeting, and content recommendations.
                      </p>
                    </div>
                    <Button
                      onClick={() => setActiveTab("input")}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3"
                      size="lg"
                    >
                      <Edit3 className="w-5 h-5 mr-2" />
                      Start Campaign Planning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="bg-slate-900/50 border-slate-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <History className="w-6 h-6 text-blue-400" />
                  </div>
                  Campaign History
                  {executionHistory.length > 0 && (
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {executionHistory.length} campaigns
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                      <span className="text-gray-400">Loading campaign history...</span>
                    </div>
                  </div>
                ) : executionHistory.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-6">
                      <History className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400 mb-3">No Campaign History</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">
                      Your campaign strategy executions will appear here. Create your first campaign to get started.
                    </p>
                    <Button
                      onClick={() => setActiveTab("input")}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3"
                      size="lg"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create First Campaign
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {executionHistory.map((execution) => (
                      <Card key={execution.id} className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                              {getStatusIcon(execution.status)}
                              <div>
                                <p className={`font-bold text-lg ${getStatusColor(execution.status)}`}>
                                  {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {new Date(execution.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge className="bg-slate-700/50 text-gray-300 border-slate-600 px-3 py-1">
                                ₹{execution.cost_deducted}
                              </Badge>
                              {execution.execution_time_seconds && (
                                <Badge variant="outline" className="border-gray-600 text-gray-400">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {execution.execution_time_seconds}s
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {execution.input_data && (
                            <div className="bg-slate-800/50 rounded-lg p-5 mb-6 border border-slate-700/30">
                              <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Campaign Configuration
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-slate-700/30 rounded-lg p-3">
                                  <span className="text-xs text-gray-400 block mb-1">Company</span>
                                  <p className="text-white font-medium">{execution.input_data.company_name}</p>
                                </div>
                                <div className="bg-slate-700/30 rounded-lg p-3">
                                  <span className="text-xs text-gray-400 block mb-1">Platform</span>
                                  <p className="text-blue-400 font-medium">{execution.input_data.platform}</p>
                                </div>
                                <div className="bg-slate-700/30 rounded-lg p-3">
                                  <span className="text-xs text-gray-400 block mb-1">Objective</span>
                                  <p className="text-white font-medium">{execution.input_data.objective}</p>
                                </div>
                              </div>
                              {execution.input_data.start_date && execution.input_data.end_date && (
                                <div className="bg-slate-700/30 rounded-lg p-3">
                                  <span className="text-xs text-gray-400 block mb-1">Campaign Duration</span>
                                  <p className="text-gray-300 font-medium">
                                    {execution.input_data.start_date} to {execution.input_data.end_date}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {execution.status === 'completed' && execution.output_data && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    try {
                                      const outputData = typeof execution.output_data === 'string' 
                                        ? JSON.parse(execution.output_data) 
                                        : execution.output_data;
                                      
                                      let parsedOutput;
                                      if (outputData.output) {
                                        parsedOutput = typeof outputData.output === 'string' 
                                          ? outputData.output
                                          : outputData.output;
                                      } else {
                                        parsedOutput = outputData;
                                      }
                                      
                                      setOutput(parsedOutput);
                                      setInputs({
                                        company_name: execution.input_data.company_name || "",
                                        company_website: execution.input_data.company_website || "",
                                        platform: execution.input_data.platform || "",
                                        start_date: execution.input_data.start_date || "",
                                        end_date: execution.input_data.end_date || "",
                                        objective: execution.input_data.objective || "",
                                      });
                                      setActiveTab("output");
                                    } catch (error) {
                                      console.error('Error parsing output:', error);
                                    }
                                  }}
                                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Strategy
                                </Button>
                              )}
                              
                              {execution.status === 'completed' && execution.output_data && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    try {
                                      const outputData = typeof execution.output_data === 'string' 
                                        ? JSON.parse(execution.output_data) 
                                        : execution.output_data;
                                      copyToClipboard(JSON.stringify(outputData, null, 2));
                                    } catch (error) {
                                      console.error('Error copying output:', error);
                                    }
                                  }}
                                  className="border-slate-600 text-gray-300 hover:bg-slate-800"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                              )}
                            </div>
                            
                            {execution.error_message && (
                              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                                <div className="flex items-center gap-2">
                                  <XCircle className="w-4 h-4" />
                                  <span>Error: {execution.error_message}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CampaignStrategyAgentPage;