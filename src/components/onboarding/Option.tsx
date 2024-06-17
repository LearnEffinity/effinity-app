import Image from "next/image";

interface OptionProps {
  title: string;
  description: string;
  image: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  font?: string;
}

export function FinancialGoal({
  title,
  image,
  onClick,
  className,
  description,
  selected = false,
  disabled = false,
}: Omit<OptionProps, "font" | "disabled"> & { disabled?: boolean }) {
  return (
    <button
      role="button"
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${disabled && "cursor-default opacity-50"} ${selected ? "border-brand-accent" : "border-transparent hover:border-surface-secondary"} flex flex-col items-center gap-5 rounded-2xl border-4 bg-surface-base p-4 transition-colors sm:flex-row md:p-6`}
    >
      <Image src={image} width={132} height={132} alt={title} />
      <div className="flex flex-col gap-2 text-left">
        <span className="text-2xl font-medium">{title}</span>
        <p className="text-lg">{description}</p>
      </div>
    </button>
  );
}

export function ProficiencyLevel({
  title,
  description,
  image,
  onClick,
  className,
  selected = false,
}: OptionProps) {
  return (
    <button
      role="button"
      onClick={onClick}
      className={`${className} ${selected ? "border-brand-accent" : "border-transparent hover:border-surface-secondary"} flex flex-col items-center justify-center gap-20 rounded-2xl border-4 bg-surface-base p-8 pt-16 text-center transition-colors`}
    >
      <Image src={image} width={240} height={240} alt={title} />
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl font-semibold">{title}</span>
        <p className="text-lg">{description}</p>
      </div>
    </button>
  );
}

export function Topic({
  title,
  image,
  onClick,
  className,
  font,
  selected = false,
  disabled = false,
}: Omit<OptionProps, "description"> & { disabled?: boolean }) {
  return (
    <button
      role="button"
      onClick={onClick}
      className={`${className} ${disabled && "cursor-default opacity-50"} flex flex-col items-center gap-3 transition-opacity duration-500 ease-out`}
    >
      <div
        className={`${selected ? "border-brand-accent" : !disabled ? "border-transparent hover:border-surface-secondary" : "border-transparent"} grid w-full flex-grow place-items-center rounded-2xl border-4 bg-surface-base p-4`}
      >
        <Image src={image} width={244} height={168} alt={title} />
      </div>
      <span className={`font-semibold ${font}`}>{title}</span>
    </button>
  );
}
