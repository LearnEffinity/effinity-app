import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DropContainerProps {
  id: string;
  items: any[];
  title: string;
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
        className={`w-1/2 rounded-md border-2 p-4 ${isOver ? "border-blue-500 bg-blue-100" : "border-gray-100 bg-gray-100"}`}
      >
        <h2 className="mb-2 text-xl font-bold">{title}</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded bg-white p-2 shadow">
              {item.item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
