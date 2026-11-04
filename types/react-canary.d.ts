// Types for React's <ViewTransition>. Next ships it as `unstable_ViewTransition`
// when experimental.viewTransition is on; @types/react/canary names it `ViewTransition`.
/// <reference types="react/canary" />
import type { ExoticComponent, ViewTransitionProps } from "react";

declare module "react" {
  export const unstable_ViewTransition: ExoticComponent<ViewTransitionProps>;
}
