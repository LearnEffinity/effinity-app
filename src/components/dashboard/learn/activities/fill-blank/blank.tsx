"use client";

import { useDroppable } from "@dnd-kit/core";
import { BlankOption, SentenceFragment } from "./FillBlankActivity";

export default function Blank({
  fragment,
  answer,
}: {
  fragment: SentenceFragment;
  answer: BlankOption | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: fragment.id });

  return (
    <span
      ref={setNodeRef}
      className={`flex h-[60px] w-[300px] cursor-move items-center justify-center rounded-xl px-6 py-2 leading-normal ${isOver || answer ? "bg-surface-base" : "bg-neutral-50"}`}
      style={{
        backgroundImage: answer
          ? ""
          : `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23636369FF' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
      }}
    >
      <span className="text-brand-accent">
        {answer ? answer.text : fragment.text}
      </span>
    </span>
  );
}
