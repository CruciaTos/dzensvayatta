import { em } from "@/lib/rich";
import { PROCESS_STEPS } from "@/lib/process";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";
import { ProcessCard } from "@/components/ui/ProcessCard";
import { SameBoxScene } from "@/components/motion/SameBoxScene";
import { CLIENT_VOICES_ID } from "@/lib/anchors";

const TITLE = "How we *build*";
const TITLE_CLASS = "text-display-l text-night-ink";

/**
 * How we build (§H7) as a "same box" scene: a small night card at the end of
 * the previous section grows into this section's night stage, and its title
 * moves up into the heading. The four steps then sit on the stage as paper
 * cards. On phones it's a plain night section.
 */
export function Process() {
  return (
    <SameBoxScene
      aria-labelledby="process-title"
      sourceClassName="h-[230px] w-[min(640px,86vw)]"
      sourceRadius={24}
      sourceAlign="start"
      // Grow outward from mid-screen, in place and at an even pace.
      growFromCentre
      // After the hold, the stage opens out to the full screen; Client voices continues on it.
      expandToFull
      // ...and its blue then stays pinned behind Client voices as a still backdrop.
      backdropUntil={CLIENT_VOICES_ID}
      title={em(TITLE)}
      titleClassName={TITLE_CLASS}
      tone="night"
      source={
        <div className="flex flex-col items-center gap-5 text-center">
          <Eyebrow tone="night">How we work</Eyebrow>
          <span data-sb-title-slot className="block" />
          <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-night-muted">
            Audit → Blueprint → Build → Deploy
          </p>
        </div>
      }
    >
      <div className="flex h-full flex-col justify-center px-[clamp(20px,4vw,64px)] py-12 md:py-14">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between md:mb-10">
          <div>
            <Eyebrow tone="night" className="mb-5">
              How we work
            </Eyebrow>
            <h2 id="process-title" data-sb-title className={TITLE_CLASS}>
              {em(TITLE)}
            </h2>
          </div>
          <PillButton href="/discovery" variant="outline" tone="night" className="shrink-0 self-start sm:self-auto">
            Start a project
          </PillButton>
        </div>

        <p className="mb-8 font-mono text-[13px] font-semibold uppercase tracking-[0.16em] text-night-muted md:mb-10">
          Audit → Blueprint → Build → Deploy
        </p>

        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step) => (
            <li key={step.index}>
              <ProcessCard
                index={step.index}
                label={step.label}
                phase={step.phase}
                title={step.title}
                body={step.body}
                outcome={step.outcome}
                className={cn("min-h-[280px] border-transparent hover:border-sky")}
              />
            </li>
          ))}
        </ol>
      </div>
    </SameBoxScene>
  );
}
