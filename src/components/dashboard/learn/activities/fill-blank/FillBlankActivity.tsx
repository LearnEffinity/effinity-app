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
}

const sentence =
  "Effective budgeting involves prioritizing {1} to achieve financial goals while managing {2} to mantain financial health.";
const blankOptions = [
  { id: "1", text: "savings" },
  { id: "2", text: "investments" },
  { id: "3", text: "expenses" },
  { id: "4", text: "income" },
];

// I, Landon Harter, formally apologize for the following code. I am sorry.
export default function FillBlankActivity() {
  const { setBottomBarState } = useLessonContext();

  // parse sentence into fragments using the format {id} for blanks
  const sentenceFragments = sentence.split(" ").map((fragment) => {
    const isBlank = fragment.includes("{");

    return {
      id: isBlank
        ? (parseInt(fragment.replace("{", "").replace("}", "")) - 1).toString()
        : Math.round(Math.random() * 10000).toString(),
      text: fragment,
      blank: fragment.includes("{"),
      blankId: fragment.includes("{")
        ? fragment.replace("{", "").replace("}", "")
        : undefined,
    };
  });

  const [options, setOptions] = useState(blankOptions);
  const [blanks, setBlanks] = useState<(BlankOption | null)[]>(
    Array(sentence.split("{").length - 1).fill(null),
  );

  useEffect(() => {
    // Enable the check button when all blanks have been filled
    if (blanks.every((blank) => blank !== null)) {
      setBottomBarState("checkEnabled");
    } else {
      setBottomBarState("checkDisabled");
    }
  }, [blanks, setBottomBarState]);

  function handleDragEnd(event: any) {
    const { over, active } = event;
    if (!over) return;

    const activeOption = options.find((option) => option.id === active.id);
    const overBlank = sentenceFragments.find(
      (fragment) => fragment.id === over.id,
    );

    if (activeOption && overBlank) {
      // remove the option from the list of options
      const newOptions = options.filter((option) => option.id !== active.id);

      // if blank already has an option, add it back to the options list
      const currentBlank = blanks[parseInt(overBlank.id as string)];
      if (currentBlank) {
        newOptions.push(currentBlank);
      }
      setOptions(newOptions);

      // set the option to the blank
      const newBlanks = [...blanks];
      newBlanks[parseInt(overBlank.blankId as string) - 1] = activeOption;
      setBlanks(newBlanks);
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
              {sentenceFragments.map((fragment) => {
                return fragment.blank ? (
                  <Blank
                    key={fragment.id}
                    fragment={fragment}
                    answer={blanks[fragment.id]}
                  />
                ) : (
                  <span>{fragment.text}</span>
                );
              })}
            </p>
          </div>
          <div className="mt-20 flex w-full flex-wrap items-center justify-center gap-8">
            {options.map((option, i) => {
              return <FillBlankOption option={option} key={i} />;
            })}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
