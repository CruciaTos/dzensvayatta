import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSlideTransition } from "@/components/sections/HeroSlideTransition";
import { TargetMarkets } from "@/components/sections/TargetMarkets";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { IntegrationMarquee } from "@/components/sections/IntegrationMarquee";
import FoundingPrinciples from "@/components/sections/FoundingPrinciples";
import { TargetAreas, Testimonials } from "@/components/sections";
import { WhyUs } from "@/components/sections/WhyUs";
import { CTA } from "@/components/sections/CTA";
import { SectionTransition } from "@/components/sections/SectionTransition";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main id="main-content">
        {/* Hero + PPT-slide transition into CaseStudies — untouched, it
            already owns its own cinematic scroll transition. */}
        <HeroSlideTransition />


        {/* "WE ARE DZEN" scroll-scramble reveal — untouched, it already
            owns its own sticky scroll-progress mechanic. */}
        <FoundingPrinciples />

        <SectionTransition>
          <TargetMarkets />
        </SectionTransition>
        <SectionTransition>
          <TargetAreas />
        </SectionTransition>

        {/* 2. Target Markets — now follows Case Studies */}
        <SectionTransition>
          <CapabilitiesSection />    {/* 3. Methodology (6 Phase) */}
        </SectionTransition>
        {/* 4. Connected Systems */}
        <SectionTransition>
          <Testimonials />
        </SectionTransition>
        <SectionTransition>
          <WhyUs />
        </SectionTransition>
        <SectionTransition>
          <CTA />
        </SectionTransition>




      </main>

      <Footer />                   {/* 8. Footer */}
    </>
  );
}