"use client";
import SortingActivity from "@/components/dashboard/learn/activities/sorting/SortingActivity";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import FillBlankActivity from "@/components/dashboard/learn/activities/fill-blank/FillBlankActivity";
// import MatchingActivity from "@/components/dashboard/learn/activities/matching/MatchingActivity";
import BottomBar from "@/components/dashboard/learn/lessons/BottomBar";
import EndScreen from "@/components/dashboard/learn/lessons/EndScreen";
import IntroContent from "@/components/dashboard/learn/lessons/IntroContent";
import {
  LessonProvider,
  useLessonContext,
} from "@/components/dashboard/learn/lessons/LessonContext";

type ScreenType = "intro" | "activity" | "conclusion";

const screens: ScreenType[] = ["intro", "activity", "conclusion"];

interface PageProps {
  params?: { topic: string; module_number: string; lesson_number: string };
}

export default function LessonPageContent({ params }: PageProps) {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [lessonData, setLessonData] = useState<any>(null);

  const {
    bottomBarState,
    setBottomBarState,
    userNeeds,
    userWants,
    correctNeeds,
    correctWants,
    explanation,
    userBlanks,
    correctBlanks,
    mode,
  } = useLessonContext();

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await fetch(
          `/api/lesson/${params.topic}/${params.module_number}/${params.lesson_number}`,
        );
        const data = await response.json();
        setLessonData(data);
      } catch (error) {
        console.error("Error fetching lesson data:", error);
      }
    };

    if (params?.topic && params?.module_number && params?.lesson_number) {
      fetchLessonData();
    }
  }, [params?.topic, params?.module_number, params?.lesson_number]);

  useEffect(() => {
    const newWidth = (currentScreenIndex / (screens.length - 1)) * 100;
    setProgressWidth(newWidth);
  }, [currentScreenIndex]);

  const handleContinue = () => {
    if (currentScreenIndex < screens.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    }
  };

  console.log("Params:", params);

  const renderScreen = () => {
    switch (screens[currentScreenIndex]) {
      case "intro":
        return (
          <IntroContent
            lessonTitle={lessonData?.name || "Loading..."}
            content={lessonData?.description || "Loading lesson content..."}
          />
        );
      case "activity":
        return <SortingActivity />;
      case "conclusion":
        return <EndScreen />;
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
            <BottomBar
              onContinue={handleContinue}
              handleCheck={(awardXp: () => void) => {
                if (mode === "sorting") {
                  console.log("Checking Sorting Activity...");
                  console.log("User Needs: ", userNeeds);
                  console.log("User Wants: ", userWants);
                  console.log("Correct Needs: ", correctNeeds);
                  console.log("Correct Wants: ", correctWants);

                  const flattenedUserNeeds = userNeeds
                    .map((need) => need.item)
                    .sort();
                  const flattenedUserWants = userWants
                    .map((want) => want.item)
                    .sort();

                  const sortedCorrectly =
                    JSON.stringify(flattenedUserNeeds) ===
                      JSON.stringify(correctNeeds) &&
                    JSON.stringify(flattenedUserWants) ===
                      JSON.stringify(correctWants);

                  if (sortedCorrectly) {
                    awardXp();
                    setBottomBarState("correctAnswer");
                  } else {
                    setBottomBarState("wrongAnswer");
                  }
                }

                // Handle Check for FillBlankActivity
                else if (mode === "fib") {
                  console.log("Checking Fill in the Blanks Activity...");
                  console.log("User Blanks: ", userBlanks);
                  console.log("Correct Blanks: ", correctBlanks);

                  const userAnswers = userBlanks.map((blank) => blank?.text);
                  const isCorrect =
                    JSON.stringify(userAnswers) ===
                    JSON.stringify(correctBlanks);

                  if (isCorrect) {
                    setBottomBarState("correctAnswer");
                  } else {
                    setBottomBarState("wrongAnswer");
                  }
                }
              }}
            />
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
