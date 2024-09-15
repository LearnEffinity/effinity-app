"use client";

import { closestCorners, DndContext } from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import { useLessonContext } from "../../lessons/LessonContext";
import Blank from "./blank";
import FillBlankOption from "./FillBlankOption";

export interface SentenceFragment {
  id: string;
  text: string;
  blank?: boolean;
  blankId?: string;
}

export interface BlankOption {
  id: string;
  text: string;
  display: boolean;
}

export default function FillBlankActivity() {
  const {
    setBottomBarState,
    sentence,
    setSentence,
    correctBlanks,
    setCorrectBlanks,
    userBlanks,
    setUserBlanks,
    setExplanation,
    setMode,
  } = useLessonContext();

  const [options, setOptions] = useState<BlankOption[]>([]);
  const [sentenceFragments, setSentenceFragments] = useState<
    SentenceFragment[]
  >([]);

  // Fetch sentence and correct options from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/fillinblanks");
        const data = await response.json();

        setSentence(data.sentence);
        setCorrectBlanks(data.correctOptions);
        setExplanation(data.explanation);

        // Initialize user blanks with null values
        setUserBlanks(Array(data.correctOptions.length).fill(null));

        // Set initial options
        const initialOptions = data.correctOptions
          .concat(data.incorrectOptions)
          .map((text, index) => ({
            id: `option-${index}`,
            text: text,
            display: true,
          }));
        initialOptions.sort(() => Math.random() - 0.5);
        setOptions(initialOptions);

        let bid = 0;
        const newSentence = data.sentence.replaceAll("}", "} ");
        setSentenceFragments(
          newSentence.split(" ").map((fragment) => {
            const isBlank = fragment.includes("{");

            const newVal = {
              id: Math.round(Math.random() * 10000).toString(),
              text: fragment.replace("{", "").replace("}", ""),
              blank: isBlank,
              blankId: isBlank ? bid : undefined,
            };
            if (isBlank) bid++;

            return newVal;
          }),
        );
      } catch (error) {
        console.error("Error fetching fill-in-the-blank data:", error);
      }
    };

    fetchData();
    setMode("fib");
  }, [setSentence, setCorrectBlanks, setUserBlanks, setExplanation]);

  useEffect(() => {
    // Enable the check button when all blanks have been filled
    if (userBlanks.every((blank) => blank !== null)) {
      setBottomBarState("checkEnabled");
    } else {
      setBottomBarState("checkDisabled");
    }
  }, [userBlanks, setBottomBarState]);

  function handleDragEnd(event: any) {
    const { over, active } = event;
    if (!over) return;

    const fragment = sentenceFragments.find(
      (fragment) => fragment.id === over.id,
    );
    const option = options.find((option) => option.id === active.id);

    if (fragment && option) {
      const newOptions = options.map((o) => {
        if (o === option) {
          return { ...o, display: false };
        }

        if (userBlanks[fragment.blankId]) {
          return { ...o, display: true };
        }

        return o;
      });
      setOptions(newOptions);

      const newBlanks = userBlanks.map((blank) => {
        if (blank === option) {
          return null;
        }
        return blank;
      });

      newBlanks[fragment.blankId] = option;
      setUserBlanks(newBlanks);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="flex w-full justify-center px-8 pb-10">
        <div className="flex w-full max-w-[1500px] flex-col items-start">
          <div className="pb-8 pt-10">
            <h3 className="text-xl font-medium text-text-secondary">
              Fill in the Blank
            </h3>
            <h1 className="text-4xl font-medium text-text-primary">
              What is {"effective budgeting"}?
            </h1>
            <h2>Drag and place each word into the correct blank box.</h2>
          </div>
          <div className="mt-20 w-full">
            <p className="flex w-full flex-wrap items-center gap-3 text-3xl font-medium leading-[80px]">
              {sentenceFragments.map((fragment, i) => {
                return fragment.blank ? (
                  <Blank
                    key={fragment.id}
                    fragment={fragment}
                    answer={userBlanks[fragment.blankId]}
                  />
                ) : (
                  <span key={fragment.id}>{fragment.text}</span>
                );
              })}
            </p>
          </div>
          <div className="mt-20 flex w-full flex-wrap items-center justify-center gap-8">
            {options.map((option, i) => {
              if (!option.display) return null;
              return <FillBlankOption option={option} key={i} />;
            })}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
