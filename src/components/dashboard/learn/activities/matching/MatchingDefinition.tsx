import React, { useState, useCallback } from "react";
import { useDroppable } from "@dnd-kit/core";
import MatchingCard from "./MatchingCard";

interface MatchingDefinitionProps {
  id: string;
  definition: string;
  isMatched: boolean;
  matchedTerm?: string;
  matchedTermId?: string | null;
  icon: string;
}

export default function MatchingDefinition({
  id,
  definition,
  isMatched,
  matchedTerm,
  matchedTermId,
  icon,
}: MatchingDefinitionProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (isMatched) {
      setIsHovering(true);
    }
  }, [isMatched]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  return (
    <div
      ref={setNodeRef}
      className={`relative flex h-[100px] w-[498px] items-center justify-center rounded-md p-4 transition-colors duration-200 ${
        isMatched
          ? "border-2 border-brand-accent bg-surface-primary"
          : isOver
            ? "border-2 border-dashed border-blue-500 bg-blue-50"
            : "border-2 border-dashed border-brand-accent bg-surface-primary"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-200 ${
          isMatched && !isHovering ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="text-md text-center">{definition}</p>
      </div>
      {isMatched && matchedTerm && matchedTermId && (
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${
            isHovering ? "opacity-0" : "opacity-100"
          }`}
        >
          <MatchingCard
            icon={icon}
            id={matchedTermId}
            term={matchedTerm}
            isInDefinition={true}
          />
        </div>
      )}
    </div>
  );
}
