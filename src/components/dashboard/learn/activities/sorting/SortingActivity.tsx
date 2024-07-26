"use client";
import React, { useState, useEffect } from "react";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import DropContainer from "./DropContainer";
import SortingCard from "./SortingCard";
import { useLessonContext } from "../../lessons/LessonContext";

// interface SortingActivityProps {}

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
  const [items, setItems] = useState<SortingCardData[]>(initialItems);
  const [needs, setNeeds] = useState<SortingCardData[]>([]);
  const [wants, setWants] = useState<SortingCardData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { setBottomBarState } = useLessonContext();

  useEffect(() => {
    // Enable the check button when all items have been sorted
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
      needs.find((item) => item.id === id) ||
      wants.find((item) => item.id === id)
    );
  }

  function moveItem(
    item: SortingCardData,
    destination: "items" | "needs" | "wants",
  ) {
    setItems(items.filter((i) => i.id !== item.id));
    setNeeds(needs.filter((i) => i.id !== item.id));
    setWants(wants.filter((i) => i.id !== item.id));

    switch (destination) {
      case "items":
        setItems((prev) => [...prev, item]);
        break;
      case "needs":
        setNeeds((prev) => [...prev, item]);
        break;
      case "wants":
        setWants((prev) => [...prev, item]);
        break;
    }
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
          </div>
          <div className="flex flex-row items-start">
            <DropContainer id="items" items={items} />

            <div className="ml-6 flex h-full gap-x-4 rounded-2xl bg-surface-base p-5">
              <DropContainer
                id="needs"
                items={needs}
                title="Needs"
              ></DropContainer>
              <DropContainer
                id="wants"
                items={wants}
                title="Wants"
              ></DropContainer>
            </div>
          </div>
          {/* That actual activity stuff */}
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
