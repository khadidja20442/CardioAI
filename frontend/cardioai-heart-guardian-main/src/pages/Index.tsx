import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PredictionForm from "@/components/PredictionForm";
import PricingSection from "@/components/PricingSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <PredictionForm />
    <PricingSection />
    <FeaturesSection />
    <Footer />
  </div>
);

export default Index;
