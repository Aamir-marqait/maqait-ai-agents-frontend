import HeroSection from "../components/HeroSection";
import AIToolsSection from "../components/AIToolsSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <AIToolsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
