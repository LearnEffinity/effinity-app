import React, { createContext, useContext, useState, ReactNode } from "react";

//+ these are the possible states f
export type BottomBarState =
  | "continue"
  | "checkDisabled"
  | "checkEnabled"
  | "correctAnswer"
  | "wrongAnswer";

// defining shape of our context
interface LessonContextType {
  bottomBarState: BottomBarState;
  setBottomBarState: (state: BottomBarState) => void;
  // Add more state and functions as needed
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bottomBarState, setBottomBarState] =
    useState<BottomBarState>("continue");

  const value = {
    bottomBarState,
    setBottomBarState,
    //* Add more state and functions as needed
  };

  return (
    <LessonContext.Provider value={value}>{children}</LessonContext.Provider>
  );
};

// custom hook to use the context
export const useLessonContext = () => {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error("useLessonContext must be used within a LessonProvider");
  }
  return context;
};

//? Helper function to add new states (for documentation purposes)
function addNewBottomBarState(newState: string) {
  //! 1. Add the new state to the BottomBarState type
  //! 2. Update any switch statements or conditional renders that depend on BottomBarState
  //! 3. Create a new component for the new state if necessary
  console.log("Remember to update BottomBarState and related components");
}
