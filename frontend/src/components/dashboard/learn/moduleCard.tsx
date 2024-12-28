import React from "react";
import DifficultyIcons from "./difficulty";
import SupabaseImage from "../supabaseImage";
interface RegularModuleCardProps {
  moduleID: Number;
  title: string;
  duration: string;
  difficulty: "1" | "2" | "3";
  topic: string;
  image: string;
  description: string;
  module_number: number;
}

export default function RegModuleCard({
  moduleID,
  title,
  duration,
  difficulty,
  image,
  topic,
  description,
  module_number,
}: RegularModuleCardProps) {
  return (
    <>
      <div className="flex h-[496px] w-[392px] flex-col items-center rounded-xl bg-neutral-50">
        <SupabaseImage
          filePath={image}
          alt={title}
          className="h-[200px] w-[300px] px-9 py-5"
          type="module_images"
        />
        <div className="flex h-full w-full flex-col gap-y-4 rounded-b-xl bg-surface-base p-6">
          <div className="flex flex-col gap-y-2">
            <h3 className="text-sm font-normal leading-6 text-text-secondary">
              Module {`${module_number}`}
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
              href={`/learn/${topic}/${module_number}`}
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
