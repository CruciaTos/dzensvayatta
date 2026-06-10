import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost";
type ButtonSize   = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button"; href?: never };

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-accent text-bg-primary font-medium tracking-wider",
    "hover:bg-accent-light hover:-translate-y-px",
    "transition-[background-color,transform] duration-200 ease-out-expo",
  ].join(" "),
  ghost: [
    "bg-transparent text-stone-400 font-normal tracking-wide",
    "border border-border-strong",
    "hover:text-stone-100 hover:border-stone-400",
    "transition-[color,border-color] duration-200",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-[13px]",
  md: "px-6 py-[10px] text-[13px]",
  lg: "px-8 py-[14px] text-[14px]",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center gap-2 cursor-pointer",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if ((props as ButtonAsAnchor).as === "a") {
    const { as, ...anchorProps } = props as ButtonAsAnchor;
    void as;
    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { as, ...buttonProps } = props as ButtonAsButton;
  void as;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
