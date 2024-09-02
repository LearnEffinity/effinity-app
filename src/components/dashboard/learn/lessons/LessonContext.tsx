import React, { createContext, useContext, useState, ReactNode } from "react";
//+ these are the possible states f
export type BottomBarState =
  | "continue"
  | "checkDisabled"
  | "checkEnabled"
  | "correctAnswer"
  | "wrongAnswer";

interface SortingCardData {
  id: string;
  icon: string;
  item: string;
}

export interface BlankOption {
  id: string;
  text: string;
}

// defining shape of our context
interface LessonContextType {
  // Bottom Bar states
  bottomBarState: BottomBarState;
  setBottomBarState: (state: BottomBarState) => void;

  // Sorting Activity States
  userNeeds: SortingCardData[];
  setUserNeeds: React.Dispatch<React.SetStateAction<SortingCardData[]>>;
  userWants: SortingCardData[];
  setUserWants: React.Dispatch<React.SetStateAction<SortingCardData[]>>;
  correctNeeds: string[];
  setCorrectNeeds: React.Dispatch<React.SetStateAction<string[]>>;
  correctWants: string[];
  setCorrectWants: React.Dispatch<React.SetStateAction<string[]>>;

  // explanation: string;
  // setExplanation: (explanation: string) => void;

  // Fill in the blank states
  userBlanks: (BlankOption | null)[];
  setUserBlanks: React.Dispatch<React.SetStateAction<(BlankOption | null)[]>>;
  correctBlanks: BlankOption[];
  setCorrectBlanks: React.Dispatch<React.SetStateAction<BlankOption[]>>;
  sentence: string;
  setSentence: (sentence: string) => void;

  // universal explanation
  // Matching Activity states
  userTerms_Defs: { [key: string]: string };
  setUserTerms_Defs: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;

  explanation: string;
  setExplanation: (explanation: string) => void;
  mode: string;
  setMode: (mode: string) => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bottomBarState, setBottomBarState] =
    useState<BottomBarState>("continue");
  const [userNeeds, setUserNeeds] = useState<SortingCardData[]>([]);
  const [userWants, setUserWants] = useState<SortingCardData[]>([]);
  const [correctNeeds, setCorrectNeeds] = useState<string[]>([]);
  const [correctWants, setCorrectWants] = useState<string[]>([]);
  const [userTerms_Defs, setUserTerms_Defs] = useState<{
    [key: string]: string;
  }>({});
  const [explanation, setExplanation] = useState<string>("");
  const [mode, setMode] = useState<string>("sorting");

  // Fill in the blank states
  const [userBlanks, setUserBlanks] = useState<(BlankOption | null)[]>([]);
  const [correctBlanks, setCorrectBlanks] = useState<BlankOption[]>([]);
  const [sentence, setSentence] = useState<string>("");

  const value = {
    bottomBarState,
    setBottomBarState,
    userNeeds,
    setUserNeeds,
    userWants,
    setUserWants,
    correctNeeds,
    setCorrectNeeds,
    correctWants,
    setCorrectWants,
    explanation,
    setExplanation,
    //* Add more state and functions as needed
    mode,
    setMode,
    // Fill in the blank states
    userBlanks,
    setUserBlanks,
    correctBlanks,
    setCorrectBlanks,
    sentence,
    setSentence,
    //     Matching states
    userTerms_Defs,
    setUserTerms_Defs,
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
