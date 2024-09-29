"use client";

import React, { useEffect, useState } from "react";
import { useLessonContext } from "../../lessons/LessonContext";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const question: QuizQuestion = {
  id: "1",
  question:
    "Which of the following items is considered a ‘Need’ rather than a ‘Want’?",
  options: [
    "Designer Shoes",
    "A new smartphone",
    "Prescription medication",
    "Concert tickets",
  ],
  correctAnswer: 2,
};

export default function QuizActivity() {
  const { bottomBarState, setBottomBarState } = useLessonContext();

  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (selected !== null) setBottomBarState("checkEnabled");
  }, [selected, setBottomBarState]);

  return (
    <div className="flex w-full justify-center px-8 pb-10">
      <div className="flex w-full max-w-[1500px] flex-col items-start">
        <div className="pb-8 pt-10">
          <h3 className="text-xl font-medium text-text-secondary">Quiz</h3>
          <h1 className="text-4xl font-medium text-text-primary">
            {"Needs vs. Wants"}
          </h1>
          <h2>{question.question}</h2>
        </div>
        <div className="mt-12 grid w-full grid-cols-2 grid-rows-2 gap-4">
          {question.options.map((option, i) => {
            const userIsCorrect = selected === question.correctAnswer;
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
        <div className="mt-12 flex w-full justify-center mb-20">
          <CountdownCircleTimer
            isPlaying={
              !(
                bottomBarState === "continue" ||
                bottomBarState === "correctAnswer" ||
                bottomBarState === "wrongAnswer"
              )
            }
            duration={30}
            colors="#583AFE"
            size={96}
            rotation="counterclockwise"
            trailColor="#EFEEF6"
            trailStrokeWidth={8}
            onComplete={() => {
              setBottomBarState(
                selected && selected === question.correctAnswer
                  ? "correctAnswer"
                  : "wrongAnswer",
              );
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
