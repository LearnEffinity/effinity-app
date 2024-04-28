import Icon from "../Icon";

type InputProps = {
  type?: "text" | "email" | "password";
  state?: "normal" | "error" | "success";
  size?: "sm" | "md" | "lg";
  subtext?: React.ReactNode;
  iconHidden?: boolean;
  onChange?: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange">;

const sizeMap = {
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
};

const stateMap = {
  normal: "border-input",
  error: "border-input-error",
  success: "border-input-success",
};

export default function Input({
  type = "text",
  state = "normal",
  size = "md",
  iconHidden = false,
  onChange,
  className,
  subtext,
  ...props
}: InputProps) {
  return (
    <div className="rounded-lg text-sm w-full flex flex-col gap-2">
      <input
        {...props}
        type={type}
        onChange={(e) => onChange?.(e.target.value)}
        className={`p-4 w-full bg-input-surface border focus:border-input-pressed rounded-lg placeholder:text-text-tertiary ${sizeMap[size]} ${stateMap[state]} ${className}`}
      />
      {state !== "normal" && (
        <span
          className={`flex items-center gap-1.5 ${
            state === "error" ? "text-input-error" : "text-input-success"
          }`}
        >
          {!iconHidden &&
            (state === "error" ? (
              <Icon name="x-circle" className="text-lg" />
            ) : (
              <Icon name="check-circle" className="text-lg" />
            ))}
          {subtext}
        </span>
      )}
    </div>
  );
}

export function InputWithLabel({
  label,
  className,
  inputClassName,
  ...props
}: {
  label: string;
  inputClassName?: string;
} & InputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={label} className="text-text-secondary font-medium">
        {label}
      </label>
      <Input {...props} className={inputClassName} id={label} />
    </div>
  );
}
