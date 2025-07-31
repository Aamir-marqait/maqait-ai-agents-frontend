import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Sparkles,
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CampaignInputs {
  companyName: string;
  companyUrl: string;
  platforms: string[];
  startDate: string;
  endDate: string;
  campaignObjective: string;
}

interface CampaignStrategyOutput {
  companyOverview: string;
  objectiveUnderstanding: string;
  audiencePlatformFit: string;
  campaignTimeline: string;
  contentAdStrategy: string;
  summaryImpact: string;
  fullStrategy: string;
}

type Tab = "input" | "output";

const platformOptions = [
  { id: "meta", label: "Meta (Facebook & Instagram)" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "twitter", label: "Twitter" },
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "google", label: "Google Ads" },
];

const objectiveOptions = [
  { value: "awareness", label: "Awareness" },
  { value: "consideration", label: "Consideration" },
  { value: "lead-generation", label: "Lead Generation" },
  { value: "conversion", label: "Conversion" },
  { value: "retention", label: "Retention" },
];

const CampaignStrategyAgentPage = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<CampaignInputs>({
    companyName: "",
    companyUrl: "",
    platforms: [],
    startDate: "",
    endDate: "",
    campaignObjective: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<CampaignStrategyOutput | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("input");

  const handleInputChange = (field: keyof CampaignInputs, value: string | string[]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    if (checked) {
      setInputs((prev) => ({
        ...prev,
        platforms: [...prev.platforms, platformId],
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        platforms: prev.platforms.filter((p) => p !== platformId),
      }));
    }
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;

    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 4500));

      const mockOutput: CampaignStrategyOutput = generateCampaignStrategy(inputs);
      setOutput(mockOutput);
      // Auto-switch to output tab after generation
      setActiveTab("output");
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCampaignStrategy = (inputs: CampaignInputs): CampaignStrategyOutput => {
    const { companyName, companyUrl, platforms, startDate, endDate, campaignObjective } = inputs;
    const platformLabels = platforms.map(p => 
      platformOptions.find(opt => opt.id === p)?.label || p
    ).join(", ");

    const startDateFormatted = new Date(startDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const endDateFormatted = new Date(endDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const companyOverview = `${companyName} is a digital agency specializing in elevating business performance through a suite of services including digital marketing, website design, branding, SEO, PPC, social media marketing, impactful content creation, and e-commerce solutions. The company's approach is characterized by innovative, data-driven strategy and a vibrant, slightly playful, yet professional tone. Their messaging frequently leverages creative language and is results-centric, targeting business clients aiming to enhance online visibility and performance.`;

    const getObjectiveDescription = (objective: string) => {
      switch (objective) {
        case "awareness":
          return `- Awareness: Increase overall market and digital presence for ${companyName} among potential business clients.`;
        case "consideration":
          return `- Consideration: Engage prospects with practical and inspirational content to highlight the agency's digital expertise.`;
        case "lead-generation":
          return `- Lead Generation: Capture leads through conversion-focused strategies, offering consultations, resources, or free audits.`;
        case "conversion":
          return `- Conversion: Drive direct sales and service bookings through targeted conversion campaigns.`;
        case "retention":
          return `- Retention: Strengthen relationships with existing clients and encourage repeat business and referrals.`;
        default:
          return `- ${objective}: Achieve strategic business objectives through targeted digital marketing efforts.`;
      }
    };

    const objectiveUnderstanding = `The objectives for this campaign are:\n${getObjectiveDescription(campaignObjective)}`;

    const audiencePlatformFit = `Target Audience Segments:
- Small to medium-sized business owners seeking digital growth
- Marketing managers or decision-makers at growing brands
- Start-ups looking for website and brand identity solutions
- E-commerce businesses aiming to boost online sales
- Entrepreneurs interested in impactful digital campaigns and content creation

Platform Suitability:
${platforms.includes('meta') ? '- Meta (Facebook & Instagram): Ideal for visually dynamic content, B2B and B2C reach, and audience targeting by industry, role, or interest.' : ''}
${platforms.includes('linkedin') ? '- LinkedIn: Highly effective for professional networking, B2B lead generation, and industry authority building among marketing decision-makers and founders.' : ''}
${platforms.includes('twitter') ? '- Twitter: Suited for thought leadership, real-time engagement, and building authority via bite-sized expert content and campaign updates.' : ''}
${platforms.includes('youtube') ? '- YouTube: Perfect for educational content, tutorials, case studies, and long-form brand storytelling.' : ''}
${platforms.includes('tiktok') ? '- TikTok: Excellent for reaching younger audiences with creative, trend-based content and viral marketing strategies.' : ''}
${platforms.includes('google') ? '- Google Ads: Essential for capturing high-intent search traffic and targeting users actively seeking digital marketing services.' : ''}`.replace(/\n\s*\n/g, '\n');

    const campaignDuration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
    const phase1End = Math.ceil(campaignDuration * 0.25);
    const phase2End = Math.ceil(campaignDuration * 0.6);

    const campaignTimeline = `${startDateFormatted.split(' ')[0]}–${startDateFormatted.split(' ')[0] + phase1End - 1} ${startDateFormatted.split(' ')[1]}: Awareness
- Platform teasers, service highlights, "Did You Know?" brand facts, introductory videos
- Broad audience targeting (business pages, professionals in marketing, founders)

${startDateFormatted.split(' ')[0] + phase1End}–${startDateFormatted.split(' ')[0] + phase2End - 1} ${startDateFormatted.split(' ')[1]}: Consideration
- Educational blog shares, client case study carousels, short explainer videos
- Interactive content: polls, Q&A sessions on Meta and Twitter; expertise posts on LinkedIn
- Retargeting users who engaged with awareness content

${startDateFormatted.split(' ')[0] + phase2End}–${endDateFormatted.split(' ')[0]} ${endDateFormatted.split(' ')[1]}: Lead Generation & Conversion
- Promotion of limited-time offers (e.g., free digital audits/consultations)
- Gated content (e-books, checklists, marketing strategy guides)
- Lead forms and conversion-optimized landing pages
- Reminder and testimonial ads for retargeted prospects`;

    const getContentStrategy = () => {
      let strategy = "";
      
      if (platforms.includes('meta')) {
        strategy += `Meta (Facebook/Instagram):
- Creatives: Animated video reels, carousel showcases (before/after website redesigns), client testimonial graphics, branded infographics
- Messaging: Motivational and benefit-led, combining creative flair with tangible results ("Turn Clicks Into Clients. See How ${companyName} Does It.")
- Posting: 4–5 organic posts/week; 2–3 ad cycles segmented by campaign stage
- Ad Spend: Higher allocation during the awareness and conversion phases for boosted reach and lead-form ads

`;
      }

      if (platforms.includes('linkedin')) {
        strategy += `LinkedIn:
- Creatives: Long-form thought leadership posts, carousel case studies, document ads (strategic playbooks), direct lead gen forms
- Messaging: Formal, authoritative, data-backed ("Discover How Advanced SEO Doubled Our Client's Leads in 90 Days")
- Posting: 3 posts/week; 1–2 sponsored campaigns per phase
- Ad Spend: Focused on sponsored content and direct lead gen for maximum ROI among professional audiences

`;
      }

      if (platforms.includes('twitter')) {
        strategy += `Twitter:
- Creatives: Expert threads, data-driven infographics, video snippets from webinars or live Q&As
- Messaging: Insightful, concise, and trend-aware; leverage campaign and industry hashtags
- Posting: 1–2 tweets per day, with increased activity during engagement spikes
- Ad Spend: Invest in promoting top-performing tweets and event-based engagements

`;
      }

      if (platforms.includes('youtube')) {
        strategy += `YouTube:
- Creatives: Educational tutorials, client success stories, behind-the-scenes content, webinar recordings
- Messaging: Informative and value-driven, establishing expertise and building trust
- Posting: 1–2 videos per week; mix of short-form and long-form content
- Ad Spend: Pre-roll ads targeting business-related content and competitor channels

`;
      }

      if (platforms.includes('tiktok')) {
        strategy += `TikTok:
- Creatives: Quick tips, trend-based content, day-in-the-life videos, creative challenges
- Messaging: Fun, engaging, and authentic while maintaining professional credibility
- Posting: 3–5 videos per week; leverage trending sounds and hashtags
- Ad Spend: Spark ads to amplify high-performing organic content

`;
      }

      if (platforms.includes('google')) {
        strategy += `Google Ads:
- Creatives: Text ads, responsive search ads, landing page optimization
- Messaging: Direct, benefit-focused with strong calls-to-action
- Targeting: High-intent keywords related to digital marketing services
- Ad Spend: Focus on conversion campaigns with optimized bidding strategies

`;
      }

      return strategy.trim();
    };

    const contentAdStrategy = getContentStrategy();

    const summaryImpact = `This multi-platform campaign positions ${companyName} as a results-driven digital partner for businesses seeking growth, enhanced digital presence, and innovative marketing solutions. The staggered phase approach ensures maximum reach, nurtures engagement, and proactively drives lead conversions across ${platformLabels}. Tailored messaging, strategic content formats, and deliberate channel use will drive measurable brand awareness, foster consideration, and generate reliable business leads throughout the campaign period from ${startDateFormatted} to ${endDateFormatted}.`;

    const fullStrategy = `🔹 Company Overview
${companyOverview}

🎯 Objective Understanding
${objectiveUnderstanding}

👥 Audience & Platform Fit
${audiencePlatformFit}

🕒 Campaign Timeline & Phases
${campaignTimeline}

🎨 Content & Ad Strategy
${contentAdStrategy}

✅ Summary & Impact
${summaryImpact}`;

    return {
      companyOverview,
      objectiveUnderstanding,
      audiencePlatformFit,
      campaignTimeline,
      contentAdStrategy,
      summaryImpact,
      fullStrategy,
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportStrategy = async () => {
    if (!output) return;

    const content = `CAMPAIGN STRATEGY REPORT
Company: ${inputs.companyName}
Website: ${inputs.companyUrl}
Platforms: ${inputs.platforms.map(p => platformOptions.find(opt => opt.id === p)?.label || p).join(", ")}
Campaign Objective: ${inputs.campaignObjective}
Start Date: ${inputs.startDate}
End Date: ${inputs.endDate}
Generated: ${new Date().toLocaleDateString()}

${output.fullStrategy}

---
Generated by AI Campaign Strategy Agent`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${inputs.companyName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_campaign_strategy.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isFormValid = 
    inputs.companyName.trim() && 
    inputs.companyUrl.trim() && 
    inputs.platforms.length > 0 && 
    inputs.startDate && 
    inputs.endDate && 
    inputs.campaignObjective;

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
                  ? "text-blue-400 border-blue-400"
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
                  ? "text-blue-400 border-blue-400"
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
                    <Target className="w-5 h-5 text-blue-400" />
                    Campaign Strategy Builder
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Company Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyUrl" className="text-gray-300">
                        Company URL *
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="companyUrl"
                          placeholder="e.g., www.spruntler.com"
                          value={inputs.companyUrl}
                          onChange={(e) => handleInputChange("companyUrl", e.target.value)}
                          className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="space-y-3">
                    <Label className="text-gray-300">Platforms *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {platformOptions.map((platform) => (
                        <div key={platform.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={platform.id}
                            checked={inputs.platforms.includes(platform.id)}
                            onCheckedChange={(checked) => 
                              handlePlatformChange(platform.id, checked as boolean)
                            }
                            className="border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                          />
                          <Label
                            htmlFor={platform.id}
                            className="text-sm text-gray-300 cursor-pointer"
                          >
                            {platform.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campaign Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-gray-300">
                        Start Date *
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="startDate"
                          type="date"
                          value={inputs.startDate}
                          onChange={(e) => handleInputChange("startDate", e.target.value)}
                          className="pl-10 bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-gray-300">
                        End Date *
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="endDate"
                          type="date"
                          value={inputs.endDate}
                          onChange={(e) => handleInputChange("endDate", e.target.value)}
                          className="pl-10 bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Campaign Objective */}
                  <div className="space-y-2">
                    <Label className="text-gray-300">What's the campaign for? *</Label>
                    <Select
                      value={inputs.campaignObjective}
                      onValueChange={(value) => handleInputChange("campaignObjective", value)}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500">
                        <SelectValue placeholder="Select campaign objective" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {objectiveOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-white hover:bg-gray-700 focus:bg-gray-700"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Strategy generation takes 30-45 seconds
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>Credits required:</span>
                      <Badge
                        variant="outline"
                        className="border-blue-500/30 text-blue-300"
                      >
                        25 credits
                      </Badge>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!isFormValid || isGenerating}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Building Campaign Strategy...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Campaign Strategy
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
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 animate-pulse"></div>
                          <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-medium">
                            Building your campaign strategy...
                          </p>
                          <p className="text-gray-400 text-sm">
                            Analyzing objectives, platforms, and timeline
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : output ? (
                  <div className="space-y-6">
                    {/* Strategy Header */}
                    <Card className="bg-gray-900/50 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Zap className="w-5 h-5 text-blue-400" />
                            Campaign Strategy Report
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => copyToClipboard(output.fullStrategy)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              onClick={exportStrategy}
                              className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">Company</div>
                            <div className="text-white font-medium">{inputs.companyName}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Platforms</div>
                            <div className="text-white font-medium">{inputs.platforms.length} selected</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Objective</div>
                            <div className="text-white font-medium capitalize">{inputs.campaignObjective.replace('-', ' ')}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Duration</div>
                            <div className="text-white font-medium">
                              {Math.ceil((new Date(inputs.endDate).getTime() - new Date(inputs.startDate).getTime()) / (1000 * 3600 * 24))} days
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Strategy Sections */}
                    {[
                      { title: "🔹 Company Overview", content: output.companyOverview, icon: Building, color: "blue" },
                      { title: "🎯 Objective Understanding", content: output.objectiveUnderstanding, icon: Target, color: "green" },
                      { title: "👥 Audience & Platform Fit", content: output.audiencePlatformFit, icon: Users, color: "purple" },
                      { title: "🕒 Campaign Timeline & Phases", content: output.campaignTimeline, icon: Calendar, color: "orange" },
                      { title: "🎨 Content & Ad Strategy", content: output.contentAdStrategy, icon: Sparkles, color: "yellow" },
                      { title: "✅ Summary & Impact", content: output.summaryImpact, icon: Zap, color: "pink" }
                    ].map((section, index) => (
                      <Card key={index} className="bg-gray-900/50 border-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white text-lg">
                            {section.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gray-800/50 rounded-lg p-4">
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
                          <Target className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-400 mb-2">
                          Ready to build your campaign strategy
                        </h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                          Provide your campaign details to receive a comprehensive
                          multi-platform marketing strategy with timeline and content recommendations.
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

export default CampaignStrategyAgentPage;