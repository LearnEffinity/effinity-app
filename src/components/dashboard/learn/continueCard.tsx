import React from "react";
import DifficultyIcons from "./difficulty";
import Link from "next/link";


interface ContinueModuleCardProps {
  moduleID: Number;
  title: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: Number;
  image: string;
  slug: string;

}

export default function ContinueModule({
  moduleID,
  title,
  duration,
  difficulty,
  progress,
  image,
  slug,

}: ContinueModuleCardProps) {
  return (
    <>
      <div className="flex w-[532px] items-center rounded-xl bg-neutral-50 ">
        <img src={image} className="px-10" alt={`ModuleImage-${image}`} />
        <div className="flex w-full flex-col items-start gap-y-4 rounded-r-xl bg-surface-base p-6">
          <div className="flex flex-col gap-y-1">
            <h3 className="text-sm font-normal leading-6 text-text-secondary">
              Module {`${moduleID}`}
            </h3>
            <h1 className="text-2xl font-medium text-text-primary">{title}</h1>
            <div className="flex flex-row items-center">
              <div className="flex">
                <img src="/icons/clock.svg" alt="duration" />
                <p className="pl-[2px] text-xs font-normal leading-5">
                  {duration} mins
                </p>
              </div>
              <div className=" mx-3 h-1 w-1 rounded-full bg-icon-secondary"></div>
              <DifficultyIcons difficulty={difficulty} />
            </div>
          </div>
          <div className="w-full">
            <h3 className="mb-1 text-xs font-semibold leading-5 text-brand-accent">
              {`${progress}`}% complete
            </h3>
            <div className="mb-5 h-2 w-full rounded-full bg-brand-quaternary">
              <div
                className="h-2 rounded-full bg-brand-accent"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {/* Continue Button */}
            <Link
              href={`/learn/${slug}`}
              className="rounded-lg bg-button px-5 py-2 text-white transition-colors duration-300 ease-in-out hover:bg-button-hover"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
