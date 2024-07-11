import React from "react";
import RegModuleCard from "./moduleCard";

interface ModuleCardProps {
  moduleID: number;
  title: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  description: string;
  slug: string;
}

interface TopicProps {
  title: string;
  description: string;
  modules: ModuleCardProps[];
}

const topicsData: TopicProps[] = [
  {
    title: "Budgeting",
    description:
      "Gain practical insights and essential skills to effectively manage your finances, ensuring financial stability and peace of mind in your daily life.",
    modules: [
      {
        moduleID: 3,
        title: "Budgeting Strategies",
        duration: "20",
        difficulty: "Beginner",
        image: "/screen-3/Budget.png",
        description:
          "Discover techniques to optimize your budgeting and financial efficiency.",
        slug: "budgeting-strategies",

      },
      {
        moduleID: 4,
        title: "Managing Debt",
        duration: "60",
        difficulty: "Advanced",
        image: "/screen-3/Debt.png",
        description:
          "Learn to effectively manage your debt, paving the way to financial freedom",
        slug: "managing-debt",

      },
      {
        moduleID: 5,
        title: "Long-Term Budgeting",
        duration: "45",
        difficulty: "Advanced",
        image: "/screen-3/Insurance.png",
        description:
          "Explore strategies for long-term budgeting and build wealth over time",
        slug: "long-term-budgeting",
      },
      // !Add more modules for Budgeting
    ],
  },
  // !You can add more topics here
];

export default function Recommended() {
  return (
    <>
      <div className="mt-10">
        <h1 className="mb-6 text-4xl font-semibold text-text-primary ">
          Recommended for You
        </h1>
        {topicsData.map((topic, index) => (
          <div key={index} className="mb-10">
            <h2 className="text-3xl font-medium text-text-primary">
              {topic.title}
            </h2>
            <h3 className="mb-6 w-1/2 text-lg font-medium text-text-secondary">
              {topic.description}
            </h3>
            <div className="flex flex-wrap gap-6">
              {topic.modules.map((module) => (
                <RegModuleCard
                  key={module.moduleID}
                  moduleID={module.moduleID}
                  title={module.title}
                  duration={module.duration}
                  difficulty={module.difficulty}
                  image={module.image}
                  description={module.description}
                  slug={module.slug}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
