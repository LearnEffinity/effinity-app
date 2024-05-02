"use client";

import { useState } from "react";

import Icon from "../Icon";

export default function Checkbox({
  originallyChecked,
  onChange,
  className,
  ...props
}: {
  onChange: (checked: boolean) => void;
  originallyChecked?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [checked, setChecked] = useState(originallyChecked ?? false);

  return (
    <div
      aria-checked={checked}
      role="checkbox"
      className="cursor-pointer"
      onClick={() =>
        setChecked((p) => {
          onChange(!p);
          return !p;
        })
      }
    >
      <input
        readOnly
        type="checkbox"
        checked={checked}
        {...props}
        className="hidden"
      />
      <Icon
        name={checked ? "checkbox-checked" : "checkbox"}
        className={`text-2xl ${className}`}
      />
    </div>
  );
}
