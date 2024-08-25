"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import MatchingCard from "./MatchingCard";
import { useLessonContext } from "../../lessons/LessonContext";
import UnmatchedTerms from "./UnmatchedTerms";
import MatchedTerms from "./MatchedTerms";

export interface MatchingItem {
  id: string;
  term: string;
  icon: string;
  definition: string;
}

export interface MatchingDefinition {
  id: string;
  definition: string;
  slot: MatchingItem | null;
}

const initialItems: MatchingItem[] = [
  {
    id: "1",
    term: "Term 1",
    icon: "/activity/wrench.png",
    definition: "Definition for Term 1",
  },
  {
    id: "2",
    term: "Term 2",
    icon: "/activity/wrench.png",
    definition: "Definition for Term 2",
  },
  {
    id: "3",
    term: "Term 3",
    icon: "/activity/wrench.png",
    definition: "Definition for Term 3",
  },
  {
    id: "4",
    term: "Term 4",
    icon: "/activity/wrench.png",
    definition: "Definition for Term 4",
  },
];

export default function MatchingActivity() {
  const { setUserTerms_Defs, setExplanation, setBottomBarState, setMode } =
    useLessonContext();

  const [unmatchedTerms, setUnmatchedTerms] =
    useState<MatchingItem[]>(initialItems);

  const [definitions, setDefinitions] = useState<MatchingDefinition[]>(
    initialItems.map((item) => {
      return { id: item.id + "d", definition: item.definition, slot: null };
    }),
  );

  useEffect(() => {
    const fetchMatchingData = async () => {
      try {
        const response = await fetch("/api/matching");
        const data = await response.json();

        if (response.ok) {
          console.log("API Response:", data);

          const termItems = Object.entries(data.terms).map(
            ([term, definition], index) => ({
              id: `item-${index}`,
              term,
              icon: "/activity/wrench.png",
              definition: definition as string,
            }),
          );

          setUnmatchedTerms(termItems);
          setDefinitions(
            termItems.map((item) => {
              return {
                id: item.id + "d",
                definition: item.definition,
                slot: null,
              };
            }),
          );

          setUserTerms_Defs(
            termItems.reduce(
              (acc, item) => {
                acc[item.term] = item.definition as string;
                return acc;
              },
              {} as { [key: string]: string },
            ),
          );
          setExplanation(data.Explanation);
        } else {
          console.error("Error fetching sorting data:", data.message);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };

    fetchMatchingData();
    setMode("sorting");
  }, [setUserTerms_Defs, setExplanation]);

  useEffect(() => {
    const allMatched = unmatchedTerms.length === 0;
    setBottomBarState(allMatched ? "checkEnabled" : "checkDisabled");
  }, [unmatchedTerms, setBottomBarState]);

  function handleDragStart(event: any) {}

  function handleDragEnd(event: any) {
    const { over, active } = event;

    const activeId = active.id as string;
    const targetId = over.id as string;

    const draggedItem =
      unmatchedTerms.find((item) => item.id === activeId) ??
      definitions.find((item) => item.slot?.id === activeId).slot;
    const unmatched = unmatchedTerms.includes(draggedItem);

    if (unmatched && targetId.includes("d")) {
      const targetDef = definitions.find((def) => def.id === targetId);

      const unmatchedDupe = [...unmatchedTerms];
      if (targetDef.slot) {
        unmatchedDupe.push(targetDef.slot);
      }

      setDefinitions(
        definitions.map((def) => {
          if (def.id === targetId) {
            def.slot = draggedItem;
          }
          return def;
        }),
      );
      setUnmatchedTerms(unmatchedDupe.filter((item) => item.id !== activeId));
    } else if (targetId === "terms") {
      setDefinitions(
        definitions.map((def) => {
          if (def.id === targetId) {
            def.slot = draggedItem;
          }
          return def;
        }),
      );
      setUnmatchedTerms((prev) => [...prev, draggedItem]);
    }
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div className="flex flex-col items-start px-36 pb-10">
        <div className="pb-8 pt-10">
          <h3 className="text-xl font-medium">Matching</h3>
          <h1 className="text-4xl font-medium text-text-primary">
            Match the terms to their definitions
          </h1>
          <h2>
            Drag each term to its corresponding definition. You can swap terms
            between definitions.
          </h2>
        </div>
        <div className="flex w-full gap-4">
          <UnmatchedTerms id="terms" items={unmatchedTerms} />
          <MatchedTerms definitions={definitions} />
        </div>
      </div>
    </DndContext>
  );
}
