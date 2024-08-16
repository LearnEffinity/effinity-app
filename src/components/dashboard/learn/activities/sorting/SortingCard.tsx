import React from "react";
import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface SortingCardProps {
  id: string;
  icon: string;
  item: string;
}

export default function SortingCard({ id, icon, item }: SortingCardProps) {
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
      className="w-[328px] rounded-md bg-surface-base px-5 py-[18px] text-text-primary cursor-move"
    >
      <div className="flex items-center justify-start">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-primary">
          <Image alt="icon" width={40} height={40} src={icon} />
        </div>
        <h1 className="pl-4 text-xl font-medium">{item}</h1>
      </div>
    </div>
  );
}
