import React from "react";
import MatchingDefinition from "./MatchingDefinition";
import { MatchingItem } from "./MatchingActivity";

interface DropContainerProps {
  definitions: {
    id: string;
    definition: string;
    slot: MatchingItem | null;
  }[];
}

export default function MatchedTerms({ definitions }: DropContainerProps) {
  return (
    <>
      <div
        className={`flex h-fit w-fit translate-y-4 flex-col gap-4 rounded-md bg-surface-base px-10 py-6`}
      >
        {definitions.map((definition) => (
          <MatchingDefinition
            key={definition.id}
            id={definition.id}
            definition={definition.definition}
            slot={definition.slot}
          />
        ))}
      </div>
    </>
  );
}
