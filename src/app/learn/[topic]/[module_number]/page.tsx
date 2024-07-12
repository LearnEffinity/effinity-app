import LessonIntroCard from "@/components/dashboard/learn/module/lessonIntroCard";
import LessonCard from "@/components/dashboard/learn/module/lessonCard";

import React from "react";

interface PageProps {
  params?: { module_number: string; topic: string };
}

interface LessonIntroProps {
  title: string;
  description: string;
  progress: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
}

export default function ModulePage({ params }: PageProps) {
  console.log("Params:", params);

  const cardInfo: LessonIntroProps = {
    title: params.module_number,
    description:
      "Master the fundamentals of budgeting to take control of your finances and achieve your financial goals.",
    progress: 75,
    difficulty: "Beginner",
    duration: 20,
  };

  const lessonData = [
    {
      lessonNumber: 1,
      title: "Introduction to Budgeting",
      description: "Learn the basics of creating and maintaining a budget.",
      status: "completed" as const,
      slug: "intro-to-budgeting",
    },
    {
      lessonNumber: 2,
      title: "Tracking Expenses",
      description: "Discover effective ways to track your daily expenses.",
      status: "in-progress" as const,
      progress: 60,
      slug: "tracking-expenses",
    },
    {
      lessonNumber: 3,
      title: "Setting Financial Goals",
      description: "Learn how to set and achieve your financial goals.",
      status: "not-started" as const,
      slug: "setting-financial-goals",
    },
  ];

  return (
    <>
      <div className="mb-8 flex w-full justify-between">
        <a
          href="/learn"
          className="flex items-center text-2xl font-medium text-text-secondary transition-all duration-300 ease-in-out hover:underline hover:opacity-60"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 15 15"
            className="pr-3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
          Learn Dashboard
        </a>
        <div className="flex items-center gap-x-1">
          <img className="h-7 w-7" src="/icons/heart.svg" alt="lives" />
          <p className="text-lg font-medium text-text-secondary">5</p>
        </div>
      </div>

      <div className="relative">
        {/* Background div with image */}
        <div className="flex h-[312px] w-full items-end justify-center overflow-hidden rounded-2xl bg-brand-quaternary">
          <img
            className="max-h-full max-w-full object-cover"
            src="/misc/module-banner.png"
            alt=""
          />
        </div>

        {/* Cards container */}
        <div className="relative z-10 -mt-16 flex flex-col gap-4 px-8">
          {/* Top Card */}
          <LessonIntroCard {...cardInfo} />
          {/* Top Card */}
          {/* ----------------------------------------------------------------------------*/}
          {/* Lesson Cards */}

          {lessonData.map((lesson) => (
            <LessonCard
              key={lesson.slug}
              {...lesson}
              moduleSlug={params?.module_number || ""}
            />
          ))}

          {/* Lesson Cards */}
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  return [
    { slug: "budgeting-strategies" },
    { slug: "managing-debt" },
    { slug: "long-term-budgeting" },
    { slug: "basics-to-budgeting" },
    { slug: "creating-a-budget" },
  ];
}
