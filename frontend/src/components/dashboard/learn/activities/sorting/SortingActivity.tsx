"use client";
import React, { useState, useEffect } from "react";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import DropContainer from "./DropContainer";
import SortingCard from "./SortingCard";
import { useLessonContext } from "../../lessons/LessonContext";
import { useParams } from "next/navigation";

interface SortingCardData {
  id: string;
  icon: string;
  item: string;
}

export default function SortingActivity() {
  const params = useParams();
  const {
    setUserNeeds,
    setUserWants,
    setCorrectNeeds,
    setCorrectWants,
    setExplanation,
    setBottomBarState,
    userNeeds,
    userWants,
  } = useLessonContext();

  const [items, setItems] = useState<SortingCardData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSortingData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/sorting/${params.topic}/${params.module_number}/${params.lesson_number}`,
        );
        const data = await response.json();

        if (response.ok) {
          // Transform the items array into SortingCardData format
          const allItems = data.items.map(
            (item: { text: string; category: string }, index: number) => ({
              id: `item-${index}`,
              icon: "/activity/wrench.png",
              item: item.text,
            }),
          );

          // Separate needs and wants for the correct answers
          const needs = data.items
            .filter((item: { category: string }) => item.category === "needs")
            .map((item: { text: string }) => item.text)
            .sort();

          const wants = data.items
            .filter((item: { category: string }) => item.category === "wants")
            .map((item: { text: string }) => item.text)
            .sort();

          setItems(allItems);
          setCorrectNeeds(needs);
          setCorrectWants(wants);
          setExplanation(data.explanation);
          setIsLoading(false);
        } else {
          console.error("Error fetching sorting data:", data.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.topic && params.module_number && params.lesson_number) {
      fetchSortingData();
    }
  }, [params.topic, params.module_number, params.lesson_number]);

  useEffect(() => {
    if (items.length === 0) {
      setBottomBarState("checkEnabled");
    } else {
      setBottomBarState("checkDisabled");
    }
  }, [items, setBottomBarState]);

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { over, active } = event;

    if (over) {
      const activeItem = findItemById(active.id);
      if (activeItem) {
        if (over.id === "needs") {
          moveItem(activeItem, "needs");
        } else if (over.id === "wants") {
          moveItem(activeItem, "wants");
        } else if (over.id === "items") {
          moveItem(activeItem, "items");
        }
      }
    }

    setActiveId(null);
  }

  function findItemById(id: string): SortingCardData | undefined {
    return (
      items.find((item) => item.id === id) ||
      userNeeds.find((item) => item.id === id) ||
      userWants.find((item) => item.id === id)
    );
  }

  function moveItem(
    item: SortingCardData,
    destination: "items" | "needs" | "wants",
  ) {
    setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    setUserNeeds((prevNeeds) => prevNeeds.filter((i) => i.id !== item.id));
    setUserWants((prevWants) => prevWants.filter((i) => i.id !== item.id));

    switch (destination) {
      case "items":
        setItems((prev) => [...prev, item]);
        break;
      case "needs":
        setUserNeeds((prev) => [...prev, item]);
        break;
      case "wants":
        setUserWants((prev) => [...prev, item]);
        break;
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-start px-36 pb-10">
        <div className="pb-8 pt-10">
          <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="mb-2 h-12 w-96 animate-pulse rounded bg-gray-200"></div>
          <div className="h-6 w-72 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="flex flex-row items-start">
          <div className="h-96 w-64 animate-pulse rounded bg-gray-200"></div>
          <div className="ml-6 flex h-full gap-x-4 rounded-2xl bg-surface-base p-5">
            <div className="h-96 w-48 animate-pulse rounded bg-gray-200"></div>
            <div className="h-96 w-48 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="flex flex-col items-start px-36 pb-10">
          <div className="pb-8 pt-10">
            <h3 className="text-xl font-medium">Sorting</h3>
            <h1 className="text-4xl font-medium text-text-primary">
              Distinguish between Needs and Wants
            </h1>
            <h2>Sort each option into the correct category.</h2>
          </div>
          <div className="flex flex-row items-start">
            <DropContainer id="items" items={items} />
            <div className="ml-6 flex h-full gap-x-4 rounded-2xl bg-surface-base p-5">
              <DropContainer id="needs" items={userNeeds} title="Needs" />
              <DropContainer id="wants" items={userWants} title="Wants" />
            </div>
          </div>
        </div>
        <DragOverlay>
          {activeId ? (
            <SortingCard
              id={activeId}
              icon={findItemById(activeId)?.icon || ""}
              item={findItemById(activeId)?.item || ""}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
