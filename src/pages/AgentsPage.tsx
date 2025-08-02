import { useState, useEffect, type ReactElement } from "react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, Bot, ArrowRight, Loader2 } from "lucide-react";
import { apiClient } from "../lib/apiClient";

// Agent interface matching your backend schema
interface Agent {
  id: string;
  name: string;
  description: string;
  agent_type: string;
  cost_per_run: string;
  is_active: boolean;
  n8n_workflow_id: string;
  crew_config: any;
  created_at: string;
  updated_at: string;
}

// UI Agent interface for frontend display
interface UIAgent {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  tags: string[];
  icon: ReactElement;
  credits: number;
  gradient: string;
  route: string;
}

// Agent name to UI mapping (based on your backend agent names)
const agentNameToUI: Record<string, Omit<UIAgent, 'id' | 'name' | 'description' | 'credits' | 'route'>> = {
  'Blog Agent': {
    category: "Content Generation",
    thumbnail: "/card-1.jpg",
    tags: ["blogging", "content", "writing"],
    icon: <img src="/agent-logo/1.png" alt="Blog Agent" className="w-14 h-14" />,
    gradient: "from-violet-500 to-purple-600",
  },
  'Social Media Generator': {
    category: "Social Media", 
    thumbnail: "/card-2.png",
    tags: ["social media", "linkedin", "twitter"],
    icon: <img src="/agent-logo/2.png" alt="Social Media Generator" className="w-14 h-14" />,
    gradient: "from-pink-500 to-rose-600",
  },
  'Campaign Generator': {
    category: "Marketing",
    thumbnail: "/card-3.jpg", 
    tags: ["marketing", "strategy", "campaigns"],
    icon: <img src="/agent-logo/3.png" alt="Campaign Generator" className="w-14 h-14" />,
    gradient: "from-blue-500 to-cyan-600",
  },
  'Competitor Agent': {
    category: "Business Intelligence",
    thumbnail: "/card-4.jpg",
    tags: ["business", "competitors", "analysis"], 
    icon: <img src="/agent-logo/4.png" alt="Competitor Agent" className="w-14 h-14" />,
    gradient: "from-emerald-500 to-teal-600",
  },
  'Audience Analysis': {
    category: "Marketing",
    thumbnail: "/card-5.jpg",
    tags: ["marketing", "audience", "research"],
    icon: <img src="/agent-logo/5.png" alt="Audience Analysis" className="w-14 h-14" />,
    gradient: "from-orange-500 to-red-600",
  },
  'Copy Writer': {
    category: "Content Generation", 
    thumbnail: "/card-6.jpg",
    tags: ["copywriting", "optimization", "conversion"],
    icon: <img src="/agent-logo/6.png" alt="Copy Writer" className="w-14 h-14" />,
    gradient: "from-indigo-500 to-purple-600",
  }
};

// Agent name to route mapping (based on your existing routes)
const agentNameToRoute: Record<string, string> = {
  'Blog Agent': '/agents/blog-agent',
  'Social Media Generator': '/agents/social-media-post-generator', 
  'Campaign Generator': '/agents/campaign-strategy-agent',
  'Competitor Agent': '/agents/competitor-analysis-agent',
  'Audience Analysis': '/agents/audience-research-agent',
  'Copy Writer': '/agents/copy-optimization-agent'
};

const categories = [
  "All",
  "Content Generation", 
  "Social Media",
  "Marketing",
  "Business Intelligence",
  "SEO",
];

import "../flip-card.css";

const AgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [agents, setAgents] = useState<UIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Transform backend agent to UI agent
  const transformAgentToUI = (backendAgent: Agent): UIAgent => {
    const uiConfig = agentNameToUI[backendAgent.name] || {
      category: "Other",
      thumbnail: "/placeholder.svg",
      tags: ["general"],
      icon: <Bot className="w-14 h-14 text-white" />,
      gradient: "from-gray-500 to-gray-600",
    };

    const route = agentNameToRoute[backendAgent.name] || `/agents/${backendAgent.id}`;

    return {
      id: backendAgent.id,
      name: backendAgent.name,
      description: backendAgent.description,
      credits: Math.round(parseFloat(backendAgent.cost_per_run)),
      route,
      ...uiConfig,
    };
  };

  // Fetch agents from API
  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/api/v0/agents/');
      const backendAgents: Agent[] = response.data;
      
      // Transform backend agents to UI format
      const uiAgents = backendAgents
        .filter(agent => agent.is_active) // Only show active agents
        .map(transformAgentToUI);
      
      setAgents(uiAgents);
    } catch (err: any) {
      console.error('Error fetching agents:', err);
      setError(err.response?.data?.detail || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAgentClick = (agent: UIAgent) => {
    // Pass agent information via navigation state for better UX
    navigate(agent.route, {
      state: {
        agentId: agent.id,
        agent: {
          id: agent.id,
          name: agent.name,
          description: agent.description,
          cost_per_run: agent.credits.toString()
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">AI Agents</h1>
            <p className="text-gray-400 mt-1">
              Discover and use powerful AI agents for your projects
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading agents...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">AI Agents</h1>
            <p className="text-gray-400 mt-1">
              Discover and use powerful AI agents for your projects
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Bot className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-400 mb-2">Error loading agents</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button 
              onClick={fetchAgents}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Agents</h1>
          <p className="text-gray-400 mt-1">
            Discover and use powerful AI agents for your projects
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-violet-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-violet-600 hover:bg-violet-700 text-white whitespace-nowrap"
                  : "border-gray-700 text-gray-300 hover:bg-gray-800 whitespace-nowrap cursor-pointer"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="flip-card h-80 rounded-lg cursor-pointer"
            onClick={() => handleAgentClick(agent)}
          >
            <div className="flip-card-inner rounded-lg">
              <div className="flip-card-front relative overflow-hidden rounded-lg">
                <img
                  src={agent.thumbnail || "/placeholder.svg"}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <CardTitle className="text-white text-4xl font-bold">
                    {(() => {
                      const words = agent.name.split(" ");
                      if (words.length <= 2) {
                        return (
                          <>
                            <span className="block">{words[0] || ""}</span>
                            <span className="block">{words[1] || ""}</span>
                          </>
                        );
                      } else {
                        const midPoint = Math.floor(words.length / 2);
                        const firstLine = words.slice(0, midPoint).join(" ");
                        const secondLine = words.slice(midPoint).join(" ");
                        return (
                          <>
                            <span className="block">{firstLine}</span>
                            <span className="block">{secondLine}</span>
                          </>
                        );
                      }
                    })()}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {agent.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs border-gray-600 text-gray-300 bg-black/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-black to-purple-600`}
              >
                <div className="relative w-full h-full p-6 flex flex-col justify-between">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="text-white/90">{agent.icon}</div>
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                      >
                        {agent.category}
                      </Badge>
                    </div>

                    <h3 className="text-white text-xl font-bold mb-3 leading-tight">
                      {agent.name}
                    </h3>

                    <p className="text-white/90 text-sm leading-relaxed mb-4">
                      {agent.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {agent.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-white/30 text-white/80 bg-white/10 backdrop-blur-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <span>₹{agent.credits} per run</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-end">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <span className="text-sm">Get Started</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAgents.length === 0 && !loading && (
        <div className="text-center py-12">
          <Bot className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">
            No agents found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default AgentsPage;