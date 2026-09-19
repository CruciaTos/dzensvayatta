import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectsShowcase, GROWMONT_PROJECT } from "@/components/sections/ProjectsShowcase";
import { GrowmontDownload } from "@/components/sections/GrowmontDownload";

export const metadata = {
  title: "Growmont | DZen",
  description: "Growmont — a growth platform DZen is building.",
};

export default function GrowmontProjectPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="min-h-screen">
        <ProjectsShowcase project={GROWMONT_PROJECT} action={<GrowmontDownload />} />
      </main>

      <Footer />
    </>
  );
}
