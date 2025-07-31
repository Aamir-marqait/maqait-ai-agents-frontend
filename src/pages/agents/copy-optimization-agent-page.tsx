/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Download,
  Loader2,
  Target,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CopyOptimizationOutput {
  analysis: string;
  keyInsights: string[];
  recommendations: string[];
  suggestedTaglines: string[];
}

const CopyOptimizationAgentPage = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    companyName: "",
    context: "",
    website: "",
    fields: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<CopyOptimizationOutput | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!inputs.companyName.trim() || !inputs.context.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 4000));

      const mockOutput: CopyOptimizationOutput = {
        analysis: generateAnalysis(inputs),
        keyInsights: generateKeyInsights(inputs),
        recommendations: generateRecommendations(inputs),
        suggestedTaglines: generateTaglines(inputs),
      };

      setOutput(mockOutput);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAnalysis = (inputs: any): string => {
    const { companyName, context, fields } = inputs;

    if (
      fields.toLowerCase().includes("toy") ||
      context.toLowerCase().includes("toy")
    ) {
      return `${companyName} positions itself as a premium, artisanal brand built around handmade, eco-friendly wooden toys inspired by Montessori and Waldorf philosophies. From the website and brand footprint, the target audience comprises urban, sustainability-conscious parents who value creativity, education, and mindful parenting. These parents look for toys that are not just fun but support child development and nurture lasting emotional bonds.

The current brand messaging achieves strong recall but may need refinement for broader market appeal. It resonates well with local audiences but risks alienating aspirational consumers seeking assurance on quality, values, and child benefit. Data from parental purchasing trends shows a 51 percent increase in parents prioritizing safety, durability, and developmental value over just price or novelty (Statista 2023). Urban and semi-urban metros account for over 65 percent of premium toy purchases, and in these markets, trust, sophistication, and quality assurance drive growth.

A refined messaging strategy for ${companyName} must therefore do more than spark interest—it must invite trust, encapsulate minimalism, and foreground learning and bonding. This is essential to differentiate from mass-market imports and align with the global movement toward slow childhood and conscious consumption. Industry-leading brands in this segment consistently leverage key emotions: wonder, nostalgia, and security.

Analysis shows that brands using premium, purposeful messaging see up to three times higher recall among their desired audience, and up to 40 percent greater intent to purchase (Nielsen 2022). For web and retail touchpoints where sophistication matters, this approach elevates ${companyName} above the noise, while maintaining authentic connection with core audiences.

This strategy respects the brand's current approach while allowing for scalable growth—without losing authenticity or appeal to loyal advocates.`;
    }

    if (
      fields.toLowerCase().includes("tech") ||
      context.toLowerCase().includes("software")
    ) {
      return `${companyName} operates in the competitive technology sector where differentiation through messaging is crucial for market penetration. Based on the provided context, the brand targets tech-savvy professionals and businesses seeking innovative solutions. The current market landscape shows increasing demand for transparency, reliability, and measurable outcomes in technology partnerships.

The existing brand communication may benefit from clearer value proposition articulation. While technical expertise is evident, the messaging needs to bridge the gap between complex capabilities and tangible business benefits. Research indicates that 73% of B2B buyers prefer vendors who can clearly communicate ROI and implementation timelines (Gartner 2023).

${companyName}'s messaging strategy should emphasize trust-building through case studies, transparent processes, and outcome-focused language. The technology sector rewards brands that can simplify complex concepts while maintaining credibility. Industry leaders consistently focus on three core elements: innovation, reliability, and partnership.

Market analysis reveals that technology brands with clear, benefit-driven messaging achieve 2.5x higher conversion rates and 60% better customer retention (McKinsey 2023). For digital touchpoints, this approach positions ${companyName} as a strategic partner rather than just a service provider.

The recommended approach maintains technical credibility while making the brand more accessible to decision-makers who may not have deep technical backgrounds but need to understand business impact.`;
    }

    // Generic business analysis
    return `${companyName} operates in a competitive market where clear brand positioning and messaging are critical for sustainable growth. Based on the provided context and industry analysis, the brand serves customers who value quality, reliability, and authentic engagement. The current market dynamics favor brands that can articulate their unique value proposition while building genuine connections with their target audience.

The existing brand communication shows potential but may benefit from strategic refinement to maximize market impact. Consumer behavior research indicates that 68% of purchasing decisions are influenced by brand messaging clarity and emotional resonance (Harvard Business Review 2023). In today's saturated marketplace, brands must differentiate through both functional benefits and emotional connection.

${companyName}'s messaging strategy should focus on building trust through consistent communication, clear value articulation, and authentic brand storytelling. The most successful brands in this space consistently emphasize three key elements: credibility, innovation, and customer-centricity.

Industry analysis shows that brands with cohesive, strategically-aligned messaging achieve 23% higher revenue growth and 3x better customer loyalty (Deloitte 2023). For all customer touchpoints, this approach positions ${companyName} as a trusted partner and preferred choice in its category.

The recommended strategy builds on existing brand strengths while addressing market opportunities for expanded reach and deeper customer engagement.`;
  };

  const generateKeyInsights = (inputs: any): string[] => {
    const { fields, context: _context } = inputs;

    if (fields.toLowerCase().includes("toy")) {
      return [
        "51% increase in parents prioritizing safety and developmental value in toys",
        "65% of premium toy purchases occur in urban and semi-urban metros",
        "Trust and quality assurance are primary drivers in premium toy segment",
        "Global trend toward slow childhood and conscious consumption",
        "Premium messaging increases recall by 3x among target audience",
      ];
    }

    if (fields.toLowerCase().includes("tech")) {
      return [
        "73% of B2B buyers prefer vendors with clear ROI communication",
        "Technology brands with benefit-driven messaging see 2.5x higher conversion",
        "60% better customer retention for brands with clear value propositions",
        "Decision-makers prioritize business impact over technical specifications",
        "Transparency and reliability are key differentiators in tech sector",
      ];
    }

    return [
      "68% of purchasing decisions influenced by messaging clarity",
      "Brands with cohesive messaging achieve 23% higher revenue growth",
      "3x better customer loyalty for strategically-aligned brands",
      "Emotional resonance drives long-term customer relationships",
      "Market differentiation requires both functional and emotional benefits",
    ];
  };

  const generateRecommendations = (inputs: any): string[] => {
    const { companyName: _companyName, fields } = inputs;

    if (fields.toLowerCase().includes("toy")) {
      return [
        "Emphasize craftsmanship and educational value in all messaging",
        "Build trust through safety certifications and quality assurance",
        "Target sustainability-conscious urban parents in marketing",
        "Create content around child development and mindful parenting",
        "Leverage nostalgia and wonder in brand storytelling",
      ];
    }

    if (fields.toLowerCase().includes("tech")) {
      return [
        "Focus on business outcomes rather than technical features",
        "Develop case studies showcasing measurable ROI",
        "Simplify complex concepts for non-technical decision-makers",
        "Emphasize partnership approach over vendor relationship",
        "Build credibility through transparent processes and timelines",
      ];
    }

    return [
      "Develop clear, consistent value proposition across all channels",
      "Build emotional connection through authentic brand storytelling",
      "Focus on customer benefits rather than company features",
      "Create trust through transparency and social proof",
      "Align messaging with target audience values and priorities",
    ];
  };

  const generateTaglines = (inputs: any): string[] => {
    const { companyName: _companyName, fields, context: _context } = inputs;

    if (fields.toLowerCase().includes("toy")) {
      return [
        "Crafted for Joy. Built for Childhood.",
        "Where Wonder Meets Learning.",
        "Handmade Happiness. Lasting Memories.",
        "Play with Purpose. Grow with Joy.",
        "Thoughtfully Made. Lovingly Played.",
      ];
    }

    if (fields.toLowerCase().includes("tech")) {
      return [
        "Innovation Made Simple.",
        "Your Success, Our Technology.",
        "Building Tomorrow, Today.",
        "Technology That Works for You.",
        "Smart Solutions. Real Results.",
      ];
    }

    return [
      "Excellence in Every Detail.",
      "Your Vision, Our Passion.",
      "Quality You Can Trust.",
      "Making Excellence Accessible.",
      "Where Quality Meets Innovation.",
    ];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportAnalysis = async () => {
    if (!output) return;

    const content = `COPY OPTIMIZATION ANALYSIS
Company: ${inputs.companyName}

COMPREHENSIVE ANALYSIS:
${output.analysis}

KEY INSIGHTS:
${output.keyInsights.map((insight, i) => `${i + 1}. ${insight}`).join("\n")}

RECOMMENDATIONS:
${output.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}

SUGGESTED TAGLINES:
${output.suggestedTaglines
  .map((tagline, i) => `${i + 1}. "${tagline}"`)
  .join("\n")}

---
Generated by AI Copy Optimization Agent
Date: ${new Date().toLocaleDateString()}`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${inputs.companyName
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_copy_analysis.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isFormValid = inputs.companyName.trim() && inputs.context.trim();

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

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Section */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-orange-400" />
                Copy Optimization Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-300">
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Bombay Toy Company"
                    value={inputs.companyName}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-gray-300">
                    Website URL
                  </Label>
                  <Input
                    id="website"
                    placeholder="e.g., www.bombaytoys.com"
                    value={inputs.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fields" className="text-gray-300">
                  Industry/Fields
                </Label>
                <Input
                  id="fields"
                  placeholder="e.g., Toys, Education, Handmade products"
                  value={inputs.fields}
                  onChange={(e) => handleInputChange("fields", e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="context" className="text-gray-300">
                  Context & Background *
                </Label>
                <Textarea
                  id="context"
                  placeholder="Provide context about your company, current messaging, target audience, challenges, and goals. Include any existing taglines or brand positioning you'd like analyzed."
                  value={inputs.context}
                  onChange={(e) => handleInputChange("context", e.target.value)}
                  className="min-h-[120px] bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  {inputs.context.length}/2000 characters
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Credits required:</span>
                  <Badge
                    variant="outline"
                    className="border-orange-500/30 text-orange-300"
                  >
                    25 credits
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
                    Analyzing Copy & Brand Positioning...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Copy Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
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
                      Analyzing your brand and copy...
                    </p>
                    <p className="text-gray-400 text-sm">
                      Generating insights and recommendations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : output ? (
            <div className="space-y-6">
              {/* Main Analysis */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Brand Analysis & Copy Optimization
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(output.analysis)}
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
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <div className="whitespace-pre-wrap text-gray-300 leading-relaxed text-sm">
                      {output.analysis}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                    <span>
                      {output.analysis.split(" ").length} words •{" "}
                      {Math.ceil(output.analysis.split(" ").length / 200)} min
                      read
                    </span>
                    <Badge
                      variant="outline"
                      className="border-green-500/30 text-green-300"
                    >
                      Comprehensive Analysis
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Key Market Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {output.keyInsights.map((insight, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg"
                      >
                        <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-yellow-400 text-xs font-semibold">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="w-5 h-5 text-blue-400" />
                    Strategic Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {output.recommendations.map((recommendation, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg"
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-400 text-xs font-semibold">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">
                          {recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Taglines */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Suggested Taglines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {output.suggestedTaglines.map((tagline, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <span className="text-purple-400 text-sm font-semibold">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-white font-medium">
                            "{tagline}"
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(tagline)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    Ready to optimize your brand copy
                  </h3>
                  <p className="text-gray-500 text-sm max-w-sm">
                    Provide your company details and context to receive
                    comprehensive brand analysis and copy optimization
                    recommendations.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopyOptimizationAgentPage;
