import React from "react";
import ContinueModule from "./continueCard";

// Define the type for the difficulty
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

// Define the type for each item in the data array
interface ModuleData {
  moduleID: number;
  title: string;
  duration: string;
  difficulty: Difficulty;
  progress: number;
  image: string;
  slug: string;
}

// Dummy Data
const data: ModuleData[] = [
  {
    moduleID: 1,
    title: "Basics to budgeting",
    duration: "20",
    difficulty: "Beginner",
    progress: 75,
    image: "/screen-1/Coin.png",
    slug: "basics-to-budgeting",
  },
  {
    moduleID: 2,
    title: "Creating a budget",
    duration: "20",
    difficulty: "Intermediate",
    progress: 75,
    image: "/screen-1/Pig.png",
    slug: "creating-a-budget",
  },
];

export default function Continue() {
  return (
    <>
      <div className="my-10">
        <h1 className="mb-6 text-2xl font-semibold text-text-primary">
          Continue Learning
        </h1>
        <div className="flex flex-row items-start gap-6">
          {data.map((module) => (
            <ContinueModule
              key={module.moduleID}
              moduleID={module.moduleID}
              title={module.title}
              duration={module.duration}
              difficulty={module.difficulty}
              progress={module.progress}
              image={module.image}
              slug={module.slug}
            />
          ))}
        </div>
      </div>
    </>
  );
}
