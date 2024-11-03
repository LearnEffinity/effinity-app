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
  const [questions, setQuestions] = useState<QuizQuestion[]>([question]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // numWrong would just be the total number of questions - numCorrect
  const [numCorrect, setNumCorrect] = useState(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch("/api/quiz");
        const data = await response.json();

        if (response.ok) {
          console.log("API Response:", data);

          const questions: QuizQuestion[] = data.questions as QuizQuestion[];
          setQuestions(questions);
        } else {
          console.error("Error fetching quiz data:", data.message);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };

    fetchQuizData();
    console.log("run");
  }, []);

  useEffect(() => {
    if (bottomBarState === "correctAnswer") {
      setNumCorrect(numCorrect + 1);
    }
  }, [bottomBarState]);

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
          <h2>{questions[currentQuestionIndex].question}</h2>
        </div>
        <div className="mt-12 grid w-full grid-cols-2 grid-rows-2 gap-4">
          {questions[currentQuestionIndex].options.map((option, i) => {
            const userIsCorrect =
              selected === questions[currentQuestionIndex].correctAnswer;
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
              const isCorrect =
                selected === questions[currentQuestionIndex].correctAnswer;
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
