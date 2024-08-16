import React from "react";
import SortingCard from "./SortingCard";
import { useDroppable } from "@dnd-kit/core";

interface DropContainerProps {
  id: string;
  items: any[];
  title?: string;
}

export default function DropContainer({
  id,
  items,
  title,
}: DropContainerProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <>
      <div
        ref={setNodeRef}
        className={`h-[485px] w-[370px] rounded-md border-2 p-4 ${isOver ? "border-blue-500 bg-blue-100" : "border-surface-primary bg-surface-primary"}`}
      >
        <h2 className="mb-2 text-center text-xl font-bold">{title}</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <SortingCard
              key={item.id}
              id={item.id}
              icon={item.icon}
              item={item.item}
            />
          ))}
        </div>
      </div>
    </>
  );
}
