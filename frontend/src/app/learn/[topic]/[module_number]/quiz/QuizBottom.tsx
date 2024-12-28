import { QuizQuestion } from "@/components/dashboard/learn/activities/quiz/QuizActivity";
import BottomBar from "@/components/dashboard/learn/lessons/BottomBar";
import { useLessonContext } from "@/components/dashboard/learn/lessons/LessonContext";

export default function QuizBottom({
  selected,
  questions,
  questionIndex,
  handleContinue,
}: {
  selected: number | null;
  questions: QuizQuestion[];
  questionIndex: number;
  handleContinue: () => void;
}) {
  const { setBottomBarState } = useLessonContext();

  return (
    <BottomBar
      onContinue={handleContinue}
      handleCheck={(awardXp) => {
        if (selected !== null) {
          console.log("selected", selected);
          console.log("right answer", questions[questionIndex].correctAnswer);
          if (selected === questions[questionIndex].correctAnswer) {
            awardXp();
            setBottomBarState("correctAnswer");
          } else {
            setBottomBarState("wrongAnswer");
          }
        }
      }}
    />
  );
}
