import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import OTPPage from "./pages/OTPPage";
import FAQPage from "./pages/FAQPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import AgentsPage from "./pages/AgentsPage";
// import AgentDetailPage from "./pages/AgentDetailPage";
import ProfilePage from "./pages/ProfilePage";
import BillingPage from "./pages/BillingPage";
import BuyCreditsPage from "./pages/BuyCreditsPage";
import BlogAgentPage from "./pages/agents/blog-agent";
import "./App.css";
import SocialMediaAgentPage from "./pages/agents/social-media-post-generator";
import CopyOptimizationAgentPage from "./pages/agents/copy-optimization-agent-page";
import SEOAnalysisAgentPage from "./pages/agents/seo-analysis-agent";
import CampaignStrategyAgentPage from "./pages/agents/campaign-strategy-agent";
import CompetitorAnalysisAgentPage from "./pages/agents/competitor-analysis-agent";
import AudienceResearchAgentPage from "./pages/agents/audience-research-agent";
import NotFoundPage from "./pages/NotFoundPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-black text-white">
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/otp" element={<OTPPage />} />
            <Route path="/faq" element={<FAQPage />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AgentsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/agents/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AgentDetailPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BillingPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buy-credits"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BuyCreditsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents/blog-agent"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BlogAgentPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents/social-media-post-generator"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SocialMediaAgentPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents/copy-optimization-agent"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CopyOptimizationAgentPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents/seo-analysis-agent"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SEOAnalysisAgentPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents/campaign-strategy-agent"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CampaignStrategyAgentPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents/competitor-analysis-agent"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CompetitorAnalysisAgentPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents/audience-research-agent"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AudienceResearchAgentPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
