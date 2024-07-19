"use client";
import React, { useState } from "react";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import DropContainer from "./DropContainer";
import SortingCard from "./SortingCard";

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
  const [needs, setNeeds] = useState<SortingCardData[]>([]);
  const [wants, setWants] = useState<SortingCardData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { over, active } = event;

    if (over) {
      const item = initialItems.find((item) => item.id === active.id);
      if (item) {
        if (over.id === "needs") {
          setNeeds([...needs, item]);
        } else if (over.id === "wants") {
          setWants([...wants, item]);
        }
      }
    }

    setActiveId(null);
  }

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="flex flex-col items-start px-36 pb-14">
          <div className=" pb-8 pt-10">
            <h3 className="text-xl font-medium">Sorting</h3>
            <h1 className="text-4xl font-medium text-text-primary">
              Distinguished between {"Needs"} and {"Wants"}
            </h1>
            <h2>Sort each option into the correct category.</h2>
          </div>
          <div className="flex gap-4">
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
          <SortableContext items={initialItems} strategy={rectSortingStrategy}>
            <div className="mt-4 flex flex-wrap gap-4">
              {initialItems.map((item) => (
                <SortingCard
                  key={item.id}
                  id={item.id}
                  icon={item.icon}
                  item={item.item}
                />
              ))}
            </div>
          </SortableContext>
          {/* That actual activity stuff */}
        </div>
        <DragOverlay>
          {activeId ? (
            <SortingCard
              id={activeId}
              icon={
                initialItems.find((item) => item.id === activeId)?.icon || ""
              }
              item={
                initialItems.find((item) => item.id === activeId)?.item || ""
              }
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
