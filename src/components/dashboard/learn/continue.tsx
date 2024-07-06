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
  },
  {
    moduleID: 2,
    title: "Creating a budget",
    duration: "20",
    difficulty: "Intermediate",
    progress: 75,
    image: "/screen-1/Pig.png",
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
          {data.map((key) => {
            return (
              <ContinueModule
                moduleID={key.moduleID}
                title={key.title}
                duration={key.duration}
                difficulty={key.difficulty}
                progress={key.progress}
                image={key.image}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
