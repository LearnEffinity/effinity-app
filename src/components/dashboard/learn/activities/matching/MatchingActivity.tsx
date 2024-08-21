"use client";
import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import MatchingCard from "./MatchingCard";
import MatchingDefinition from "./MatchingDefinition";
import { useLessonContext } from "../../lessons/LessonContext";

interface MatchingItem {
  id: string;
  term: string;
  icon: string;
  definition: string;
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
  const {
    setUserTerms_Defs,
    setExplanation,
    setBottomBarState,
    setMode,
  } = useLessonContext();

  const [items, setItems] = useState<MatchingItem[]>(initialItems);
  const [matches, setMatches] = useState<{ [key: string]: string | null }>({});
  const [activeId, setActiveId] = useState<string | null>(null);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  console.log("i am here");

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
            })
          );

          setItems(termItems);

          setUserTerms_Defs(termItems.reduce((acc, item) => {
            acc[item.term] = item.definition as string;
            return acc;
          }, {} as { [key: string]: string }));
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
    
    const allMatched = Object.values(matches).every((match) => match !== null);
    setBottomBarState(allMatched ? "checkEnabled" : "checkDisabled");
  }, [matches, setBottomBarState]);

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { over, active } = event;

    if (over) {
      setMatches((prev) => {
        const updatedMatches = { ...prev };
        const draggedTermId = active.id;
        const targetDefinitionId = over.id;

        // Find the current definition of the dragged term
        const sourceDefinitionId = Object.entries(updatedMatches).find(
          ([defId, termId]) => termId === draggedTermId,
        )?.[0];

        // If there's already a term in the target definition, swap them
        if (updatedMatches[targetDefinitionId]) {
          const existingTermId = updatedMatches[targetDefinitionId];

          if (sourceDefinitionId) {
            // If the dragged term was in a definition, perform a swap
            updatedMatches[sourceDefinitionId] = existingTermId;
          } else {
            // If the dragged term was from the unmatched area, find an empty spot for the existing term
            const emptyDefinitionId = Object.entries(updatedMatches).find(
              ([defId, termId]) => termId === null,
            )?.[0];

            if (emptyDefinitionId) {
              updatedMatches[emptyDefinitionId] = existingTermId;
            }
          }
        } else if (sourceDefinitionId) {
          // If moving to an empty definition, clear the source
          updatedMatches[sourceDefinitionId] = null;
        }

        // Place the dragged term in the target definition
        updatedMatches[targetDefinitionId] = draggedTermId;

        return updatedMatches;
      });
    }

    setActiveId(null);
  }

  // Get unmatched terms
  const unmatchedTerms = items.filter(
    (item) => !Object.values(matches).includes(item.id),
  );

  return (
    <DndContext
      sensors={sensors}
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
        <div className="flex flex-row items-start gap-x-11">
          <div className="flex flex-col gap-y-10">
            {unmatchedTerms.map((item) => (
              <MatchingCard
                icon={item.icon}
                key={item.id}
                id={item.id}
                term={item.term}
              />
            ))}
          </div>
          <div className="flex flex-col gap-y-6 rounded-2xl bg-surface-base px-14 py-8">
            {items.map((item) => (
              <MatchingDefinition
                key={item.id}
                id={item.id}
                definition={item.definition}
                isMatched={matches[item.id] !== null}
                matchedTerm={items.find((i) => i.id === matches[item.id])?.term}
                matchedTermId={matches[item.id]}
                icon={items.find((i) => i.id === matches[item.id])?.icon || ""}
              />
            ))}
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeId ? (
          <MatchingCard
            id={activeId}
            icon="/activity/wrench.png"
            term={items.find((item) => item.id === activeId)?.term || ""}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
