import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Download,
  Loader2,
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Link,
  FileText,
  Edit3,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SEOAnalysisOutput {
  summary: {
    domainAuthority: number;
    pageAuthority: number;
    spamScore: number;
    backlinks: number;
    loadTime: string;
  };
  technicalSEO: {
    issues: string[];
    strengths: string[];
  };
  onPageSEO: {
    issues: string[];
    strengths: string[];
  };
  contentQuality: {
    wordCount: number;
    issues: string[];
    strengths: string[];
  };
  backlinksAuthority: {
    issues: string[];
    strengths: string[];
  };
  recommendations: string[];
  estimatedBenefit: string;
  fullAnalysis: string;
}

type Tab = "input" | "output";

const SEOAnalysisAgentPage = () => {
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<SEOAnalysisOutput | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("input");

  const handleGenerate = async () => {
    if (!websiteUrl.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const mockOutput: SEOAnalysisOutput = generateSEOAnalysis(websiteUrl);
      setOutput(mockOutput);
      // Auto-switch to output tab after generation
      setActiveTab("output");
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSEOAnalysis = (url: string): SEOAnalysisOutput => {
    const domain = url.replace(/^https?:\/\//, '').replace(/\/.*/, '');
    
    return {
      summary: {
        domainAuthority: Math.floor(Math.random() * 30) + 5,
        pageAuthority: Math.floor(Math.random() * 40) + 10,
        spamScore: Math.floor(Math.random() * 15),
        backlinks: Math.floor(Math.random() * 50) + 5,
        loadTime: (Math.random() * 2 + 0.1).toFixed(2),
      },
      technicalSEO: {
        issues: [
          "No sitemap.xml file detected",
          "Missing robots.txt file",
          "Core Web Vitals data unavailable",
          "Limited crawlability optimization"
        ],
        strengths: [
          "Valid HTTPS certificate",
          "Fast server response times",
          "No broken links detected",
          "Proper security headers implemented"
        ]
      },
      onPageSEO: {
        issues: [
          "Meta descriptions lack targeted keywords",
          "Limited keyword optimization strategy",
          "Shallow internal linking structure",
          "URLs could be more descriptive"
        ],
        strengths: [
          "Proper H1-H6 heading structure",
          "All images have alt tags",
          "Clean and descriptive URLs",
          "Meta titles are optimized for brevity"
        ]
      },
      contentQuality: {
        wordCount: Math.floor(Math.random() * 800) + 200,
        issues: [
          "Content is thin and lacks depth",
          "No supporting blog posts or resources",
          "Limited topical authority clusters",
          "Insufficient semantic SEO implementation"
        ],
        strengths: [
          "Original, brand-aligned content",
          "No duplicate content detected",
          "Content aligns with user intent",
          "Good content structure and readability"
        ]
      },
      backlinksAuthority: {
        issues: [
          "Minimal backlink profile volume",
          "Low anchor text diversity",
          "Limited referring domains",
          "Lacks high-authority link sources"
        ],
        strengths: [
          "Spam score within safe range",
          "No toxic links identified",
          "Clean backlink profile",
          "Natural link acquisition pattern"
        ]
      },
      recommendations: [
        "Implement XML sitemap and robots.txt file immediately",
        "Conduct comprehensive keyword research and mapping",
        "Expand content to 600-1,200 words per page minimum",
        "Launch blog or resource center for topical authority",
        "Execute strategic link building campaign",
        "Monitor Core Web Vitals and user experience metrics",
        "Develop internal linking strategy for better PageRank flow",
        "Regular backlink profile monitoring and cleanup"
      ],
      estimatedBenefit: `By addressing these high-impact issues, ${domain} can expect a significant improvement in search visibility, potentially doubling or tripling organic traffic in 4–6 months. Authority metrics could increase by 5–10 points with focused optimization, while improved technical crawlability and content depth should increase user retention and conversions.`,
      fullAnalysis: `${domain} shows promise as a digital platform but requires strategic SEO improvements to achieve competitive search visibility. The current domain authority is relatively low, indicating room for substantial growth through targeted optimization efforts.

**Technical Foundation**: The site demonstrates solid technical fundamentals with HTTPS implementation, fast load times, and clean server configuration. However, critical crawlability elements like XML sitemaps and robots.txt files are missing, potentially limiting search engine discovery and indexing efficiency.

**Content Strategy**: While existing content is original and well-structured, the depth and breadth need expansion. Current word counts fall below industry benchmarks for establishing topical authority, and the site lacks supporting content clusters that could capture long-tail search opportunities.

**Authority Building**: The backlink profile shows healthy characteristics with low spam scores and clean link sources, but the volume is insufficient for competitive ranking. A strategic link building campaign focusing on high-authority, relevant sources could significantly impact search performance.

**Optimization Opportunities**: The site's technical performance provides a strong foundation for SEO success. With proper keyword targeting, expanded content creation, and strategic link acquisition, ${domain} is well-positioned to achieve substantial organic growth and improved search visibility across target market segments.`
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportAnalysis = async () => {
    if (!output) return;

    const content = `SEO ANALYSIS REPORT
Website: ${websiteUrl}
Generated: ${new Date().toLocaleDateString()}

SUMMARY METRICS:
- Domain Authority: ${output.summary.domainAuthority}
- Page Authority: ${output.summary.pageAuthority}
- Spam Score: ${output.summary.spamScore}
- Backlinks: ${output.summary.backlinks}
- Load Time: ${output.summary.loadTime}s

TECHNICAL SEO ISSUES:
${output.technicalSEO.issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

TECHNICAL SEO STRENGTHS:
${output.technicalSEO.strengths.map((strength, i) => `${i + 1}. ${strength}`).join('\n')}

ON-PAGE SEO ISSUES:
${output.onPageSEO.issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

ON-PAGE SEO STRENGTHS:
${output.onPageSEO.strengths.map((strength, i) => `${i + 1}. ${strength}`).join('\n')}

CONTENT QUALITY (${output.contentQuality.wordCount} words):
Issues:
${output.contentQuality.issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

Strengths:
${output.contentQuality.strengths.map((strength, i) => `${i + 1}. ${strength}`).join('\n')}

BACKLINKS & AUTHORITY:
Issues:
${output.backlinksAuthority.issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

Strengths:
${output.backlinksAuthority.strengths.map((strength, i) => `${i + 1}. ${strength}`).join('\n')}

RECOMMENDATIONS:
${output.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

ESTIMATED BENEFIT:
${output.estimatedBenefit}

FULL ANALYSIS:
${output.fullAnalysis}

---
Generated by AI SEO Analysis Agent`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${websiteUrl.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_seo_analysis.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

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
                  ? "text-green-400 border-green-400"
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
                  ? "text-green-400 border-green-400"
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
                    <Search className="w-5 h-5 text-green-400" />
                    SEO Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl" className="text-gray-300">
                      Website URL *
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="websiteUrl"
                        placeholder="e.g., spruntler.com or https://example.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                      />
                    </div>
                    {websiteUrl && !isValidUrl(websiteUrl) && (
                      <p className="text-red-400 text-sm">Please enter a valid website URL</p>
                    )}
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      What we analyze:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        Technical SEO Performance
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        On-Page Optimization
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        Content Quality Assessment
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        Backlink Profile Analysis
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        Core Web Vitals
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        Actionable Recommendations
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Analysis typically takes 30-60 seconds
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>Credits required:</span>
                      <Badge
                        variant="outline"
                        className="border-green-500/30 text-green-300"
                      >
                        20 credits
                      </Badge>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!websiteUrl.trim() || !isValidUrl(websiteUrl) || isGenerating}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Website SEO...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Analyze SEO Performance
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
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 animate-pulse"></div>
                          <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-medium">
                            Analyzing your website's SEO...
                          </p>
                          <p className="text-gray-400 text-sm">
                            Checking technical performance, content, and backlinks
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : output ? (
                  <div className="space-y-6">
                    {/* Summary Metrics */}
                    <Card className="bg-gray-900/50 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-white">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            SEO Performance Summary
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
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <div className="text-2xl font-bold text-white">{output.summary.domainAuthority}</div>
                            <div className="text-xs text-gray-400">Domain Authority</div>
                          </div>
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <div className="text-2xl font-bold text-white">{output.summary.pageAuthority}</div>
                            <div className="text-xs text-gray-400">Page Authority</div>
                          </div>
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <div className="text-2xl font-bold text-white">{output.summary.spamScore}</div>
                            <div className="text-xs text-gray-400">Spam Score</div>
                          </div>
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <div className="text-2xl font-bold text-white">{output.summary.backlinks}</div>
                            <div className="text-xs text-gray-400">Backlinks</div>
                          </div>
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <div className="text-2xl font-bold text-white">{output.summary.loadTime}s</div>
                            <div className="text-xs text-gray-400">Load Time</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Analysis Sections */}
                    {[
                      { title: "Technical SEO", data: output.technicalSEO, icon: CheckCircle, color: "blue" },
                      { title: "On-Page SEO", data: output.onPageSEO, icon: Search, color: "purple" },
                      { title: "Content Quality", data: output.contentQuality, icon: FileText, color: "yellow" },
                      { title: "Backlinks & Authority", data: output.backlinksAuthority, icon: Link, color: "pink" }
                    ].map((section, index) => (
                      <Card key={index} className="bg-gray-900/50 border-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <section.icon className={`w-5 h-5 text-${section.color}-400`} />
                            {section.title}
                            {section.title === "Content Quality" && (
                              <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-300">
                                {output.contentQuality.wordCount} words
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Issues to Address
                              </h4>
                              <div className="space-y-2">
                                {section.data.issues.map((issue, i) => (
                                  <div key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                    {issue}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Current Strengths
                              </h4>
                              <div className="space-y-2">
                                {section.data.strengths.map((strength, i) => (
                                  <div key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                    {strength}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Recommendations */}
                    <Card className="bg-gray-900/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Sparkles className="w-5 h-5 text-orange-400" />
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
                              <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-orange-400 text-xs font-semibold">
                                  {index + 1}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm">{recommendation}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Estimated Benefit */}
                    <Card className="bg-gray-900/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <TrendingUp className="w-5 h-5 text-green-400" />
                          Estimated SEO Benefit
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <p className="text-gray-300 leading-relaxed">{output.estimatedBenefit}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Full Analysis */}
                    <Card className="bg-gray-900/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <FileText className="w-5 h-5 text-blue-400" />
                          Comprehensive Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-800/50 rounded-lg p-6">
                          <div className="whitespace-pre-wrap text-gray-300 leading-relaxed text-sm">
                            {output.fullAnalysis}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardContent className="py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-400 mb-2">
                          Ready to analyze your website's SEO
                        </h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                          Enter your website URL to receive a comprehensive SEO analysis
                          with actionable recommendations for improvement.
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

export default SEOAnalysisAgentPage;