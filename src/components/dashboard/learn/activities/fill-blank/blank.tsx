"use client";

import { SentenceFragment } from "./FillBlankActivity";

export default function Blank(fragment: SentenceFragment) {
  return (
    <span
      className="flex h-fit w-[300px] items-center justify-center rounded-xl bg-neutral-50 px-6 py-2 leading-normal"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23636369FF' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
      }}
    >
      {fragment.text}
    </span>
  );
}
