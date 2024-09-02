import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { MatchingItem } from "./MatchingActivity";
import MatchingCard from "./MatchingCard";

interface DropContainerProps {
  id: string;
  items: MatchingItem[];
}

export default function UnmatchedTerms({ id, items }: DropContainerProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <>
      <div
        ref={setNodeRef}
        className={`h-[428px] w-[534px] rounded-md border-2 p-4 ${isOver ? "border-blue-500 bg-blue-100" : "border-surface-primary bg-surface-primary"}`}
      >
        <div className="space-y-2">
          {items.map((item) => (
            <MatchingCard
              key={item.id}
              id={item.id}
              icon={item.icon}
              term={item.term}
            />
          ))}
        </div>
      </div>
    </>
  );
}
