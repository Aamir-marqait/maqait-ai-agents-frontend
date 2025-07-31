import { useState } from "react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, Bot, ArrowRight } from "lucide-react";

const agents = [
  {
    id: 1,
    gradient: "from-violet-500 to-purple-600",
    name: "Blog Agent",
    category: "Content Generation",
    description:
      "Your in-house columnist with a PhD in brand tone, creating human-like blogs.",
    thumbnail: "/1.png",
    tags: ["blogging", "content", "writing"],
    icon: (
      <img
        src="/agent-logo/1.png"
        alt="Blog Agent"
        className="w-14 h-14"
      />
    ),
    credits: 20,
  },
  {
    id: 2,
    name: "Social Media Post Generator",
    category: "Social Media",
    description:
      "Crafts intelligent, sharp, and platform-ready content for LinkedIn and Twitter.",
    thumbnail: "/agent-logo/2.png",
    tags: ["social media", "linkedin", "twitter"],
    icon: (
      <img
        src="/agent-logo/2.png"
        alt="Blog Agent"
        className="w-14 h-14"
      />
    ),
    credits: 15,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: 3,
    name: "Campaign Strategy Agent",
    category: "Marketing",
    description:
      "Builds data-driven marketing strategies for precise and effective campaigns.",
    thumbnail: "/agent-logo/3.png",
    tags: ["marketing", "strategy", "campaigns"],
    icon: (
      <img
        src="/agent-logo/3.png"
        alt="Blog Agent"
        className="w-14 h-14"
      />
    ),
    credits: 25,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: 4,
    name: "Competitor Analysis Agent",
    category: "Business Intelligence",
    description:
      "Tracks competitors to spot market gaps and keep you two steps ahead.",
    thumbnail: "/agent-logo/4.png",
    tags: ["business", "competitors", "analysis"],
    icon: (
      <img
        src="/agent-logo/4.png"
        alt="Blog Agent"
        className="w-14 h-14"
      />
    ),
    credits: 20,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 5,
    name: "Audience Research Agent",
    category: "Marketing",
    description:
      "Segments your audience and builds personas to help you speak their language.",
    thumbnail: "/agent-logo/5.png",
    tags: ["marketing", "audience", "research"],
    icon: (
      <img
        src="/agent-logo/5.png"
        alt="Blog Agent"
        className="w-14 h-14"
      />
    ),
    credits: 15,
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: 6,
    name: "Copy Optimization Agent",
    category: "Content Generation",
    description:
      "Sharpens your existing copy to be more persuasive and conversion-focused.",
    thumbnail: "/agent-logo/6.png",
    tags: ["copywriting", "optimization", "conversion"],
    icon: (
      <img
        src="/agent-logo/6.png"
        alt="Blog Agent"
        className="w-14 h-14"
      />
    ),
    credits: 10,
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    id: 7,
    name: "SEO Analysis Agent",
    category: "SEO",
    description:
      "Fixes technical SEO issues, optimizes content, and boosts your SERP rankings.",
    thumbnail: "/agent-logo/7.png",
    tags: ["seo", "technical", "ranking"],
    icon: (
      <img
        src="/agent-logo/7.png"
        alt="Blog Agent"
        className="w-14 h-14"
      />
    ),
    credits: 20,
    gradient: "from-green-500 to-emerald-600",
  },
];

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
  const navigate = useNavigate();

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              // variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-violet-600 hover:bg-violet-700 text-white whitespace-nowrap "
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
            onClick={() => {
              const agentRoutes: Record<number, string> = {
                1: '/agents/blog-agent',
                2: '/agents/social-media-post-generator',
                3: '/agents/campaign-strategy-agent',
                4: '/agents/competitor-analysis-agent', 
                5: '/agents/audience-research-agent',
                6: '/agents/copy-optimization-agent',
                7: '/agents/seo-analysis-agent'
              };
              navigate(agentRoutes[agent.id] || `/agents/${agent.id}`);
            }}
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
                    {agent.name.split(" ").map((word, index) => (
                      <span key={index} className="block">
                        {word}
                      </span>
                    ))}
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

      {filteredAgents.length === 0 && (
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
