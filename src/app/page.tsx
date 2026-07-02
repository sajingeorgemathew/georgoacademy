import { HeroSection } from "@/components/landing/HeroSection";
import { StorySection } from "@/components/landing/StorySection";
import { ExperienceSection } from "@/components/landing/ExperienceSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { EarlyAccessForm } from "@/components/landing/EarlyAccessForm";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1">
        <HeroSection />
        <StorySection />
        <ExperienceSection />
        <PricingSection />
        <EarlyAccessForm />
      </main>
      <Footer />
    </div>
  );
}
