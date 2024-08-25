import React from "react";
import Image from "next/image";
import { MatchingItem } from "./MatchingActivity";
import { useDroppable } from "@dnd-kit/core";
import MatchingCard from "./MatchingCard";

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
      className={`relative flex h-[92px] w-[498px] items-center justify-center rounded-md border-2 bg-surface-primary transition-colors duration-200 ${slot ? "" : "border-dashed border-brand-accent"}`}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-200`}
      >
        <p className="text-md text-center">{definition}</p>
      </div>
      {slot && <MatchingCard id={slot.id} icon={slot.icon} term={slot.term} />}
    </div>
  );
}
