"use client";

import React from "react";
import { useLessonContext } from "../../lessons/LessonContext";

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
            const correct = i === question.correctAnswer;

            return (
              <div
                className="flex h-[200px] w-full cursor-pointer items-center rounded-lg bg-surface-base p-8"
                key={i}
              >
                <span className="text-2xl">
                  <b>{String.fromCharCode(65 + i)}.</b> {option}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
