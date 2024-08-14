import React from "react";
import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface MatchingCardProps {
  id: string;
  term: string;
  icon: string;
  isInDefinition?: boolean;
}

export default function MatchingCard({
  id,
  term,
  icon,
  isInDefinition = false,
}: MatchingCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-move rounded-md bg-surface-base px-5 py-[18px] text-text-primary ${
        isInDefinition ? "h-full w-full" : "w-[498px]"
      }`}
    >
      <div className="flex h-full items-center justify-start">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-surface-primary">
          <Image alt="icon" width={40} height={40} src={icon} />
        </div>
        <h1 className="pl-4 text-xl font-medium">{term}</h1>
      </div>
    </div>
  );
}