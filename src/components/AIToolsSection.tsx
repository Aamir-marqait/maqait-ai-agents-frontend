import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const aiTools = [
  {
    icon: <img src="/src/assets/agent-logo/1.png" alt="Blog Agent" className="w-10 h-10" />,
    name: "Blog Agent",
    description:
      "Your in-house columnist with a PhD in brand tone, creating human-like blogs.",
  },
  {
    icon: <img src="/src/assets/agent-logo/2.png" alt="Social Media Post Generator" className="w-10 h-10" />,
    name: "Social Media Post Generator (LinkedIn & Twitter)",
    description:
      "Crafts intelligent, sharp, and platform-ready content for LinkedIn and Twitter.",
  },
  {
    icon: <img src="/src/assets/agent-logo/3.png" alt="Campaign Strategy Agent" className="w-10 h-10" />,
    name: "Campaign Strategy Agent",
    description:
      "Builds data-driven marketing strategies for precise and effective campaigns.",
  },
  {
    icon: <img src="/src/assets/agent-logo/4.png" alt="Competitor Analysis Agent" className="w-10 h-10" />,
    name: "Competitor Analysis Agent",
    description:
      "Tracks competitors to spot market gaps and keep you two steps ahead.",
  },
  {
    icon: <img src="/src/assets/agent-logo/5.png" alt="Audience Research Agent" className="w-10 h-10" />,
    name: "Audience Research Agent",
    description:
      "Segments your audience and builds personas to help you speak their language.",
  },
  {
    icon: <img src="/src/assets/agent-logo/6.png" alt="Copy Optimization Agent" className="w-10 h-10" />,
    name: "Copy Optimization Agent",
    description:
      "Sharpens your existing copy to be more persuasive and conversion-focused.",
  },
  {
    icon: <img src="/src/assets/agent-logo/7.png" alt="SEO Analysis Agent" className="w-10 h-10" />,
    name: "SEO Analysis Agent",
    description:
      "Fixes technical SEO issues, optimizes content, and boosts your SERP rankings.",
  },
];

const AIToolsSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-violet-400">✦</span> Powerful AI Tools
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We've already built 15+ specialized AI agents to help you succeed in
            every aspect of your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((tool, index) => (
            <Card
              key={index}
              className="bg-gray-900/50 border-gray-800 hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 cursor-default"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {tool.icon}
                  <CardTitle className="text-white text-lg">
                    {tool.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIToolsSection;
