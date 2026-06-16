import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { TargetMarkets } from "@/components/sections/TargetMarkets";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { Systems } from "@/components/sections/Systems";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { GrowthImpact } from "@/components/sections/GrowthImpact";
import { OptimisationComparison } from "@/components/sections/OptimisationComparison";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main id="main-content">
        <Hero />                    {/* 1. Hero Page */}
        <Ticker />
        <CaseStudies />             {/* 5. Case Studies / Project Demos */}
        <TargetMarkets />             {/* 2. Areas we can target */}
        <CapabilitiesSection />     {/* 3. Methodology (6 Phase) */}
        <Systems />                 {/* 4. Connected Systems */}

        <GrowthImpact />
        <OptimisationComparison />  {/* 6. Optimisation Comparison Chart */}
        <Contact />                 {/* 7. Contact Info */}
      </main>

      <Footer />                    {/* 8. Footer */}
    </>
  );
}