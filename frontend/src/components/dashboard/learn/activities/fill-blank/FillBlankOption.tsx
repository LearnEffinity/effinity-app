"use client";

import { CSS } from "@dnd-kit/utilities";
import { BlankOption } from "./FillBlankActivity";
import { useDraggable } from "@dnd-kit/core";

export default function FillBlankOption({ option }: { option: BlankOption }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: option.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <span
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move rounded-xl bg-surface-base px-8 py-2 text-4xl font-medium text-brand-accent"
    >
      {option.text}
    </span>
  );
}
