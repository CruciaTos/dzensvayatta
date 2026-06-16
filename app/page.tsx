import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { Credibility } from "@/components/sections/Credibility";
import { TargetMarkets } from "@/components/sections/TargetMarkets";
import { Workflow } from "@/components/sections/Workflow";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Systems } from "@/components/sections/Systems";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { Security } from "@/components/sections/Security";
import { CTA } from "@/components/sections/CTA";


export default function HomePage() {

  return (
    <>
      <Navbar />

      <main id="main-content">
        <Hero />
        <Ticker />
        <Credibility />
        <TargetMarkets />
        <Systems />
        <CapabilitiesSection />
        <CaseStudies />
        <Workflow />
        <Process />
        <Testimonials />
        <Security />
        <CTA />
      </main>

      <Footer />
    </>
  );
}