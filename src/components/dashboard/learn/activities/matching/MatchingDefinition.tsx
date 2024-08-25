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
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`group/card relative flex h-[96px] w-[502px] items-center justify-center rounded-md border-2 border-brand-accent bg-surface-primary transition-colors duration-200 ${slot ? "border-solid" : "border-dashed"}`}
    >
      <div className={`absolute inset-0 flex items-center justify-center p-4`}>
        <p className="text-md">{definition}</p>
      </div>
      <div className={`absolute z-50 transition-opacity duration-200`}>
        {slot && (
          <MatchingCard id={slot.id} icon={slot.icon} term={slot.term} />
        )}
      </div>
    </div>
  );
}
