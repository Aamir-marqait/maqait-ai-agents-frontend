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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AudienceResearchInputs {
  companyName: string;
  companyWebsite: string;
  companyNiche: string;
}

interface AudienceResearchOutput {
  companyOverview: string;
  idealCustomerProfiles: string;
  demographicPsychographic: string;
  buyerPersonas: string;
  platformToneMapping: string;
  strategicObservations: string;
  fullResearch: string;
}

type Tab = "input" | "output";

const AudienceResearchAgentPage = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<AudienceResearchInputs>({
    companyName: "",
    companyWebsite: "",
    companyNiche: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<AudienceResearchOutput | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("input");

  const handleInputChange = (field: keyof AudienceResearchInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;

    setIsGenerating(true);
    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 4800));

      const mockOutput: AudienceResearchOutput = generateAudienceResearch(inputs);
      setOutput(mockOutput);
      // Auto-switch to output tab after generation
      setActiveTab("output");
    } catch (error) {
      console.error("Research failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAudienceResearch = (inputs: AudienceResearchInputs): AudienceResearchOutput => {
    const { companyName, companyWebsite, companyNiche } = inputs;

    const companyOverview = `**Name:** ${companyName}
**Website:** ${companyWebsite}
**Niche:** ${companyNiche}
**Summary:**  
${companyName} is a ${companyNiche.toLowerCase()} company that positions itself as a creative, strategy-driven partner dedicated to transforming businesses from indifferent to outstanding. The brand emphasizes innovative, data-driven approaches, visually compelling solutions, and creative content designed for measurable results. ${companyName}'s communications across digital channels consistently feature a tone blending creativity with a strong focus on real business outcomes. Their messaging directly targets businesses open to transformation, with calls to action centered on collaborations for tangible success. The company leverages custom strategies, content rooted in current trends, and engagement-driven formats for diverse business needs, catering to both established brands and ambitious growth-seekers in competitive digital spaces.`;

    const getICPs = (niche: string) => {
      if (niche.toLowerCase().includes("digital marketing") || niche.toLowerCase().includes("marketing")) {
        return `**ICP 1:**
- **Industry:** E-commerce, D2C brands, retail, and growth-oriented consumer businesses
- **Company Size:** Small to mid-sized businesses (20–200 employees)
- **Job Roles:** Marketing Heads, Growth Leads, Founders
- **Region / Country:** Primarily India (notably Bangalore), with potential appeal in other urbanized emerging markets
- **Age Group:** 28–40
- **Gender Trends:** Gender-neutral communications, with content accessible to all genders
- **Buying Intent:** Seeks rapid growth, measurable ROI, and innovative creative strategies to differentiate in saturated markets
- **Preferred Marketing Platforms:** Meta Ads (Facebook, Instagram), WhatsApp, and emerging youth-centric platforms
- **Message Tone:** Energetic, results-driven, creative & collaborative
- **Rationale:** ${companyName}'s focus on creative campaigns and actionable marketing speaks most directly to dynamic, high-growth companies prioritizing rapid scaling and strong brand engagement.

**ICP 2:**
- **Industry:** SaaS, technology solutions, and mid-market digital-first B2B enterprises
- **Company Size:** 100–500 employees
- **Job Roles:** CTOs, CMOs, Product Managers, Digital Transformation Executives
- **Region / Country:** North America, India (metro), and pan-Asia
- **Age Group:** 35–50
- **Gender Trends:** Gender-neutral, slightly tech-leaning communications
- **Buying Intent:** Concerned with digital transformation, automation, and scalable growth via sophisticated marketing and technical integration
- **Preferred Marketing Platforms:** LinkedIn, Reddit (tech forums), YouTube
- **Message Tone:** Professional, ROI-focused, integration-ready
- **Rationale:** Language referencing technical innovation and business transformation resonates with tech-focused companies seeking automation, CRM, and high-level digital strategies.`;
      }

      if (niche.toLowerCase().includes("technology") || niche.toLowerCase().includes("software")) {
        return `**ICP 1:**
- **Industry:** Mid-market enterprises, growing tech companies, and digital transformation initiatives
- **Company Size:** 50–500 employees
- **Job Roles:** CTOs, IT Directors, Digital Transformation Leads
- **Region / Country:** North America, Europe, India (metro cities)
- **Age Group:** 35–50
- **Gender Trends:** Gender-neutral, technically focused communications
- **Buying Intent:** Seeking scalable technology solutions, efficiency improvements, and competitive advantages
- **Preferred Marketing Platforms:** LinkedIn, tech forums, industry publications
- **Message Tone:** Technical, results-oriented, professional
- **Rationale:** ${companyName}'s technology focus aligns with companies prioritizing digital innovation and operational efficiency.

**ICP 2:**
- **Industry:** Startups, SaaS companies, and emerging tech ventures
- **Company Size:** 10–100 employees
- **Job Roles:** Founders, Technical Leads, Product Managers
- **Region / Country:** Silicon Valley, Bangalore, Tel Aviv, London
- **Age Group:** 28–42
- **Gender Trends:** Diverse, innovation-focused
- **Buying Intent:** Rapid scaling, cutting-edge solutions, cost-effective growth
- **Preferred Marketing Platforms:** Product Hunt, Y Combinator forums, GitHub, Twitter
- **Message Tone:** Innovative, agile, partnership-focused
- **Rationale:** Early-stage tech companies value innovative solutions and partnership approaches that ${companyName} can provide.`;
      }

      // Default ICPs for other niches
      return `**ICP 1:**
- **Industry:** Growing businesses, SMEs, and mid-market companies
- **Company Size:** 25–250 employees
- **Job Roles:** Business Owners, Operations Managers, Department Heads
- **Region / Country:** Primary markets with emerging opportunities in urban centers
- **Age Group:** 30–45
- **Gender Trends:** Gender-neutral, business-focused communications
- **Buying Intent:** Seeking growth solutions, efficiency improvements, and competitive advantages
- **Preferred Marketing Platforms:** LinkedIn, industry publications, business networks
- **Message Tone:** Professional, results-driven, trustworthy
- **Rationale:** ${companyName}'s approach aligns with businesses seeking reliable, growth-oriented solutions.

**ICP 2:**
- **Industry:** Established enterprises and larger organizations
- **Company Size:** 200+ employees
- **Job Roles:** C-level executives, Strategic Planning Directors, Innovation Leads
- **Region / Country:** Major metropolitan areas and business centers
- **Age Group:** 40–55
- **Gender Trends:** Executive-level, professional communications
- **Buying Intent:** Strategic investments, long-term partnerships, market leadership
- **Preferred Marketing Platforms:** Industry conferences, executive networks, trade publications
- **Message Tone:** Strategic, authoritative, partnership-focused
- **Rationale:** Larger organizations value strategic partnerships and proven track records that ${companyName} can demonstrate.`;
    };

    const idealCustomerProfiles = getICPs(companyNiche);

    const demographicPsychographic = `**Age Ranges:** 28–50
**Language & Tone Preference:** English; creative, concise, and action-oriented (for consumer segments); technical and results-driven for B2B
**Pain Points:**  
- Lack of creative differentiation in crowded ${companyNiche.toLowerCase()} markets
- Challenges in measuring ROI from investments
- Difficulty integrating creative and data-driven approaches
- High customer churn or low engagement rates
**Conversion Triggers:**  
- Proven case studies and result statistics
- Custom strategy promises
- "Not your average provider" positioning (creativity and results focus)
**Content Preferences:**  
- Visual storytelling and interactive content for consumer segments
- Informative, data-driven content for technical/enterprise buyers
- Case studies, whitepapers, and thought leadership pieces
**Attention Span:**  
- Short for consumer/growth buyers (prefers clear, visual CTAs)
- Moderate for enterprise (engages with longer-form strategic content)
**Brand Expectations:**  
- Innovation, reliability, partnership, and "outside-the-box" thinking`;

    const getPersonas = (niche: string) => {
      if (niche.toLowerCase().includes("digital marketing") || niche.toLowerCase().includes("marketing")) {
        return `**Persona A:**  
- **Name:** Rina Shah  
- **Age:** 32  
- **Gender:** Female  
- **Role:** E-Commerce Growth Lead  
- **Company:** Apparel D2C Brand (40 employees)  
- **Region:** India (Tier 1 or 2 metro cities)  
- **Goals:** Rapid acquisition & retargeting, driving repeat sales  
- **Pain Points:** Poor attribution, creative fatigue, brand differentiation  
- **Active Platforms:** Meta Ads, Instagram, WhatsApp  
- **Message Preference:** Concrete ROI, edgy creative proposals, collaborative engagement

**Persona B:**  
- **Name:** Marcus Lee  
- **Age:** 45  
- **Gender:** Male  
- **Role:** CTO  
- **Company:** SaaS startup, >200 employees  
- **Region:** North America  
- **Goals:** Scale marketing with automation and integrate digital processes  
- **Frustrations:** Lack of technical case studies, minimal cross-platform integration  
- **Active Platforms:** LinkedIn, Reddit, YouTube  
- **Message Preference:** Detailed, strategic, integration-oriented

**Persona C:**  
- **Name:** Priya Menon  
- **Age:** 28  
- **Gender:** Female  
- **Role:** Brand Manager  
- **Company:** Consumer SaaS, 60 employees  
- **Region:** India, SEA  
- **Goals:** Launch viral campaigns and grow brand engagement  
- **Pain Points:** Low organic reach, generic creative support in market  
- **Active Platforms:** Instagram, YouTube Shorts  
- **Message Preference:** Creative, trend-focused, high-velocity activation`;
      }

      // Default personas for other niches
      return `**Persona A:**  
- **Name:** Sarah Johnson  
- **Age:** 38  
- **Gender:** Female  
- **Role:** Operations Director  
- **Company:** Mid-market ${niche} company (150 employees)  
- **Region:** North America  
- **Goals:** Streamline operations, improve efficiency, drive growth  
- **Pain Points:** Complex processes, limited resources, competitive pressure  
- **Active Platforms:** LinkedIn, industry forums, email  
- **Message Preference:** Professional, results-focused, clear ROI

**Persona B:**  
- **Name:** David Chen  
- **Age:** 42  
- **Gender:** Male  
- **Role:** Business Owner  
- **Company:** Growing ${niche} business (75 employees)  
- **Region:** Asia-Pacific  
- **Goals:** Scale business, improve market position, optimize costs  
- **Frustrations:** Limited expertise, time constraints, budget concerns  
- **Active Platforms:** LinkedIn, Google Search, industry publications  
- **Message Preference:** Practical, cost-effective, partnership-focused

**Persona C:**  
- **Name:** Maria Rodriguez  
- **Age:** 35  
- **Gender:** Female  
- **Role:** Strategy Manager  
- **Company:** Enterprise ${niche} organization (500+ employees)  
- **Region:** Europe  
- **Goals:** Drive innovation, competitive advantage, strategic growth  
- **Pain Points:** Slow decision-making, complex requirements, risk management  
- **Active Platforms:** Executive networks, LinkedIn, industry conferences  
- **Message Preference:** Strategic, authoritative, long-term focused`;
    };

    const buyerPersonas = getPersonas(companyNiche);

    const platformToneMapping = `| Segment | Best Platforms      | Messaging Tone            | Recommended Campaign Types         |
|---------|--------------------|---------------------------|------------------------------------|
| ICP 1   | LinkedIn, Meta     | Professional, results-focused | Case studies, thought leadership    |
| ICP 2   | Industry forums, Email | Technical, detailed       | Whitepapers, webinars, demos      |
| Young Professionals | Instagram, YouTube | Creative, trend-driven   | Visual content, interactive campaigns |`;

    const strategicObservations = `- Primary segments respond best to results-focused messaging with clear ROI demonstrations and proven case studies.
- Technical buyers value detailed, integration-focused content and prefer platforms like LinkedIn and industry forums.
- Younger, brand-focused decision-makers favor creative, trend-driven content and rapid campaign execution.
- Emerging opportunities exist in urban markets, with potential to expand similar approaches into tech-forward regions.
- Current positioning as a results-driven partner can be reinforced by increasing public-facing case studies, testimonials, and technical resources.
- Strategic advice: Balance creative storytelling with strong data and measurable outcomes—segment campaigns by buyer readiness and intent, leveraging multi-channel approaches for maximum impact.
- Growth opportunity: Develop industry-specific case studies and thought leadership content to build authority and trust with target segments.
- Platform strategy: Prioritize LinkedIn for professional segments while leveraging emerging platforms for younger, more dynamic buyer personas.`;

    const fullResearch = `## 1. Company Overview
- ${companyOverview}

## 2. Ideal Customer Profiles (ICPs)

${idealCustomerProfiles}

## 3. Demographic & Psychographic Traits
${demographicPsychographic}

## 4. Buyer/User Personas

${buyerPersonas}

## 5. Platform & Tone Mapping

${platformToneMapping}

## 6. Strategic Observations
${strategicObservations}`;

    return {
      companyOverview,
      idealCustomerProfiles,
      demographicPsychographic,
      buyerPersonas,
      platformToneMapping,
      strategicObservations,
      fullResearch,
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportResearch = async () => {
    if (!output) return;

    const content = `AUDIENCE RESEARCH REPORT
Company: ${inputs.companyName}
Website: ${inputs.companyWebsite}
Niche: ${inputs.companyNiche}
Generated: ${new Date().toLocaleDateString()}

${output.fullResearch}

---
Generated by AI Audience Research Agent`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${inputs.companyName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_audience_research.txt`;
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
                  ? "text-orange-400 border-orange-400"
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
                  ? "text-orange-400 border-orange-400"
                  : output
                  ? "text-gray-400 border-gray-700 hover:text-gray-300 cursor-pointer"
                  : "text-gray-600 border-gray-700 cursor-not-allowed"
              }`}
            >
              <FileText className="w-4 h-4" />
              Output
              {!output && (
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-500">
                  Research first
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
                    <Users className="w-5 h-5 text-orange-400" />
                    Audience Research
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
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
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
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
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
                        placeholder="e.g., Digital Marketing, SaaS, E-commerce"
                        value={inputs.companyNiche}
                        onChange={(e) => handleInputChange("companyNiche", e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Eye className="w-4 h-4 text-orange-400" />
                      What we research:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        Ideal Customer Profiles (ICPs)
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        Demographic & Psychographic Traits
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        Detailed Buyer Personas
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        Platform & Messaging Strategy
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        Pain Points & Conversion Triggers
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        Strategic Recommendations
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Research typically takes 45-60 seconds
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>Credits required:</span>
                      <Badge
                        variant="outline"
                        className="border-orange-500/30 text-orange-300"
                      >
                        15 credits
                      </Badge>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!isFormValid || isGenerating}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Researching Target Audience...
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 mr-2" />
                        Generate Audience Research
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
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-600 to-red-600 animate-pulse"></div>
                          <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-medium">
                            Researching your target audience...
                          </p>
                          <p className="text-gray-400 text-sm">
                            Analyzing demographics, personas, and strategic opportunities
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : output ? (
                  <div className="space-y-6">
                    {/* Research Header */}
                    <Card className="bg-gray-900/50 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-white">
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                            Audience Research Report
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => copyToClipboard(output.fullResearch)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              onClick={exportResearch}
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

                    {/* Research Sections */}
                    {[
                      { title: "1. Company Overview", content: output.companyOverview, icon: Building, color: "blue" },
                      { title: "2. Ideal Customer Profiles (ICPs)", content: output.idealCustomerProfiles, icon: Target, color: "green" },
                      { title: "3. Demographic & Psychographic Traits", content: output.demographicPsychographic, icon: Heart, color: "purple" },
                      { title: "4. Buyer/User Personas", content: output.buyerPersonas, icon: User, color: "pink" },
                      { title: "5. Platform & Tone Mapping", content: output.platformToneMapping, icon: MessageCircle, color: "yellow" },
                      { title: "6. Strategic Observations", content: output.strategicObservations, icon: Eye, color: "indigo" }
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
                            {section.title.includes("Platform & Tone Mapping") ? (
                              <div className="overflow-x-auto">
                                <div className="whitespace-pre text-gray-300 leading-relaxed text-sm font-mono">
                                  {section.content}
                                </div>
                              </div>
                            ) : (
                              <div className="whitespace-pre-wrap text-gray-300 leading-relaxed text-sm">
                                {section.content}
                              </div>
                            )}
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
                          <Users className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-400 mb-2">
                          Ready to research your target audience
                        </h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                          Enter your company details to receive comprehensive audience research
                          with detailed personas, ICPs, and strategic recommendations.
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

export default AudienceResearchAgentPage;