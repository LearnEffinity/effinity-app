import React from "react";
import ProgressCircle from "../../progressCircle";
import DifficultyIcons from "../difficulty";

function formatTitle(title: string): string {
  const lowerWords = new Set([
    "a",
    "of",
    "and",
    "the",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
  ]);

  return title
    .split("-")
    .map((word, index) => {
      if (index === 0 || !lowerWords.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" ");
}

interface LessonIntroCardProps {
  title: string;
  description: string;
  progress: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
}

export default function LessonIntroCard({
  title,
  description,
  progress,
  difficulty,
  duration,
}: LessonIntroCardProps) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-md">
      <div className="flex justify-between">
        <div className="flex-col items-start">
          <h2 className="mb-3 text-4xl font-medium">{formatTitle(title)}</h2>
          <p className="w-3/4 text-base font-normal text-text-secondary">
            {description}
          </p>
        </div>
        <ProgressCircle percentage={progress} />
      </div>
      <div className="mt-9 flex flex-row items-center gap-x-8">
        <DifficultyIcons difficulty={difficulty} />
        <div className="flex gap-x-2">
          <img src="/icons/clock.svg" alt="duration" />
          <p className="pl-[2px] text-xs font-normal leading-5">
            {duration} mins
          </p>
        </div>
      </div>
    </div>
  );
}
