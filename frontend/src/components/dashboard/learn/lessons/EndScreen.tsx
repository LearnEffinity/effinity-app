import React, { useEffect } from "react";
import { useLessonContext } from "./LessonContext";
import { useRouter } from "next/navigation";

export default function EndScreen({ text }: { text?: string }) {
  const { setBottomBarState } = useLessonContext();
  const router = useRouter();

  useEffect(() => {
    setBottomBarState("finish");
  }, [setBottomBarState]);

  //   const handleFinish = () => {
  //     router.push("/learn");
  //   };

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-y-10 text-brand-primary ">
      <h1 className="text-5xl font-semibold">Congratulations!!</h1>
      <p className="text-xl font-medium">
        {text ? text : "You have completed the lesson."}
      </p>
      {/* <button
        onClick={handleFinish}
        className="hover:bg-brand-primary-dark mt-6 rounded-md bg-brand-primary px-6 py-2 text-white transition-colors"
      >
        Finish
      </button> */}
    </div>
  );
}
