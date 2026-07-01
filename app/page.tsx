import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSlideTransition } from "@/components/sections/HeroSlideTransition";
import { TargetMarkets } from "@/components/sections/TargetMarkets";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { IntegrationMarquee } from "@/components/sections/IntegrationMarquee";
import FoundingPrinciples from "@/components/sections/FoundingPrinciples";
import { Testimonials } from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main id="main-content">
        {/* Hero + PPT-slide transition into CaseStudies */}
        <HeroSlideTransition />
        <IntegrationMarquee />
        <FoundingPrinciples />
        <TargetMarkets />

        {/* 2. Target Markets — now follows Case Studies */}
        <CapabilitiesSection />    {/* 3. Methodology (6 Phase) */}
        {/* 4. Connected Systems */}
        <Testimonials />




      </main>

      <Footer />                   {/* 8. Footer */}
    </>
  );
}