import React from "react";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-grow flex-col">
        <div className="flex flex-row items-center justify-between px-8 py-7 shadow-xl">
          <CloseIcon />
          <div className="h-2 w-1/2 rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-brand-accent"
              style={{ width: "15%" }}
            ></div>
          </div>
          <div className="flex items-center ">
            <svg
              width="24"
              height="24"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.33398 15.2292C3.33398 23.3341 10.033 27.6531 14.9369 31.5189C16.6673 32.883 18.334 34.1674 20.0007 34.1674C21.6673 34.1674 23.334 32.883 25.0644 31.5189C29.9683 27.6531 36.6673 23.3341 36.6673 15.2292C36.6673 7.12434 27.5004 1.37651 20.0007 9.16845C12.5009 1.37651 3.33398 7.12434 3.33398 15.2292Z"
                fill="#EC2D30"
              />
            </svg>
            <p className="ml-1 text-xl font-normal text-text-secondary">6</p>
          </div>
        </div>
        <div className="flex-grow">{children}</div>
        <div className="flex flex-row items-center justify-between border-t border-surface-secondary px-8 py-6">
          <button className="flex items-center gap-x-2 rounded-lg px-4 py-2 hover:bg-neutral-200">
            <FlagIcon />
            <p className="text-xl font-medium text-text-secondary">Report</p>
          </button>
          <button className="rounded-lg bg-button px-7 py-3 text-surface-primary">
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}

const CloseIcon = ({ className }: { className?: string }) => {
  return (
    <>
      <button>
        <svg
          width="24"
          height="24"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </>
  );
};

const FlagIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
      />
    </svg>
  );
};
