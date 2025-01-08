import { LessonProvider } from "@/components/dashboard/learn/lessons/LessonContext";
import LessonPageContent from "./content";

export default function LessonPage() {
  return (
    <LessonProvider>
      <LessonPageContent />
    </LessonProvider>
  );
}
