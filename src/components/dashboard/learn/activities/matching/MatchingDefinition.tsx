import React from "react";
import Image from "next/image";
import { MatchingItem } from "./MatchingActivity";
import { useDroppable } from "@dnd-kit/core";

interface MatchingCardProps {
  id: string;
  definition: string;
  slot: MatchingItem | null;
}

export default function MatchingDefinition({
  id,
  definition,
  slot,
}: MatchingCardProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`relative flex h-[100px] w-[498px] items-center justify-center rounded-md p-4 transition-colors duration-200 ${isOver ? "border-blue-500 bg-blue-100" : "border-surface-primary bg-surface-primary"}`}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-200`}
      >
        <p className="text-md text-center">{slot ? slot.term : definition}</p>
      </div>
    </div>
  );
}
