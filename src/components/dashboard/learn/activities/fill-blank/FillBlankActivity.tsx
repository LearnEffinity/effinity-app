"use client";

import { closestCorners, DndContext } from "@dnd-kit/core";
import React from "react";
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
  id?: string;
  text: string;
}

const sentence =
  "Effective budgeting involves prioritizing {3} to achieve financial goals while managing {1} to mantain financial health.";
const blankOptions = [
  { id: "1", text: "savings" },
  { id: "2", text: "investments" },
  { id: "3", text: "expenses" },
  { id: "4", text: "income" },
];

export default function FillBlankActivity() {
  const { setBottomBarState } = useLessonContext();
  const sentenceFragments = sentence.split(" ").map((fragment, index) => {
    return {
      id: index.toString(),
      text: fragment,
      blank: fragment.includes("{"),
      blankId: fragment.includes("{")
        ? fragment.replace("{", "").replace("}", "")
        : undefined,
    };
  });

  function handleDragStart(event: any) {}

  function handleDragEnd(event: any) {}

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div className="flex flex-col items-start px-36 pb-10">
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
                <Blank key={i} {...fragment} />
              ) : (
                <span>{fragment.text}</span>
              );
            })}
          </p>
        </div>
        <div className="mt-20 flex w-full items-center justify-center gap-8">
          {blankOptions.map((option, i) => {
            return <FillBlankOption option={option} key={i} />;
          })}
        </div>
      </div>
    </DndContext>
  );
}
