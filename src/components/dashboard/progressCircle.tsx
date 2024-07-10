import React from "react";

export default function ProgressCircle({ percentage }: { percentage: number }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="h-24 w-24 rounded-full">
      <svg className="h-full w-full" viewBox="0 0 100 100">
        <circle
          className="stroke-current text-transparent"
          strokeWidth="5"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
        />
        <circle
          className="progress-ring__circle stroke-current text-icon-accent-primary"
          strokeWidth="5"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: strokeDashoffset,
          }}
          transform="rotate(-90 50 50)"
        />
        <text
          x="54"
          y="52"
          className="flex items-center justify-center bg-black text-2xl font-bold"
          textAnchor="middle"
          fill="currentColor"
          dy=".3em"
        >
          {`${percentage}%`}
        </text>
      </svg>
    </div>
  );
}
