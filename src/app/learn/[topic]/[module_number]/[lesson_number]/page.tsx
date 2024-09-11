"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuizActivity from "@/components/dashboard/learn/activities/quiz/QuizActivity";
import SortingActivity from "@/components/dashboard/learn/activities/sorting/SortingActivity";
import FillBlankActivity from "@/components/dashboard/learn/activities/fill-blank/FillBlankActivity";
import MatchingActivity from "@/components/dashboard/learn/activities/matching/MatchingActivity";
import IntroContent from "@/components/dashboard/learn/lessons/IntroContent";
import { LessonProvider } from "@/components/dashboard/learn/lessons/LessonContext";
import BottomBar from "@/components/dashboard/learn/lessons/BottomBar";

type ScreenType =
  | "intro"
  | "activity1"
  | "activity2"
  | "activity3"
  | "quiz"
  | "conclusion";

const baseScreens: ScreenType[] = [
  "intro",
  "activity1",
  "activity2",
  "activity3",
  "quiz",
  "conclusion",
];

function shuffleActivities(screens: ScreenType[]): ScreenType[] {
  const activities = screens.filter((screen) => screen.startsWith("activity"));
  const otherScreens = screens.filter(
    (screen) => !screen.startsWith("activity"),
  );

  for (let i = activities.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [activities[i], activities[j]] = [activities[j], activities[i]];
  }

  const shuffledScreens: ScreenType[] = [];
  let activityIndex = 0;

  for (const screen of baseScreens) {
    if (screen.startsWith("activity")) {
      shuffledScreens.push(activities[activityIndex]);
      activityIndex++;
    } else {
      shuffledScreens.push(screen);
    }
  }

  return shuffledScreens;
}

interface PageProps {
  params?: { topic: string; module_number: string; lesson_number: string };
}

export default function LessonPage({ params }: PageProps) {
  const [screens, setScreens] = useState<ScreenType[]>(baseScreens);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    // setScreens(shuffleActivities([...baseScreens]));
    setScreens([...baseScreens]);
  }, []);

  useEffect(() => {
    const newWidth = (currentScreenIndex / (screens.length - 1)) * 100;
    setProgressWidth(newWidth);
  }, [currentScreenIndex, screens.length]);

  const handleContinue = () => {
    if (currentScreenIndex < screens.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    }
  };

  console.log("Params:", params);
  console.log("Current screens order:", screens);

  const renderScreen = () => {
    switch (screens[currentScreenIndex]) {
      case "intro":
        return (
          <IntroContent
            lessonTitle="Introduction to Budgeting"
            content="Budgeting is the process of managing your money to ensure you have enough to cover your expenses and save for the future. It's a skill that can help you achieve your financial goals and live a more secure life."
          />
        );
      case "activity1":
        return <SortingActivity />;
      case "activity2":
        return <MatchingActivity />;
      case "activity3":
        return <FillBlankActivity />;
      case "quiz":
        return <QuizActivity />;
      case "conclusion":
        return (
          <div className="text-center text-5xl font-black text-brand-secondary">
            Congratulations
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <LessonProvider>
        <div className="flex min-h-screen flex-col">
          <main className="flex flex-grow flex-col">
            <div className="flex flex-row items-center justify-between px-8 py-7 shadow-xl">
              <CloseIcon />
              <div className="h-2 w-1/2 rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-brand-accent transition-all duration-500 ease-in-out"
                  style={{
                    width: `${progressWidth}%`,
                  }}
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
                <p className="ml-1 text-xl font-normal text-text-secondary">
                  6
                </p>
              </div>
            </div>
            <div className="flex-grow">{renderScreen()}</div>
            <BottomBar onContinue={handleContinue} />
          </main>
        </div>
      </LessonProvider>
    </>
  );
}

const CloseIcon = ({ className }: { className?: string }) => {
  const router = useRouter();

  return (
    <>
      <button onClick={() => router.back()}>
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
            fillRule="evenodd"
            clipRule="evenodd"
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
