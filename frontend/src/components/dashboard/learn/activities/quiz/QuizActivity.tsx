"use client";

import React, { useEffect, useState } from "react";
import { useLessonContext } from "../../lessons/LessonContext";
import {
  CountdownCircleTimer,
  useCountdown,
} from "react-countdown-circle-timer";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function QuizActivity({
  questionIndex,
  selected,
  setSelected,
  questions,
  setQuestions,
}: {
  questionIndex: number;
  selected: number | null;
  setSelected: (selected: number | null) => void;
  questions: QuizQuestion[];
  setQuestions: (questions: QuizQuestion[]) => void;
}) {
  const params = useParams();
  const { bottomBarState, setBottomBarState, setExplanation } =
    useLessonContext();

  const [moduleData, setModuleData] = useState<any>({
    name: "",
  });
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);

  // numWrong would just be the total number of questions - numCorrect
  const [numCorrect, setNumCorrect] = useState(0);

  // Determine if timer should be playing
  const shouldTimerPlay = !(
    bottomBarState === "continue" ||
    bottomBarState === "correctAnswer" ||
    bottomBarState === "wrongAnswer"
  );

  useEffect(() => {
    console.log("params", params);
    const fetchQuizData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/quiz/${params.topic}/${params.module_number}`,
        );
        console.log("response", response);
        const data = (await response.json()) as {
          questions: {
            question: string;
            options: string[];
            correctAnswer: number;
            explanation: string;
          }[];
        };

        if (response.ok) {
          setQuestions(
            data.questions.map((question, i) => ({
              id: i.toString(),
              question: question.question,
              options: question.options,
              correctAnswer: question.correctAnswer,
              explanation: question.explanation,
            })),
          );
          console.log("questions", data.questions);
          setIsLoading(false);
        } else {
          console.error("Error fetching sorting data:", (data as any).message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchModuleData = async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("name")
        .eq("module_number", params.module_number)
        .single();
      if (error) {
        console.error("Error fetching module data:", error);
        setModuleData({ name: "ERROR" });
        return;
      }

      setModuleData(data);
    };

    if (params.topic && params.module_number) {
      fetchQuizData();
      fetchModuleData();
    }
  }, [params.topic, params.module_number]);

  useEffect(() => {
    if (bottomBarState === "correctAnswer") {
      setNumCorrect(numCorrect + 1);
    }
  }, [bottomBarState]);

  useEffect(() => {
    if (selected !== null) setBottomBarState("checkEnabled");
  }, [selected, setBottomBarState]);

  useEffect(() => {
    if (questions.length > 0) {
      setExplanation(questions[questionIndex].explanation);
    }
  }, [questions, questionIndex]);

  if (isLoading)
    return (
      <div className="flex w-full justify-center px-8 pb-10">
        <div className="flex w-full max-w-[1500px] flex-col items-start">
          <div className="pb-8 pt-10">
            <h3 className="text-xl font-medium text-text-secondary">Quiz</h3>
            <h1 className="text-4xl font-medium text-text-primary">
              Loading...
            </h1>
            <h2 className="my-2 h-[20px] w-[250px] animate-pulse rounded-lg bg-gray-200"></h2>
          </div>
          <div className="mt-12 grid w-full grid-cols-2 grid-rows-2 gap-4">
            <div className="flex h-[150px] w-full animate-pulse items-center rounded-lg border-2 bg-gray-200 p-4" />
            <div className="flex h-[150px] w-full animate-pulse items-center rounded-lg border-2 bg-gray-200 p-4" />
            <div className="flex h-[150px] w-full animate-pulse items-center rounded-lg border-2 bg-gray-200 p-4" />
            <div className="flex h-[150px] w-full animate-pulse items-center rounded-lg border-2 bg-gray-200 p-4" />
          </div>
        </div>
      </div>
    );
  return (
    <div className="flex w-full justify-center px-8 pb-10">
      <div className="flex w-full max-w-[1500px] flex-col items-start">
        <div className="pb-8 pt-10">
          <h3 className="text-xl font-medium text-text-secondary">Quiz</h3>
          <h1 className="text-4xl font-medium text-text-primary">
            {moduleData.name}
          </h1>
          <h2>{questions[questionIndex].question}</h2>
        </div>
        <div className="mt-12 grid w-full grid-cols-2 grid-rows-2 gap-4">
          {questions[questionIndex].options.map((option, i) => {
            const userIsCorrect =
              selected === questions[questionIndex].correctAnswer;
            const isSelected = selected === i;

            return (
              <div
                className={
                  "flex h-[150px] w-full cursor-pointer items-center rounded-lg border-2 bg-surface-base p-4 transition-all " +
                  (isSelected ? "border-brand-accent" : "border-surface-base")
                }
                key={i}
                onClick={() => {
                  if (
                    bottomBarState === "checkDisabled" ||
                    bottomBarState === "checkEnabled"
                  )
                    setSelected(i);
                }}
              >
                <span
                  className={"text-xl " + (isSelected && "text-brand-accent")}
                >
                  <b>{String.fromCharCode(65 + i)}.</b> {option}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mb-20 mt-12 flex w-full justify-center">
          <CountdownCircleTimer
            key={questionIndex}
            isPlaying={shouldTimerPlay}
            duration={30}
            colors="#583AFE"
            size={96}
            rotation="counterclockwise"
            trailColor="#EFEEF6"
            trailStrokeWidth={8}
            onComplete={() => {
              const isCorrect =
                selected === questions[questionIndex].correctAnswer;
              setBottomBarState(isCorrect ? "correctAnswer" : "wrongAnswer");
            }}
          >
            {({ remainingTime }) => (
              <span className="text-3xl font-bold">{remainingTime}</span>
            )}
          </CountdownCircleTimer>
        </div>
      </div>
    </div>
  );
}
