import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectsShowcase, GROWMONT_CRM_PROJECT } from "@/components/sections/ProjectsShowcase";
import { GrowmontDownload } from "@/components/sections/GrowmontDownload";

export const metadata = {
  title: "Growmont CRM | DZen",
  description:
    "Growmont CRM — a local-first CRM for Growmont's clients, sales, and follow-ups, on Windows and Android.",
};

export default function GrowmontProjectPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="min-h-screen">
        <ProjectsShowcase project={GROWMONT_CRM_PROJECT} action={<GrowmontDownload />} />
      </main>

      <Footer />
    </>
  );
}
