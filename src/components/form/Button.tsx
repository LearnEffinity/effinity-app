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
      className={`rounded-lg w-full bg-button hover:bg-button-hover disabled:bg-button-disabled focus:bg-button-pressed text-white font-medium transition-colors ${styleMap[size]} ${variantMap[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
