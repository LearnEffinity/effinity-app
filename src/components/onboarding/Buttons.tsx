import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function Continue({ onClick, disabled = false }: ButtonProps) {
  return (
    <button
      className={`px-7 py-3 ${disabled ? "bg-button-disabled" : "bg-button-pressed"} rounded-md text-surface-primary`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center gap-x-1">
        Continue
        <IoIosArrowForward />
      </div>
    </button>
  );
}

export function GoBack({ onClick }: ButtonProps) {
  return (
    <button
      className="flex rounded-md px-4 py-3 text-surface-tertiary"
      onClick={onClick}
    >
      <div className="flex items-center gap-x-1">
        <IoIosArrowBack />
        Back
      </div>
    </button>
  );
}
