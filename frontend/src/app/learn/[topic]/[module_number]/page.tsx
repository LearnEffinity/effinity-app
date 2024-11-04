"use client";
import React, { useState, useEffect } from "react";
import LessonIntroCard from "@/components/dashboard/learn/module/lessonIntroCard";
import LessonCard from "@/components/dashboard/learn/module/lessonCard";
import Sidebar from "@/components/dashboard/sidebar";
import { usePathname } from "next/navigation";

interface PageProps {
  params: { module_number: string; topic: string };
}

interface LessonIntroProps {
  title: string;
  description: string;
  progress: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
}

interface Lesson {
  id: number;
  module_number: string;
  lesson_id: number;
  name: string;
  description: string;
  lesson_number: number;
  markdown: string;
  image: string;
  topic: string;
}

export default function ModulePage({ params }: PageProps) {
  const [moduleInfo, setModuleInfo] = useState<LessonIntroProps | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const [sidebarWidth, setSidebarWidth] = useState(245);

  const handleSidebarWidthChange = (width: number) => {
    setSidebarWidth(width);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/module/${params.topic}/${params.module_number}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        setModuleInfo({
          title: data.module.name,
          description: data.module.description,
          progress: 0,
          difficulty: data.module.difficulty,
          duration: parseInt(data.module.length),
        });

        setLessons(data.lessons);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.module_number, params.topic]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex min-h-screen">
        <div className="fixed">
          <Sidebar
            currentRoute={pathname}
            onWidthChange={handleSidebarWidthChange}
          />
        </div>
        <main className="flex-1" style={{ marginLeft: `${sidebarWidth}px` }}>
          <div className="px-8 py-10">
            {/* MAIN CONTENT */}
            <div className="mb-8 flex w-full justify-between">
              <a
                href="/learn"
                className="flex items-center text-2xl font-medium text-text-secondary transition-all duration-300 ease-in-out hover:underline hover:opacity-60"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 15 15"
                  className="pr-3"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Learn Dashboard
              </a>
              <div className="flex items-center gap-x-1">
                <img className="h-7 w-7" src="/icons/heart.svg" alt="lives" />
                <p className="text-lg font-medium text-text-secondary">5</p>
              </div>
            </div>

            <div className="relative">
              <div className="flex h-[312px] w-full items-end justify-center overflow-hidden rounded-2xl bg-brand-quaternary">
                <img
                  className="max-h-full max-w-full object-cover"
                  src="/misc/module-banner.png"
                  alt=""
                />
              </div>

              <div className="relative z-10 -mt-16 flex flex-col gap-4 px-8">
                {moduleInfo && <LessonIntroCard {...moduleInfo} />}

                {lessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lessonNumber={lesson.lesson_id}
                    title={lesson.name}
                    description={lesson.description}
                    status="not-started"
                    slug={`${lesson.lesson_number}`}
                    moduleSlug={params.module_number}
                    topic={params.topic}
                  />
                ))}
              </div>
            </div>
            {/* MAIN CONTENT */}
          </div>
        </main>
      </div>
    </>
  );
}
