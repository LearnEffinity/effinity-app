import React from "react";

interface PageProps {
  params?: { topic: string; module_number: string; lesson_number: string };
}

export default function LessonPage({ params }: PageProps) {
  console.log("Params:", params);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Lesson Page</h1>
      <p>You are viewing the lesson with:</p>
      <p>Topic slug: {params.topic}</p>
      <p>Module slug: {params.module_number}</p>
      <p>Lesson slug: {params.lesson_number}</p>
    </div>
  );
}
