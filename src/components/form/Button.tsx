import Icon from "../Icon";

import capitalize from "@/utils/capitalize";

const styleMap = {
  sm: "px-5 py-2",
  md: "px-7 py-3 text-xl",
  lg: "px-8 py-3 text-2xl",
};

const variantMap = {
  primary:
    "bg-button hover:bg-button-hover disabled:bg-button-disabled focus:bg-button-pressed text-white",
  outline:
    "bg-button-surface border border-button text-brand-accent hover:border-button-hover hover:text-brand-tertiary focus:border-button-pressed focus:text-button-pressed disabled:text-brand-quaternary disabled:border-button-disabled disabled:text-button-disabled",
};

export default function Button({
  children,
  className,
  disabled,
  onClick,
  type = "button",
  size = "md",
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
} & React.ComponentProps<"button">) {
  return (
    <button
      className={`w-full rounded-lg bg-button font-medium text-white transition-colors hover:bg-button-hover focus:bg-button-pressed disabled:bg-button-disabled ${styleMap[size]} ${variantMap[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

// ! The design for this is not finished in Figma; we still need hover/focus/disabled states.
// ! I'm using the input component as a reference for the design for the time being.
export function SocialMediaButton({
  className,
  disabled,
  onClick,
  variant = "google",
}: {
  onClick?: () => void;
  variant?: "google"; // * Will add more variants when they are added to the design.
} & React.ComponentProps<"button">) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-4 rounded-lg border border-surface-secondary py-3 font-medium text-text-secondary transition-colors hover:border-surface-tertiary ${className}`}
    >
      <Icon name={variant} />
      Continue with {capitalize(variant)}
    </button>
  );
}
