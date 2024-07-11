import React from "react";

interface PageProps {
  params?: { module: string; lesson: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function LessonPage({ params, searchParams }: PageProps) {
  console.log("Params:", params);
  console.log("SearchParams:", searchParams);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Lesson Page</h1>
      <p>You are viewing the lesson with:</p>
      <p>Module slug: {params.module}</p>
      <p>Lesson slug: {params.lesson}</p>
    </div>
  );
}

export function generateStaticParams() {
  return [
    { slug: "basics-to-budgeting", lessonSlug: "introduction-to-budgeting" },
    { slug: "basics-to-budgeting", lessonSlug: "tracking-expenses" },
    { slug: "basics-to-budgeting", lessonSlug: "setting-financial-goals" },
  ];
}
