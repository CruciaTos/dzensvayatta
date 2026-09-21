import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectsShowcase, GROWMONT_PMS_PROJECT } from "@/components/sections/ProjectsShowcase";

export const metadata = {
  title: "Growmont PMS | DZen",
  description:
    "Growmont PMS — a fund analysis and scoring platform for wealth managers, in development at DZen.",
};

export default function GrowmontPmsProjectPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="min-h-screen">
        <ProjectsShowcase project={GROWMONT_PMS_PROJECT} />
      </main>

      <Footer />
    </>
  );
}
