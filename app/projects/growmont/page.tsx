import { ProductPager } from "@/components/sections/ProductPager";
import { ProjectsShowcase, GROWMONT_CRM_PROJECT } from "@/components/sections/ProjectsShowcase";
import { GrowmontDownload } from "@/components/sections/GrowmontDownload";

export const metadata = {
  title: "Growmont CRM",
  description:
    "Growmont CRM: a local-first CRM for Growmont's clients, sales, and follow-ups, on Windows and Android.",
};

export default function GrowmontProjectPage() {
  return (
    <>
      <ProjectsShowcase project={GROWMONT_CRM_PROJECT} action={<GrowmontDownload />} />
      <ProductPager current="/projects/growmont" />
    </>
  );
}
