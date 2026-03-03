import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import {HowItWorksSection} from "@/components/HowItWorks";
import GlobeSection from "@/components/GlobeSection";
import { PricingSection } from "@/components/PricingSection";


export default function Home() {
  return (
    <div className="bg-black text-white overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
        <HowItWorksSection/>
        <PricingSection />
        <GlobeSection />
    </div>
  );
}
