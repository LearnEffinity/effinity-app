import React from "react";

interface IntroContentProps {
  lessonTitle: string;
  content: string;
}

export default function IntroContent({
  lessonTitle,
  content,
}: IntroContentProps) {
  return (
    <>
      <div className="py-56 pl-36 pr-96">
        <h1 className="text-3xl font-medium">{lessonTitle}</h1>
        {content}
      </div>
    </>
  );
}
