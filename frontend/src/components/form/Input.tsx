"use client";

import { useState } from "react";

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
  const [textVisible, setTextVisible] = useState(type !== "password");

  return (
    <div className="text-sm relative flex w-full flex-col gap-2 rounded-lg">
      <input
        {...props}
        type={textVisible ? (type === "password" ? "text" : type) : "password"}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-lg border bg-input-surface p-4 placeholder:text-text-tertiary focus:border-input-pressed ${sizeMap[size]} ${stateMap[state]} ${className}`}
      />
      {type === "password" && (
        <button
          onClick={() => setTextVisible((p) => !p)}
          type="button"
          className="absolute right-1 top-4 flex h-max w-12 items-center justify-center text-text-tertiary"
        >
          <Icon name={textVisible ? "eye-open" : "eye-closed"} />
        </button>
      )}
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
      <label htmlFor={label} className="font-medium text-text-secondary">
        {label}
      </label>
      <Input {...props} className={inputClassName} id={label} />
    </div>
  );
}
