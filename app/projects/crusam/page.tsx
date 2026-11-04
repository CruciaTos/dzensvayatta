import { ProductPager } from "@/components/sections/ProductPager";
import { ProjectsShowcase, CRUSAM_PROJECT } from "@/components/sections/ProjectsShowcase";
import { WorkSpotlight } from "@/components/sections/WorkSpotlight";

export const metadata = {
  title: "CruSam",
  description:
    "CruSam: a payroll and finance ERP with a built-in AI assistant, live at Aarti Enterprises. Built and supported by Svayatta.",
};

export default function CruSamProjectPage() {
  return (
    <>
      <ProjectsShowcase project={CRUSAM_PROJECT} />
      <WorkSpotlight />
      <ProductPager current="/projects/crusam" />
    </>
  );
}
