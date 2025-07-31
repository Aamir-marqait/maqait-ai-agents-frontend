import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Copy,
  Download,
  Loader2,
  Search,
  TrendingUp,
  Building,
  Globe,
  Target,
  Users,
  Shield,
  Lightbulb,
  FileText,
  Edit3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CompetitorAnalysisInputs {
  companyName: string;
  companyWebsite: string;
  companyNiche: string;
}

interface CompetitorAnalysisOutput {
  companyOverview: string;
  productServices: string;
  marketPositioning: string;
  directCompetitors: string;
  comparativeAnalysis: string;
  swotAnalysis: string;
  strategicInsights: string;
  fullAnalysis: string;
}

type Tab = "input" | "output";

const CompetitorAnalysisAgentPage = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<CompetitorAnalysisInputs>({
    companyName: "",
    companyWebsite: "",
    companyNiche: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<CompetitorAnalysisOutput | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("input");

  const handleInputChange = (field: keyof CompetitorAnalysisInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;

    setIsGenerating(true);
    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const mockOutput: CompetitorAnalysisOutput = generateCompetitorAnalysis(inputs);
      setOutput(mockOutput);
      // Auto-switch to output tab after generation
      setActiveTab("output");
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCompetitorAnalysis = (inputs: CompetitorAnalysisInputs): CompetitorAnalysisOutput => {
    const { companyName, companyWebsite, companyNiche } = inputs;

    const companyOverview = `**Name:** ${companyName}
**Website:** [${companyWebsite}](https://${companyWebsite.replace(/^https?:\/\//, '')})
**Niche:** ${companyNiche}
**Summary:**  
${companyName} is a ${companyNiche.toLowerCase()} company that focuses on transforming businesses through innovative, data-driven strategies. The company distinguishes itself with a blend of creativity and analytics, offering services that drive tangible business results and meaningful engagement for clients. Their approach aims to go beyond visibility, creating strategic, impactful solutions for their target market.`;

    const productServices = `**Key Offerings:**  
- ${companyNiche} strategy and execution  
- Innovative, data-driven campaigns  
- Customer acquisition and retention solutions  
- Creative content development  
- Performance optimization and analytics  
- Strategic consulting and implementation

**Unique Value Proposition:**  
${companyName} positions itself as both a strategist and creative partner, delivering solutions that are measurable and impactful. The company promises transformation through data insights and innovative approaches to ${companyNiche.toLowerCase()}.

**Pricing:**  
Specific pricing is not publicly disclosed, indicating a likely custom-quote model based on service scope and client needs.

**Target Audience:**  
SMEs, growth-stage businesses, and startups, particularly organizations seeking fresh approaches and measurable returns on their ${companyNiche.toLowerCase()} investment.`;

    const marketPositioning = `**Industry Overview:**  
The ${companyNiche.toLowerCase()} space is highly competitive and rapidly evolving, with companies focusing on innovation, customer experience, automation, and measurability. Demand is strongest among businesses seeking growth, lead generation, and market differentiation.

**Growth Trajectory:**  
${companyName} is showing signs of active growth, demonstrated by its market presence, service expansion, and strategic positioning. The company reflects a modern, innovation-driven business model.

**Investment/Funding Summary:**  
No publicly available records of formal investment or funding; appears to be a privately held company, growing through organic revenue or project-funded expansion.`;

    const getCompetitors = (niche: string) => {
      const nicheCompetitors: Record<string, any[]> = {
        "digital marketing": [
          {
            name: "Webenza",
            website: "webenza.com",
            overview: "Webenza is a digital marketing agency focusing on integrated digital campaigns, content marketing, and social listening.",
            differentiators: "Strong analytics, influencer marketing, and digital PR.",
            strengths: "Data-driven campaigns, diversified client base, strong local brand.",
            weaknesses: "Larger agency—may lack boutique customization, potential for diluted creative attention."
          },
          {
            name: "Social Beat",
            website: "socialbeat.in",
            overview: "Leading digital marketing agency providing performance marketing, video content, and digital branding services.",
            differentiators: "Advanced automation, multilingual content, video marketing.",
            strengths: "Strong media buying capabilities; experience with large brands.",
            weaknesses: "Focus on large-scale clients may limit accessibility for smaller businesses."
          },
          {
            name: "Kinnect",
            website: "kinnectonline.com",
            overview: "Full-service digital agency with a creative-first approach and strong portfolio in experiential and social media marketing.",
            differentiators: "Award-winning creative work, integrated campaigns, and deep client partnerships.",
            strengths: "Creativity, industry awards, blue-chip client roster.",
            weaknesses: "Premium pricing, primarily metro-focused."
          }
        ],
        "technology": [
          {
            name: "TechCorp Solutions",
            website: "techcorp.com",
            overview: "Enterprise technology solutions provider specializing in digital transformation and cloud services.",
            differentiators: "Enterprise focus, cloud expertise, digital transformation consulting.",
            strengths: "Large enterprise clients, proven track record, technical expertise.",
            weaknesses: "High pricing, may overlook smaller clients."
          },
          {
            name: "InnovateTech",
            website: "innovatetech.com",
            overview: "Mid-market technology company focusing on custom software development and IT consulting.",
            differentiators: "Custom solutions, agile development, industry specialization.",
            strengths: "Flexible engagement models, strong technical team, competitive pricing.",
            weaknesses: "Limited brand recognition, smaller scale operations."
          }
        ],
        "consulting": [
          {
            name: "Strategic Advisors",
            website: "strategicadvisors.com",
            overview: "Management consulting firm specializing in business strategy and operational excellence.",
            differentiators: "Industry expertise, strategic planning, operational optimization.",
            strengths: "Experienced consultants, proven methodologies, strong client relationships.",
            weaknesses: "High fees, limited digital capabilities."
          },
          {
            name: "Business Growth Partners",
            website: "bgpartners.com",
            overview: "Growth-focused consulting firm helping SMEs scale their operations and market presence.",
            differentiators: "SME focus, growth strategies, practical implementation.",
            strengths: "Understanding of SME challenges, hands-on approach, measurable results.",
            weaknesses: "Limited resources for large enterprises, niche expertise."
          }
        ]
      };

      const defaultCompetitors = [
        {
          name: "Market Leader Co",
          website: "marketleader.com",
          overview: `Established ${niche.toLowerCase()} company with strong market presence and comprehensive service offerings.`,
          differentiators: "Market leadership, comprehensive services, established brand.",
          strengths: "Brand recognition, extensive resources, proven track record.",
          weaknesses: "High pricing, slower innovation, less personalized service."
        },
        {
          name: "Innovation Inc",
          website: "innovationinc.com",
          overview: `Technology-driven ${niche.toLowerCase()} company focusing on innovative solutions and modern approaches.`,
          differentiators: "Innovation focus, modern technology stack, agile processes.",
          strengths: "Cutting-edge solutions, fast implementation, competitive pricing.",
          weaknesses: "Limited market presence, newer brand, smaller team."
        }
      ];

      return nicheCompetitors[niche.toLowerCase()] || defaultCompetitors;
    };

    const competitors = getCompetitors(companyNiche);
    
    const directCompetitors = competitors.map((comp, index) => `### ${index + 1}. ${comp.name}
- **Website:** [${comp.website}](https://www.${comp.website}/)
- **Overview:** ${comp.overview}
- **Key Differentiators:** ${comp.differentiators}
- **Strengths:** ${comp.strengths}
- **Weaknesses:** ${comp.weaknesses}`).join('\n\n');

    const comparativeAnalysis = `| Company Name      | Key Strengths                                                       | Weaknesses                         | Market Share        | Funding           |
|-------------------|---------------------------------------------------------------------|------------------------------------|---------------------|-------------------|
| ${companyName}    | Creative + analytical approach; nimble; strong client focus        | Small team, limited brand maturity | Emerging player     | Bootstrapped      |
${competitors.map(comp => 
  `| ${comp.name.padEnd(17)} | ${comp.strengths.slice(0, 67).padEnd(67)} | ${comp.weaknesses.slice(0, 34).padEnd(34)} | ${'Regional leader'.padEnd(19)} | ${'Privately held'.padEnd(17)} |`
).join('\n')}`;

    const swotAnalysis = `**Strengths:**  
- Blend of creative and analytical ${companyNiche.toLowerCase()}  
- Agile and flexible for fast project turnaround  
- Strong focus on results and client transformation  
- Innovative solutions tailored to client needs

**Weaknesses:**  
- Limited recognition compared to established players  
- Smaller team might limit project capacity  
- No public record of large brand clients or funding rounds

**Opportunities:**  
- Positioning as a boutique solution provider for SMEs/startups  
- Expanding service portfolio with emerging technologies  
- Leveraging digital channels for growth and brand building  
- Building industry partnerships or strategic collaborations

**Threats:**  
- Intense competition from larger, established firms  
- Price-sensitive market segments  
- Rapid technological changes in the industry  
- Difficulties scaling while maintaining personalized service`;

    const strategicInsights = `**Go-to-Market Focus:** Emphasize ${companyName}'s nimble, results-driven strategy—position as the "agile disruptor" among legacy players.
**Client Segmentation:** Target SMEs and growth-stage businesses overlooked by big players; offer tailored packages and flexible engagement models.
**Brand Building:** Invest in showcasing successful case studies and testimonials to build credibility; leverage social proof and partnerships.
**Service Expansion:** Integrate advanced technologies, client education (webinars, workshops), and modern tools for deeper value.
**Collaboration & Networking:** Seek partnerships with complementary service providers and industry hubs.
**Talent Recruitment:** Continue to attract and nurture creative and analytical talent to scale quality delivery.
**Risk Mitigation:** Closely monitor competitor innovation; differentiate with personalized, high-touch service where larger companies fall short.`;

    const fullAnalysis = `## 1. Company Overview
${companyOverview}

## 2. Product & Services Breakdown
${productServices}

## 3. Market Positioning
${marketPositioning}

## 4. Direct Competitors

${directCompetitors}

## 5. Comparative Analysis Table

${comparativeAnalysis}

## 6. SWOT Analysis (for ${companyName})

${swotAnalysis}

## 7. Strategic Insights & Recommendations

${strategicInsights}

---

This analysis provides a strategic foundation for ${companyName}'s leadership, marketing, and strategy teams to understand their current position and paths for competitive growth.`;

    return {
      companyOverview,
      productServices,
      marketPositioning,
      directCompetitors,
      comparativeAnalysis,
      swotAnalysis,
      strategicInsights,
      fullAnalysis,
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportAnalysis = async () => {
    if (!output) return;

    const content = `COMPETITOR ANALYSIS REPORT
Company: ${inputs.companyName}
Website: ${inputs.companyWebsite}
Niche: ${inputs.companyNiche}
Generated: ${new Date().toLocaleDateString()}

${output.fullAnalysis}

---
Generated by AI Competitor Analysis Agent`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${inputs.companyName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_competitor_analysis.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isFormValid = 
    inputs.companyName.trim() && 
    inputs.companyWebsite.trim() && 
    inputs.companyNiche.trim();

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
              onClick={() => setActiveTab("input")}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "input"
                  ? "text-emerald-400 border-emerald-400"
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
                  ? "text-emerald-400 border-emerald-400"
                  : output
                  ? "text-gray-400 border-gray-700 hover:text-gray-300 cursor-pointer"
                  : "text-gray-600 border-gray-700 cursor-not-allowed"
              }`}
            >
              <FileText className="w-4 h-4" />
              Output
              {!output && (
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-500">
                  Analyze first
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
                    <Search className="w-5 h-5 text-emerald-400" />
                    Competitor Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-gray-300">
                      Company Name *
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="companyName"
                        placeholder="e.g., Spruntler"
                        value={inputs.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite" className="text-gray-300">
                      Company Website *
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="companyWebsite"
                        placeholder="e.g., www.spruntler.com"
                        value={inputs.companyWebsite}
                        onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyNiche" className="text-gray-300">
                      Company Niche *
                    </Label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="companyNiche"
                        placeholder="e.g., Digital Marketing, Technology, Consulting"
                        value={inputs.companyNiche}
                        onChange={(e) => handleInputChange("companyNiche", e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-emerald-400" />
                      What we analyze:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        Company Overview & Positioning
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        Product & Services Breakdown
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        Direct Competitor Identification
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        Comparative Analysis Table
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        SWOT Analysis
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        Strategic Recommendations
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Analysis typically takes 45-60 seconds
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>Credits required:</span>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 text-emerald-300"
                      >
                        20 credits
                      </Badge>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!isFormValid || isGenerating}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Competitors...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Generate Competitor Analysis
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
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 animate-pulse"></div>
                          <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-medium">
                            Analyzing your competitors...
                          </p>
                          <p className="text-gray-400 text-sm">
                            Identifying market players and strategic opportunities
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : output ? (
                  <div className="space-y-6">
                    {/* Analysis Header */}
                    <Card className="bg-gray-900/50 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-white">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            Competitor Analysis Report
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => copyToClipboard(output.fullAnalysis)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              onClick={exportAnalysis}
                              className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">Company</div>
                            <div className="text-white font-medium">{inputs.companyName}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Website</div>
                            <div className="text-white font-medium">{inputs.companyWebsite}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Niche</div>
                            <div className="text-white font-medium">{inputs.companyNiche}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Analysis Sections */}
                    {[
                      { title: "1. Company Overview", content: output.companyOverview, icon: Building, color: "blue" },
                      { title: "2. Product & Services Breakdown", content: output.productServices, icon: Target, color: "green" },
                      { title: "3. Market Positioning", content: output.marketPositioning, icon: TrendingUp, color: "purple" },
                      { title: "4. Direct Competitors", content: output.directCompetitors, icon: Users, color: "orange" },
                      { title: "5. Comparative Analysis", content: output.comparativeAnalysis, icon: Search, color: "yellow" },
                      { title: "6. SWOT Analysis", content: output.swotAnalysis, icon: Shield, color: "pink" },
                      { title: "7. Strategic Insights & Recommendations", content: output.strategicInsights, icon: Lightbulb, color: "indigo" }
                    ].map((section, index) => (
                      <Card key={index} className="bg-gray-900/50 border-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white text-lg">
                            <section.icon className={`w-5 h-5 text-${section.color}-400`} />
                            {section.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gray-800/50 rounded-lg p-6">
                            <div className="whitespace-pre-wrap text-gray-300 leading-relaxed text-sm">
                              {section.content}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardContent className="py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-400 mb-2">
                          Ready to analyze your competition
                        </h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                          Enter your company details to receive a comprehensive competitor analysis
                          with strategic insights and recommendations.
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

export default CompetitorAnalysisAgentPage;