import React, { useState } from "react";

const LessonActivityLayout = ({ introContent, activities, quiz }) => {
  const [currentStep, setCurrentStep] = useState("intro");
  const [completedActivities, setCompletedActivities] = useState([]);

  const renderContent = () => {
    switch (currentStep) {
      case "intro":
        return (
          <>
            {introContent}
            <button onClick={() => setCurrentStep("activities")}>
              Start Activities
            </button>
          </>
        );
      case "activities":
        if (completedActivities.length < activities.length) {
          const CurrentActivity = activities[completedActivities.length];
          return (
            <CurrentActivity
              onComplete={() => {
                setCompletedActivities([
                  ...completedActivities,
                  CurrentActivity,
                ]);
                if (completedActivities.length + 1 === activities.length) {
                  setCurrentStep("quiz");
                }
              }}
            />
          );
        }
        break;
      case "quiz":
        return quiz;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Lesson Activity</h1>
      {renderContent()}
    </div>
  );
};

export default LessonActivityLayout;
