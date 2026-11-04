import Link from "next/link";
import { type MouseEventHandler, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowCircle, type ArrowCircleVariant } from "./ArrowCircle";

export type PillVariant = "outline" | "dark" | "light" | "sky";

interface BaseProps {
  variant?: PillVariant;
  size?: "sm" | "md";
  /** Show the ArrowCircle. */
  icon?: boolean;
  /** Only changes the outline variant: "night" draws it in light ink for dark bands. */
  tone?: "light" | "night";
  className?: string;
  children: ReactNode;
}

interface LinkProps extends BaseProps {
  href: string;
  /** Opens in a new tab. http(s) links outside svayatta.in are treated as external automatically. */
  external?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

interface ButtonProps extends BaseProps {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export type PillButtonProps = LinkProps | ButtonProps;

const BASE =
  "group/pill inline-flex select-none items-center justify-between whitespace-nowrap rounded-pill font-sans transition-[background-color,color,border-color,transform,box-shadow] duration-med ease-expo active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

function variantClasses(variant: PillVariant, tone: "light" | "night") {
  switch (variant) {
    case "outline":
      return tone === "night"
        ? "border border-night-ink text-night-ink hover:bg-night-ink hover:text-night"
        : "border border-ink text-ink hover:bg-ink hover:text-paper";
    case "dark":
      return "bg-ink text-paper hover:-translate-y-0.5 hover:shadow-hover";
    case "light":
      return "bg-paper text-ink hover:-translate-y-0.5";
    case "sky":
      return "bg-sky text-night hover:-translate-y-0.5";
  }
}

function circleFor(variant: PillVariant, tone: "light" | "night"): {
  variant: ArrowCircleVariant;
  className?: string;
} {
  switch (variant) {
    case "outline":
      return tone === "night"
        ? { variant: "sky" }
        : { variant: "filled", className: "group-hover/pill:bg-paper group-hover/pill:text-ink" };
    case "dark":
      return { variant: "sky" };
    case "light":
      return { variant: "filled" };
    case "sky":
      return { variant: "night" };
  }
}

export function pillClasses({
  variant = "outline",
  size = "md",
  icon = true,
  tone = "light",
}: Pick<BaseProps, "variant" | "size" | "icon" | "tone"> = {}) {
  return cn(
    BASE,
    variantClasses(variant, tone),
    size === "md" ? "h-11 gap-3 text-button" : "h-9 gap-2.5 text-[13px] font-medium",
    icon ? (size === "md" ? "pl-5 pr-[10px]" : "pl-4 pr-[6px]") : "px-5"
  );
}

function isExternal(href: string) {
  return /^https?:\/\//.test(href) && !/^https?:\/\/(www\.)?svayatta\.in/.test(href);
}

/** The pill used for every CTA. Renders a link when `href` is set, otherwise a <button>. */
export function PillButton(props: PillButtonProps) {
  const { variant = "outline", size = "md", icon = true, tone = "light", className, children } = props;
  const classes = cn(pillClasses({ variant, size, icon, tone }), className);
  const circle = circleFor(variant, tone);
  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowCircle
          variant={circle.variant}
          size={24}
          trigger="pill"
          className={circle.className}
        />
      )}
    </>
  );

  if (props.href !== undefined) {
    const { href, external, onClick } = props;
    const plainAnchor = /^(mailto:|tel:|#)/.test(href) || external || isExternal(href);
    if (plainAnchor) {
      const newTab = external ?? isExternal(href);
      return (
        <a
          href={href}
          onClick={onClick}
          className={classes}
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {content}
      </Link>
    );
  }

  const { type = "button", disabled, onClick } = props;
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
