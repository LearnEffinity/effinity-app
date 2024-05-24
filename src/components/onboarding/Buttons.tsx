import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface ButtonProps{
    onClick?: () => void;
    disabled?: boolean;
}

export function Continue ({
    onClick,
    disabled = true,
}: ButtonProps){
    return (
        <button 
            className={`py-[12px] px-[28px] ${disabled ? 'bg-button-disabled' : 'bg-button-pressed'} text-surface-primary rounded-md`} 
            onClick={onClick}
            disabled={disabled}
        >
            <div className="flex items-center gap-x-1">
                Continue
                <IoIosArrowForward />
            </div>
        </button>
    )
}

export function GoBack ({ onClick }: ButtonProps){
    return(
        <button className="flex py-[12px] px-[16px] text-surface-tertiary rounded-md" onClick={onClick}>
            <div className="flex items-center gap-x-1">
                <IoIosArrowBack />
                Back
            </div>
        </button>
    )
}