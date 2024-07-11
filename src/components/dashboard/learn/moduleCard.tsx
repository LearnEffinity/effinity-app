import React from "react";
import DifficultyIcons from "./difficulty";

interface RegularModuleCardProps {
  moduleID: Number;
  title: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  description: string;
  slug: string;
}

export default function RegModuleCard({
  moduleID,
  title,
  duration,
  difficulty,
  image,
  description,
  slug,
}: RegularModuleCardProps) {
  return (
    <>
      <div className="flex h-[496px] w-[392px] flex-col items-center rounded-xl bg-neutral-50">
        <img
          src={image}
          className="h-[200px] w-[300px] px-9 py-5"
          alt={`ModuleImage-${image}`}
        />
        <div className="flex h-full w-full flex-col gap-y-4 rounded-b-xl bg-surface-base p-6">
          <div className="flex flex-col gap-y-2">
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
          <h6 className="mb-8 text-base font-normal text-text-secondary">
            {description}
          </h6>

          <div className="flex w-full justify-end">
            <a
              href={`/learn/${slug}`}
              className=" inline-block bg-transparent px-4 py-2 text-brand-accent transition-colors duration-300 ease-in-out hover:text-brand-tertiary"
            >
              Start
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
