import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase";

export const metadata = {
  title: "Projects | DZen",
  description:
    "A showcase of the systems DZen has built — CruSam, CruDoc, and the platform we run ourselves.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-black min-h-screen">
        <ProjectsShowcase />
      </main>

      <Footer />
    </>
  );
}
