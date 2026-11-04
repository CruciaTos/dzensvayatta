import { ProductPager } from "@/components/sections/ProductPager";
import { ProjectsShowcase, GROWMONT_PMS_PROJECT } from "@/components/sections/ProjectsShowcase";

export const metadata = {
  title: "Growmont PMS",
  description:
    "Growmont PMS: a fund analysis and scoring platform for wealth managers, in development at Svayatta.",
};

export default function GrowmontPmsProjectPage() {
  return (
    <>
      <ProjectsShowcase project={GROWMONT_PMS_PROJECT} />
      <ProductPager current="/projects/growmont-pms" />
    </>
  );
}
