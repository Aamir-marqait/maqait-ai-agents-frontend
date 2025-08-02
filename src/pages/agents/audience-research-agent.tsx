import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Copy,
  Download,
  Loader2,
  Users,
  Target,
  TrendingUp,
  Building,
  Globe,
  User,
  Heart,
  MessageCircle,
  Eye,
  FileText,
  Edit3,
  History,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  BarChart3,
  UserCheck,
  Lightbulb,
  PieChart,
  Brain,
  Sparkles,
  Share2,
  Calendar,
  DollarSign,
  Star,
  Trophy,
  Compass,
  Shield,
  Rocket,
  Map,
  Filter,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiClient } from "../../lib/apiClient";
import { useAuth } from "../../contexts/AuthContext";

interface AudienceResearchInputs {
  company_name: string;
  company_website: string;
  company_niche: string;
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

const AudienceResearchAgentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUserProfile } = useAuth();
  
  const [agent, setAgent] = useState<Agent | null>(location.state?.agent || null);
  const [agentId, setAgentId] = useState<string>(location.state?.agentId || "");
  
  const [inputs, setInputs] = useState<AudienceResearchInputs>({
    company_name: "",
    company_website: "",
    company_niche: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("input");
  const [executionHistory, setExecutionHistory] = useState<AgentExecution[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find audience analysis agent if not passed via navigation
  useEffect(() => {
    const findAudienceAgent = async () => {
      if (!agent || !agentId) {
        try {
          const response = await apiClient.get('/api/v0/agents/');
          const agents = response.data;
          const audienceAgent = agents.find((a: any) => a.name === 'Audience Analysis');
          if (audienceAgent) {
            setAgent(audienceAgent);
            setAgentId(audienceAgent.id);
          }
        } catch (error) {
          console.error('Error finding agent:', error);
          setError('Failed to load agent information');
        }
      }
    };

    findAudienceAgent();
  }, [agent, agentId]);

  // Fetch execution history for this specific agent
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

    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab, agentId]);

  const handleInputChange = (field: keyof AudienceResearchInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!isFormValid || !agentId) return;

    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await apiClient.post(`/api/v0/agents/${agentId}/execute`, inputs);
      const executionId = response.data.execution_id;
      
      // If result is immediately available
      if (response.data.result) {
        setOutput(response.data.result);
        setActiveTab("output");
        await refreshUserProfile();
        setIsGenerating(false);
        return;
      }
      
      // Poll for the result
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
                  ? JSON.parse(outputData.output) 
                  : outputData.output;
              } else {
                parsedOutput = outputData;
              }
              
              setOutput(parsedOutput);
              setActiveTab("output");
              await refreshUserProfile();
              setIsGenerating(false);
              
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
      let errorMessage = 'Failed to generate audience research';
      
      if (error.response?.status === 402) {
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

  const exportResearch = async () => {
    if (!output) return;

    const content = `AUDIENCE RESEARCH REPORT
Company: ${inputs.company_name}
Website: ${inputs.company_website}
Niche: ${inputs.company_niche}
Generated: ${new Date().toLocaleDateString()}

${JSON.stringify(output, null, 2)}

---
Generated by AI Audience Research Agent`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${inputs.company_name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_audience_research.txt`;
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
    inputs.company_niche.trim();

  const agentCost = agent ? Math.round(parseFloat(agent.cost_per_run)) : 35;

  // Helper component for metric cards
  const MetricCard = ({ icon, title, value, subtitle, color = "blue" }: any) => (
    <div className={`bg-gradient-to-br from-${color}-500/10 to-${color}-600/5 border border-${color}-500/20 rounded-xl p-4`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color}-500/20`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">{title}</p>
          <p className="text-lg font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  // Helper component for persona cards
  const PersonaCard = ({ persona, index }: any) => (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 hover:border-orange-500/30 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30">
          <User className="w-6 h-6 text-orange-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-white mb-1">{persona.name}</h4>
          <p className="text-orange-400 font-medium mb-3">{persona.role}</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Age</p>
              <p className="text-white font-semibold">{persona.age}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Region</p>
              <p className="text-white font-semibold">{persona.region}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                Goals
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">{persona.goals}</p>
            </div>

            {persona.painPoints && persona.painPoints.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  Pain Points
                </p>
                <div className="space-y-1">
                  {persona.painPoints.map((pain: string, painIndex: number) => (
                    <div key={painIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-300">{pain}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {persona.activePlatforms && persona.activePlatforms.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-400" />
                  Active Platforms
                </p>
                <div className="flex flex-wrap gap-1">
                  {persona.activePlatforms.map((platform: string, platformIndex: number) => (
                    <Badge key={platformIndex} variant="outline" className="border-blue-500/30 text-blue-300 text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Agents
        </Button>

        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30">
                  <Users className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                    {agent?.name || 'Audience Research Agent'}
                  </h1>
                  <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                    {agent?.description || 'Analyze target audience and provide insights for better engagement'}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 px-3 py-1">
                      ₹{agentCost} per analysis
                    </Badge>
                    {user && (
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-300">
                        Balance: ₹{user.credits}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden lg:flex flex-col gap-2 text-right">
                <div className="text-2xl font-bold text-white">45-60s</div>
                <div className="text-xs text-gray-400">Analysis Time</div>
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
                  <p className="text-red-300 font-medium">Analysis Failed</p>
                  <p className="text-red-400/80 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-700/50 p-1 rounded-xl">
            <TabsTrigger 
              value="input" 
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Input
            </TabsTrigger>
            <TabsTrigger 
              value="output" 
              disabled={!output}
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              <Brain className="w-4 h-4" />
              Analysis
              {!output && (
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-500 ml-2">
                  Run analysis
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            >
              <History className="w-4 h-4" />
              History
              {executionHistory.length > 0 && (
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-400 ml-2">
                  {executionHistory.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Input Tab */}
          <TabsContent value="input">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Form */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Zap className="w-5 h-5 text-orange-400" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="companyName" className="text-gray-300 font-medium">
                        Company Name *
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="companyName"
                          placeholder="e.g., Marqait Technologies"
                          value={inputs.company_name}
                          onChange={(e) => handleInputChange("company_name", e.target.value)}
                          className="pl-12 bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 h-12 text-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="companyWebsite" className="text-gray-300 font-medium">
                        Company Website *
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="companyWebsite"
                          placeholder="e.g., https://marqait.com"
                          value={inputs.company_website}
                          onChange={(e) => handleInputChange("company_website", e.target.value)}
                          className="pl-12 bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 h-12 text-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="companyNiche" className="text-gray-300 font-medium">
                        Company Niche *
                      </Label>
                      <div className="relative">
                        <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="companyNiche"
                          placeholder="e.g., AI-powered business automation"
                          value={inputs.company_niche}
                          onChange={(e) => handleInputChange("company_niche", e.target.value)}
                          className="pl-12 bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 h-12 text-lg"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={!isFormValid || isGenerating || !user || user.credits < agentCost}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Analyzing Audience...
                        </>
                      ) : !user ? (
                        <>Please sign in to continue</>
                      ) : user.credits < agentCost ? (
                        <>Insufficient credits (₹{user.credits} available)</>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-3" />
                          Generate Audience Analysis
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Features Card */}
              <div>
                <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Eye className="w-5 h-5 text-emerald-400" />
                      Analysis Includes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { icon: <Target className="w-4 h-4" />, text: "Ideal Customer Profiles", color: "text-blue-400" },
                        { icon: <User className="w-4 h-4" />, text: "Detailed Buyer Personas", color: "text-purple-400" },
                        { icon: <Brain className="w-4 h-4" />, text: "Psychographic Analysis", color: "text-emerald-400" },
                        { icon: <TrendingUp className="w-4 h-4" />, text: "Strategic Recommendations", color: "text-orange-400" },
                        { icon: <MessageCircle className="w-4 h-4" />, text: "Platform Strategy", color: "text-cyan-400" },
                        { icon: <Lightbulb className="w-4 h-4" />, text: "Competitive Insights", color: "text-yellow-400" },
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
                          <div className={`${feature.color}`}>
                            {feature.icon}
                          </div>
                          <span className="text-gray-300 text-sm">{feature.text}</span>
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
            {isGenerating ? (
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="py-16">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-600 to-red-600 animate-pulse"></div>
                      <Loader2 className="w-10 h-10 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-xl font-semibold text-white">
                        Analyzing Your Target Audience
                      </p>
                      <p className="text-gray-400 max-w-md">
                        Our AI is researching demographics, personas, pain points, and strategic opportunities for your business
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                      {["Demographics", "Personas", "Strategy"].map((step, index) => (
                        <div key={index} className="text-center">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mx-auto mb-2 animate-pulse"></div>
                          <p className="text-xs text-gray-500">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : output ? (
              <div className="space-y-8">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Audience Analysis Report</h2>
                    <p className="text-gray-400">Comprehensive insights for {inputs.company_name}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(output, null, 2))}
                      className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={exportResearch}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Output Display */}
                {output && output.audienceSegmentationReport ? (
                  <div className="space-y-8">
                    {/* Company Overview */}
                    <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border-slate-700/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-white">
                          <div className="p-2 rounded-lg bg-blue-500/20">
                            <Building className="w-5 h-5 text-blue-400" />
                          </div>
                          Company Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="bg-slate-800/50 rounded-xl p-4">
                              <h4 className="text-sm font-medium text-gray-400 mb-2">Company Profile</h4>
                              <div className="space-y-3">
                                <div>
                                  <span className="text-gray-300 text-sm">Name:</span>
                                  <p className="text-white font-semibold">{output.audienceSegmentationReport.companyOverview.name}</p>
                                </div>
                                <div>
                                  <span className="text-gray-300 text-sm">Website:</span>
                                  <p className="text-blue-400 font-medium">{output.audienceSegmentationReport.companyOverview.website}</p>
                                </div>
                                <div>
                                  <span className="text-gray-300 text-sm">Industry:</span>
                                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                    {output.audienceSegmentationReport.companyOverview.niche}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-slate-800/50 rounded-xl p-4">
                              <h4 className="text-sm font-medium text-gray-400 mb-2">Brand Tone</h4>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {output.audienceSegmentationReport.companyOverview.brandTone}
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-slate-800/50 rounded-xl p-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-3">Executive Summary</h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {output.audienceSegmentationReport.companyOverview.summary}
                            </p>
                            
                            {output.audienceSegmentationReport.companyOverview.coreOfferings && (
                              <div className="mt-4">
                                <h5 className="text-xs font-medium text-gray-400 mb-2">Core Offerings</h5>
                                <div className="flex flex-wrap gap-1">
                                  {output.audienceSegmentationReport.companyOverview.coreOfferings.slice(0, 6).map((offering: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                      {offering}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <MetricCard
                        icon={<Users className="w-5 h-5 text-blue-400" />}
                        title="ICPs Identified"
                        value={output.audienceSegmentationReport.idealCustomerProfiles?.length || 0}
                        subtitle="Customer Profiles"
                        color="blue"
                      />
                      <MetricCard
                        icon={<User className="w-5 h-5 text-purple-400" />}
                        title="Personas Created"
                        value={output.audienceSegmentationReport.buyerPersonas?.length || 0}
                        subtitle="Detailed Personas"
                        color="purple"
                      />
                      <MetricCard
                        icon={<Target className="w-5 h-5 text-emerald-400" />}
                        title="Age Ranges"
                        value={output.audienceSegmentationReport.demographicPsychographicTraits?.ageRanges?.length || 0}
                        subtitle="Target Demographics"
                        color="emerald"
                      />
                      <MetricCard
                        icon={<TrendingUp className="w-5 h-5 text-orange-400" />}
                        title="Platforms"
                        value={output.audienceSegmentationReport.platformToneMapping?.length || 0}
                        subtitle="Marketing Channels"
                        color="orange"
                      />
                    </div>

                    {/* Ideal Customer Profiles */}
                    <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border-slate-700/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-white">
                          <div className="p-2 rounded-lg bg-emerald-500/20">
                            <Target className="w-5 h-5 text-emerald-400" />
                          </div>
                          Ideal Customer Profiles
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                            {output.audienceSegmentationReport.idealCustomerProfiles?.length || 0} Profiles
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {output.audienceSegmentationReport.idealCustomerProfiles?.map((icp: any, index: number) => (
                            <div key={index} className="bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-emerald-500/20">
                                  <Building className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-white">{icp.industry}</h4>
                                  <p className="text-emerald-400 text-sm">ICP #{index + 1}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-slate-800/50 rounded-lg p-3">
                                  <p className="text-xs text-gray-400 mb-1">Company Size</p>
                                  <p className="text-white font-semibold text-sm">{icp.companySize}</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3">
                                  <p className="text-xs text-gray-400 mb-1">Region</p>
                                  <p className="text-white font-semibold text-sm">{icp.region}</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3">
                                  <p className="text-xs text-gray-400 mb-1">Age Group</p>
                                  <p className="text-white font-semibold text-sm">{icp.ageGroup}</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3">
                                  <p className="text-xs text-gray-400 mb-1">Budget Sensitivity</p>
                                  <Badge className={`text-xs ${
                                    icp.budgetSensitivity === 'High' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                    icp.budgetSensitivity === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                    'bg-green-500/20 text-green-300 border-green-500/30'
                                  }`}>
                                    {icp.budgetSensitivity}
                                  </Badge>
                                </div>
                              </div>

                              {icp.jobRoles && icp.jobRoles.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium text-gray-300 mb-2">Key Roles</p>
                                  <div className="flex flex-wrap gap-1">
                                    {icp.jobRoles.map((role: string, roleIndex: number) => (
                                      <Badge key={roleIndex} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                        {role}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-300 mb-1">Buying Intent</p>
                                  <p className="text-sm text-gray-300 leading-relaxed">{icp.buyingIntent}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-300 mb-1">Strategic Rationale</p>
                                  <p className="text-sm text-gray-300 leading-relaxed">{icp.rationale}</p>
                                </div>
                              </div>

                              {icp.preferredMarketingPlatforms && icp.preferredMarketingPlatforms.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-700/50">
                                  <p className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    <Share2 className="w-4 h-4 text-blue-400" />
                                    Preferred Platforms
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {icp.preferredMarketingPlatforms.map((platform: string, platformIndex: number) => (
                                      <Badge key={platformIndex} className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                                        {platform}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Buyer Personas */}
                    <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border-slate-700/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-white">
                          <div className="p-2 rounded-lg bg-purple-500/20">
                            <User className="w-5 h-5 text-purple-400" />
                          </div>
                          Detailed Buyer Personas
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {output.audienceSegmentationReport.buyerPersonas?.length || 0} Personas
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {output.audienceSegmentationReport.buyerPersonas?.map((persona: any, index: number) => (
                            <PersonaCard key={index} persona={persona} index={index} />
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Demographics & Psychographics */}
                    <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border-slate-700/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-white">
                          <div className="p-2 rounded-lg bg-cyan-500/20">
                            <BarChart3 className="w-5 h-5 text-cyan-400" />
                          </div>
                          Demographics & Psychographics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            {output.audienceSegmentationReport.demographicPsychographicTraits?.ageRanges && (
                              <div className="bg-slate-800/50 rounded-xl p-4">
                                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                  <Users className="w-4 h-4 text-cyan-400" />
                                  Age Ranges
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {output.audienceSegmentationReport.demographicPsychographicTraits.ageRanges.map((age: string, index: number) => (
                                    <Badge key={index} className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                                      {age}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {output.audienceSegmentationReport.demographicPsychographicTraits?.painPoints && (
                              <div className="bg-slate-800/50 rounded-xl p-4">
                                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-red-400" />
                                  Key Pain Points
                                </h4>
                                <div className="space-y-2">
                                  {output.audienceSegmentationReport.demographicPsychographicTraits.painPoints.map((pain: string, index: number) => (
                                    <div key={index} className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                      <p className="text-sm text-gray-300">{pain}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            {output.audienceSegmentationReport.demographicPsychographicTraits?.conversionTriggers && (
                              <div className="bg-slate-800/50 rounded-xl p-4">
                                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                  <Zap className="w-4 h-4 text-yellow-400" />
                                  Conversion Triggers
                                </h4>
                                <div className="space-y-2">
                                  {output.audienceSegmentationReport.demographicPsychographicTraits.conversionTriggers.map((trigger: string, index: number) => (
                                    <div key={index} className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                      <p className="text-sm text-gray-300">{trigger}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {output.audienceSegmentationReport.demographicPsychographicTraits?.purchaseDrivers && (
                              <div className="bg-slate-800/50 rounded-xl p-4">
                                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-green-400" />
                                  Purchase Drivers
                                </h4>
                                <div className="space-y-2">
                                  {output.audienceSegmentationReport.demographicPsychographicTraits.purchaseDrivers.map((driver: string, index: number) => (
                                    <div key={index} className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                      <p className="text-sm text-gray-300">{driver}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Platform Strategy */}
                    {output.audienceSegmentationReport.platformToneMapping && (
                      <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border-slate-700/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3 text-white">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                              <Share2 className="w-5 h-5 text-blue-400" />
                            </div>
                            Platform & Messaging Strategy
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {output.audienceSegmentationReport.platformToneMapping.map((mapping: any, index: number) => (
                              <div key={index} className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                  <Target className="w-5 h-5 text-blue-400" />
                                  {mapping.segment}
                                </h4>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-300 mb-2">Best Platforms</p>
                                      <div className="flex flex-wrap gap-2">
                                        {mapping.bestPlatforms?.map((platform: string, platformIndex: number) => (
                                          <Badge key={platformIndex} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                            {platform}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <p className="text-sm font-medium text-gray-300 mb-2">Content Format</p>
                                      <p className="text-sm text-gray-300">{mapping.contentFormat}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-300 mb-2">Messaging Tone</p>
                                      <p className="text-sm text-gray-300">{mapping.messagingTone}</p>
                                    </div>
                                    
                                    <div>
                                      <p className="text-sm font-medium text-gray-300 mb-2">Optimal Timing</p>
                                      <Badge variant="outline" className="border-orange-500/30 text-orange-300">
                                        {mapping.optimalPostingTimes}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {mapping.recommendedCampaignTypes && (
                                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                                    <p className="text-sm font-medium text-gray-300 mb-2">Recommended Campaign Types</p>
                                    <div className="flex flex-wrap gap-2">
                                      {mapping.recommendedCampaignTypes.map((campaign: string, campaignIndex: number) => (
                                        <Badge key={campaignIndex} variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                                          {campaign}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Strategic Observations */}
                    <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border-slate-700/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-white">
                          <div className="p-2 rounded-lg bg-yellow-500/20">
                            <Lightbulb className="w-5 h-5 text-yellow-400" />
                          </div>
                          Strategic Insights & Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {output.audienceSegmentationReport.strategicObservations?.bestPerformingSegments && (
                            <div className="bg-slate-800/50 rounded-xl p-4">
                              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-yellow-400" />
                                Top Performing Segments
                              </h4>
                              <div className="space-y-2">
                                {output.audienceSegmentationReport.strategicObservations.bestPerformingSegments.map((segment: string, index: number) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-300">{segment}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {output.audienceSegmentationReport.strategicObservations?.marketingRecommendations && (
                            <div className="bg-slate-800/50 rounded-xl p-4">
                              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                <Rocket className="w-4 h-4 text-orange-400" />
                                Marketing Recommendations
                              </h4>
                              <div className="space-y-2">
                                {output.audienceSegmentationReport.strategicObservations.marketingRecommendations.map((rec: string, index: number) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-300">{rec}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {output.audienceSegmentationReport.strategicObservations?.competitiveAdvantages && (
                            <div className="bg-slate-800/50 rounded-xl p-4">
                              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-400" />
                                Competitive Advantages
                              </h4>
                              <div className="space-y-2">
                                {output.audienceSegmentationReport.strategicObservations.competitiveAdvantages.map((advantage: string, index: number) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-300">{advantage}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {output.audienceSegmentationReport.strategicObservations?.untappedAudiences && (
                            <div className="bg-slate-800/50 rounded-xl p-4">
                              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                <Compass className="w-4 h-4 text-purple-400" />
                                Untapped Opportunities
                              </h4>
                              <div className="space-y-2">
                                {output.audienceSegmentationReport.strategicObservations.untappedAudiences.map((audience: string, index: number) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-300">{audience}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {output.audienceSegmentationReport.strategicObservations?.budgetAllocation && (
                          <div className="mt-6 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-6">
                            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                              <PieChart className="w-5 h-5 text-emerald-400" />
                              Budget Allocation Strategy
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {Object.entries(output.audienceSegmentationReport.strategicObservations.budgetAllocation).map(([priority, channels]: [string, any], index: number) => (
                                <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                                  <h5 className={`text-sm font-medium mb-2 capitalize ${
                                    priority === 'highPriority' ? 'text-green-400' :
                                    priority === 'mediumPriority' ? 'text-yellow-400' :
                                    'text-gray-400'
                                  }`}>
                                    {priority.replace('Priority', ' Priority')}
                                  </h5>
                                  <div className="space-y-1">
                                    {channels.map((channel: string, channelIndex: number) => (
                                      <p key={channelIndex} className="text-xs text-gray-300">{channel}</p>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Analysis Metadata */}
                    {output.audienceSegmentationReport.metadata && (
                      <Card className="bg-slate-900/30 border-slate-700/30">
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Generated: {new Date(output.audienceSegmentationReport.metadata.analysisDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                Source: {output.audienceSegmentationReport.metadata.dataSource}
                              </span>
                              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                                {output.audienceSegmentationReport.metadata.confidenceLevel} Confidence
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card className="bg-slate-900/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white">Raw Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-slate-800/50 rounded-xl p-6">
                        <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed text-sm overflow-auto max-h-96">
                          {JSON.stringify(output, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="py-16">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center">
                      <Brain className="w-10 h-10 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-400 mb-2">
                        Ready to Analyze Your Audience
                      </h3>
                      <p className="text-gray-500 max-w-md leading-relaxed">
                        Enter your company details to receive comprehensive audience research
                        with detailed personas, ICPs, and strategic recommendations.
                      </p>
                    </div>
                    <Button
                      onClick={() => setActiveTab("input")}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Start Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <History className="w-5 h-5 text-orange-400" />
                  </div>
                  Execution History
                  {executionHistory.length > 0 && (
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                      {executionHistory.length} executions
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
                      <span className="text-gray-400">Loading history...</span>
                    </div>
                  </div>
                ) : executionHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                      <History className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">No Analysis History</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Your audience research executions will appear here. Run your first analysis to get started.
                    </p>
                    <Button
                      onClick={() => setActiveTab("input")}
                      className="mt-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Run First Analysis
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {executionHistory.map((execution) => (
                      <Card key={execution.id} className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/50 hover:border-orange-500/30 transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(execution.status)}
                              <div>
                                <p className={`font-semibold ${getStatusColor(execution.status)}`}>
                                  {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {new Date(execution.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge className="bg-slate-700/50 text-gray-300 border-slate-600">
                                ₹{execution.cost_deducted}
                              </Badge>
                              {execution.execution_time_seconds && (
                                <Badge variant="outline" className="border-gray-600 text-gray-400">
                                  {execution.execution_time_seconds}s
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {execution.input_data && (
                            <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                              <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Analysis Input
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                <div>
                                  <span className="text-gray-400">Company:</span>
                                  <p className="text-white font-medium">{execution.input_data.company_name}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400">Website:</span>
                                  <p className="text-blue-400">{execution.input_data.company_website}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400">Niche:</span>
                                  <p className="text-white font-medium">{execution.input_data.company_niche}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
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
                                          ? JSON.parse(outputData.output) 
                                          : outputData.output;
                                      } else {
                                        parsedOutput = outputData;
                                      }
                                      
                                      setOutput(parsedOutput);
                                      setInputs({
                                        company_name: execution.input_data.company_name || "",
                                        company_website: execution.input_data.company_website || "",
                                        company_niche: execution.input_data.company_niche || "",
                                      });
                                      setActiveTab("output");
                                    } catch (error) {
                                      console.error('Error parsing output:', error);
                                    }
                                  }}
                                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Analysis
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
                              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
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

export default AudienceResearchAgentPage;