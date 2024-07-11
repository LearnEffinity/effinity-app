import React from "react";

export default function LessonPage({
  params,
}: {
  params: { slug: string; lessonSlug: string };
}) {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Lesson Page</h1>
      <p>You are viewing the lesson with:</p>
      <p>Module slug: {params.slug}</p>
      <p>Lesson slug: {params.lessonSlug}</p>
    </div>
  );
}

export function generateStaticParams() {
  return [
    { slug: "budgeting-strategies", lessonSlug: "lesson-1" },
    { slug: "budgeting-strategies", lessonSlug: "lesson-2" },
    { slug: "managing-debt", lessonSlug: "lesson-1" },
    { slug: "managing-debt", lessonSlug: "lesson-2" },
    { slug: "long-term-budgeting", lessonSlug: "lesson-1" },
    { slug: "long-term-budgeting", lessonSlug: "lesson-2" },
  ];
}
