import { HeroSection } from "@/components/landing/HeroSection";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturePreviewSection } from "@/components/landing/FeaturePreviewSection";
import { PricingPreviewSection } from "@/components/landing/PricingPreviewSection";
import { EarlyAccessForm } from "@/components/landing/EarlyAccessForm";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1">
        <HeroSection />
        <TrustStrip />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <FeaturePreviewSection />
        <PricingPreviewSection />
        <EarlyAccessForm />
      </main>
      <Footer />
    </div>
  );
}
