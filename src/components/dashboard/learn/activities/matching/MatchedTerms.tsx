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
      <div className={`h-[428px] w-[534px] rounded-md border-2 p-4`}>
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
