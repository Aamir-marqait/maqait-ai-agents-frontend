import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Coins,
  Bot,
  Activity,
  TrendingUp,
  Clock,
  Zap,
  ImageIcon,
  FileText,
  Video,
} from "lucide-react";

const recentAgents = [
  {
    name: "Content Creator",
    type: "Text Generation",
    lastUsed: "2 hours ago",
    icon: <FileText className="w-5 h-5 text-violet-400" />,
  },
  {
    name: "Image Generator",
    type: "Image Creation",
    lastUsed: "5 hours ago",
    icon: <ImageIcon className="w-5 h-5 text-purple-400" />,
  },
  {
    name: "Video Creator",
    type: "Video Generation",
    lastUsed: "1 day ago",
    icon: <Video className="w-5 h-5 text-violet-400" />,
  },
];

const recentRuns = [
  {
    agent: "Content Creator",
    output: "Blog post about AI marketing trends",
    credits: 15,
    time: "2 hours ago",
    status: "completed",
  },
  {
    agent: "Image Generator",
    output: "Product mockup design",
    credits: 25,
    time: "5 hours ago",
    status: "completed",
  },
  {
    agent: "Design Studio",
    output: "Logo variations",
    credits: 20,
    time: "1 day ago",
    status: "completed",
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Welcome back! Here's your AI workspace overview.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Credits Balance
            </CardTitle>
            <Coins className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">300</div>
            <p className="text-xs text-gray-500 mt-1">+20 from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Agents Used
            </CardTitle>
            <Bot className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Runs
            </CardTitle>
            <Activity className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">47</div>
            <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Success Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">98.5%</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-violet-400" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-gray-400">
            Get started with your most common tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            onClick={() => navigate("/buy-credits")}
          >
            <Coins className="w-4 h-4 mr-2" />
            Buy More Credits
          </Button>
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
            onClick={() => navigate("/agents")}
          >
            <Bot className="w-4 h-4 mr-2" />
            Explore Agents
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Used Agents */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-violet-400" />
              Recently Used Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAgents.map((agent, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {agent.icon}
                  <div>
                    <p className="text-white font-medium">{agent.name}</p>
                    <p className="text-gray-400 text-sm">{agent.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">{agent.lastUsed}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Runs */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-400" />
              Recent Runs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRuns.map((run, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-800/30">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">
                      {run.agent}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {run.output}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-400 border-green-500/30"
                  >
                    {run.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{run.credits} credits used</span>
                  <span>{run.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
