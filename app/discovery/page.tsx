import { Navbar } from "@/components/layout/Navbar";
import { DiscoveryForm } from "@/components/sections/DiscoveryForm";
import { HeroNoirBackground } from "@/components/ui/HeroNoirBackground";

export const metadata = {
  title: "Request a Discovery Call — DZen",
  description: "Schedule a discovery call with  to discuss how we can integrate AI into your business operations.",
};

export default function DiscoveryPage() {
  return (
    <>
      <Navbar />

      <main id="main-content">
        <HeroNoirBackground className="min-h-screen flex items-center justify-center pt-16 pb-16 px-6">
          <div className="relative z-10 w-full max-w-[580px]">
            <DiscoveryForm />
          </div>
        </HeroNoirBackground>
      </main>
    </>
  );
}
