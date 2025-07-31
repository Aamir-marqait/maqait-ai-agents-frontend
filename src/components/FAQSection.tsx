import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "Do I need technical expertise to use MARQAIT B2B?",
    answer:
      'No. Following our "Radical Simplicity" principle, the platform is designed for marketing teams without technical backgrounds. You simply input your business context, and the agents generate professional-grade outputs. For custom integrations, our team handles the technical implementation.',
  },
  {
    question: "How quickly can my team start using the platform?",
    answer:
      "Most businesses are generating content within 24 hours of receiving credentials. The three-step onboarding process (Business Profile Setup, Agent Configuration, Content Generation) typically takes 30-60 minutes to complete.",
  },
  {
    question: "What's the difference between pre-built and custom agents?",
    answer:
      "Pre-built agents are ready-to-use marketing tools that work for most businesses immediately. Custom agents are specifically built for your unique workflows, industry requirements, or integration needs.",
  },
  {
    question: "Can I modify the pre-built agents?",
    answer:
      "Yes, all pre-built agents can be customized with your brand guidelines, tone of voice, industry context, and specific business parameters. However, the core functionality remains consistent to ensure quality and performance.",
  },
  {
    question: "How do I request a custom agent?",
    answer:
      'Contact your account manager or use the "Request Custom Agent" feature in your dashboard. We\'ll schedule a requirements discussion, provide a development timeline and cost estimate, then build and deploy the agent specifically for your business needs.',
  },
  {
    question: "What happens if a pre-built agent doesn't meet my needs?",
    answer:
      "You can provide feedback directly through the platform to improve the agent's performance for your use case. For significant modifications, we can discuss custom agent development or hybrid solutions that blend pre-built functionality with custom features.",
  },
  {
    question:
      "How does the platform integrate with our existing marketing tools?",
    answer:
      "MARQAIT will offer API endpoints, webhooks, and pre-built integrations with major platforms like HubSpot, Salesforce, Shopify, and social media management tools. For custom integrations, our technical team can develop specific connectors for your existing systems.",
  },
  {
    question:
      "Can we embed agents directly into our website or internal tools?",
    answer:
      "Yes, agents can be embedded via JavaScript widgets, iframe integration, or API calls. Our team provides implementation support and can customize the embedding to match your brand and user experience requirements.",
  },
  {
    question: "What data does the platform access from our business?",
    answer:
      "The platform only accesses data you explicitly provide during setup and ongoing use. This includes your business profile, brand guidelines, content preferences, and any integrations you approve. All data is encrypted and stored securely with full GDPR/CCPA compliance.",
  },
  {
    question: "Is our business data secure?",
    answer:
      "Yes. We use end-to-end encryption, multi-factor authentication and undergo regular security audits. Your data is isolated in our multi-tenant architecture and never shared with other clients.",
  },
  {
    question: "How do I measure the ROI of using MARQAIT B2B?",
    answer:
      "The platform includes built-in analytics that track content performance, time saved, campaign effectiveness, and cost reduction. Most clients see 60-80% time savings and 40-60% cost reduction in their marketing operations within the first quarter.",
  },
  {
    question: "What if the content generated doesn't match our brand voice?",
    answer:
      "During onboarding, you'll upload brand guidelines and provide voice samples. The agents learn your specific tone and style. If adjustments are needed, use the feedback system to refine outputs, or contact support for brand voice recalibration.",
  },
  {
    question: "Can multiple team members use the platform simultaneously?",
    answer: "Yes, the platform supports multiple users.",
  },
  {
    question: "How often are the agents updated and improved?",
    answer:
      "Pre-built agents receive regular updates based on performance data and user feedback. You'll be notified of major improvements, and updates are deployed seamlessly without disrupting your workflow. Custom agents are updated based on your specific requirements and feedback.",
  },
  {
    question: "How is pricing structured for B2B accounts?",
    answer:
      "We use a transparent pay-as-you-go model for pre-built agents. Custom AI solutions built specifically for your business operate on monthly subscription pricing based on the specific agents and features included.",
  },
  {
    question: "Is there a minimum contract period?",
    answer:
      "No minimum commitment for pay-as-you-go usage of pre-built agents - you can start and stop anytime. Custom AI solutions typically require monthly subscriptions with flexible terms based on your specific requirements and development investment.",
  },
  {
    question: "Can we upgrade or downgrade our plan as needed?",
    answer:
      "Since pre-built agents are pay-as-you-go, there's no plan to upgrade or downgrade - you simply use what you need when you need it. For custom AI solutions, subscription features can be modified monthly based on your evolving requirements.",
  },
  {
    question: "How do we manage costs and usage?",
    answer:
      "Your dashboard includes real-time usage tracking, cost monitoring, and spending controls. You can set monthly budget limits for agent executions and receive alerts as you approach your thresholds. Detailed usage reports help you optimize which agents provide the best ROI for your business.",
  },
  {
    question: "What information do we need to provide during onboarding?",
    answer:
      "You'll need basic business information (industry, size, target audience), brand guidelines (logos, colors, voice samples), integration preferences, and your primary marketing goals. The more context you provide, the better the agents perform from day one.",
  },
  {
    question: "Do you offer training for our marketing team?",
    answer:
      "Yes, we provide comprehensive onboarding training, best practices workshops, and ongoing education as new features are released. Training can be conducted remotely or on-site based on your preferences.",
  },
  {
    question:
      "What if we need help with strategy beyond what the agents provide?",
    answer:
      "While our agents handle execution brilliantly, we also offer strategic consulting services to help you develop comprehensive marketing strategies, optimize your agent usage, and maximize ROI from the platform.",
  },
  {
    question: "Can we start with a trial or pilot program?",
    answer:
      "Yes, we offer pilot programs for qualified businesses to test the platform with a subset of agents and users. This allows you to evaluate effectiveness and train your team before full deployment.",
  },
];

const FAQSection = () => {
  const navigate = useNavigate();
  const displayedFaqs = faqs.slice(0, 3);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about Marqait
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {displayedFaqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-gray-900/30 border border-gray-800 rounded-lg px-6 hover:border-violet-500/50 transition-colors !border-b-gray-800"
            >
              <AccordionTrigger className="text-left text-white hover:text-violet-400 py-6 cursor-pointer">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/faq")}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white hover:text-white border-0 px-8 py-3 text-lg font-semibold rounded-full"
          >
            See More FAQs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
