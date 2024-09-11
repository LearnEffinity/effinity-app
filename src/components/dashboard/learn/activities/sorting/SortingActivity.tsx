"use client";
import React, { useState, useEffect } from "react";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import DropContainer from "./DropContainer";
import SortingCard from "./SortingCard";
import { useLessonContext } from "../../lessons/LessonContext";

interface SortingCardData {
  id: string;
  icon: string;
  item: string;
}

const initialItems: SortingCardData[] = [
  {
    id: "1",
    icon: "/activity/wrench.png",
    item: "Utilities",
  },
  {
    id: "2",
    icon: "/activity/wrench.png",
    item: "Dining Out",
  },
  {
    id: "3",
    icon: "/activity/wrench.png",
    item: "Groceries",
  },
  {
    id: "4",
    icon: "/activity/wrench.png",
    item: "Gas",
  },
  {
    id: "5",
    icon: "/activity/wrench.png",
    item: "Subscriptions",
  },
];

export default function SortingActivity() {
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

  const [items, setItems] = useState<SortingCardData[]>(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSortingData = async () => {
      try {
        const response = await fetch("/api/sorting");
        const data = await response.json();

        if (response.ok) {
          console.log("API Response:", data);

          const allItems = [...data.Needs, ...data.Wants].map(
            (item: string, index: number) => ({
              id: `item-${index}`,
              icon: "/activity/wrench.png",
              item,
            }),
          );

          setItems(allItems);
          setCorrectNeeds(data.Needs.sort());
          setCorrectWants(data.Wants.sort());
          setExplanation(data.Explanation);

          console.log("Needs:", data.Needs);
          console.log("Wants:", data.Wants);
          console.log("Explanation:", data.Explanation);
        } else {
          console.error("Error fetching sorting data:", data.message);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };

    fetchSortingData();
  }, [setCorrectNeeds, setCorrectWants, setExplanation]);

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

    console.log("User Needs:", userNeeds);
    console.log("User Wants:", userWants);
  }

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="flex flex-col items-start px-36 pb-10">
          <div className=" pb-8 pt-10">
            <h3 className="text-xl font-medium">Sorting</h3>
            <h1 className="text-4xl font-medium text-text-primary">
              Distinguished between {"Needs"} and {"Wants"}
            </h1>
            <h2>Sort each option into the correct category.</h2>
            {/* {explanation && (
              <p className="text-sm text-gray-600 mt-4">{explanation}</p>
            )} */}
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
