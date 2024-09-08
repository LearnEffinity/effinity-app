"use client";

import { useUsername } from "@/context/UsernameContext";
import { Continue, GoBack } from "@/components/onboarding/Buttons";
import {
  FinancialGoal,
  ProficiencyLevel,
  Topic,
} from "@/components/onboarding/Option";
import Input from "@/components/form/Input";
import ProgressBar from "@/components/onboarding/ProgressBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSession, saveOnboardingData, saveUsername } from "./actions";
import { OnboardingStage, OnboardingData, UserData, SubHobby } from "./types";

const stage1 = [
  {
    title: "Achieve Financial Freedom",
    description: "Achieve a life of financial independence and retire early",
    image: "/screen-1/Trophy.png",
  },
  {
    title: "Enhance Career Opportunities",
    description: "Advance my career by developing valuable financial skills",
    image: "/screen-1/Board.png",
  },
  {
    title: "Master Money Management",
    description: "Achieve a life of financial independence and retire early",
    image: "/screen-1/Coin.png",
  },
  {
    title: "Plan for the future",
    description: "Achieve a life of financial independence and retire early",
    image: "/screen-1/Pig.png",
  },
  {
    title: "Build wealth",
    description: "Achieve a life of financial independence and retire early",
    image: "/screen-1/Abacus.png",
  },
  {
    title: "Pay off debt",
    description: "Achieve a life of financial independence and retire early",
    image: "/screen-1/Money.png",
  },
];

const stage2 = [
  {
    title: "Beginner",
    description: "I'm new to financial concepts and want to learn the basics.",
    image: "/screen-2/Wonder-Image.png",
  },
  {
    title: "Intermediate",
    description: "I have some knowledge but want to deepen my understanding.",
    image: "/screen-2/Smile-Image.png",
  },
  {
    title: "Advanced",
    description: "I'm already familiar and want to explore advanced topics.",
    image: "/screen-2/Cool-Image.png",
  },
];

const stage3 = [
  { title: "Budgeting", image: "/screen-3/Budget.png" },
  { title: "Saving Accounts", image: "/screen-3/Savings.png" },
  { title: "Investing", image: "/screen-3/Investing.png" },
  { title: "Debt Management", image: "/screen-3/Debt.png" },
  { title: "Credit Card", image: "/screen-3/Credit-Card.png" },
  { title: "Real Estate", image: "/screen-3/Real-Estate.png" },
  { title: "Cryptocurrency", image: "/screen-3/BTC.png" },
  { title: "Insurance", image: "/screen-3/Insurance.png" },
];

const stage4 = [
  { title: "Sports", image: "/screen-4/Sports.png" },
  { title: "Gaming", image: "/screen-4/Gaming.png" },
  { title: "Fitness", image: "/screen-4/Fitness.png" },
  { title: "Art", image: "/screen-4/Art.png" },
  { title: "Foodie", image: "/screen-4/Foodie.png" },
  { title: "Technology", image: "/screen-4/Technology.png" },
  { title: "Fashion", image: "/screen-4/Fashion.png" },
  { title: "Media", image: "/screen-4/Media.png" },
];

const subHobbies = {
  Sports: [
    { title: "Football", image: "/sports/Football.png" },
    { title: "Basketball", image: "/sports/Basketball.png" },
    { title: "Boxing", image: "/sports/Boxing.png" },
    { title: "Soccer", image: "/sports/Soccer.png" },
  ],
  Gaming: [
    { title: "Minecraft", image: "/gaming/Minecraft.png" },
    { title: "Valorant", image: "/gaming/Valorant.png" },
    { title: "Call of Duty", image: "/gaming/COD.png" },
    { title: "Fortnite", image: "/gaming/Fortnite.png" },
  ],
  Fitness: [
    { title: "Weightlifting", image: "/fitness/Weightlifting.png" },
    { title: "Running", image: "/fitness/Running.png" },
    { title: "Yoga", image: "/fitness/Yoga.png" },
    { title: "Hiking", image: "/fitness/Hiking.png" },
  ],
  Art: [
    { title: "Music", image: "/arts/Music.png" },
    { title: "Painting", image: "/arts/Painting.png" },
    { title: "Pottery", image: "/arts/Pottery.png" },
    { title: "History", image: "/arts/History.png" },
  ],
  Foodie: [
    { title: "Cooking", image: "/foodie/Cooking.png" },
    { title: "Baking", image: "/foodie/Baking.png" },
    { title: "Fine Dining", image: "/foodie/Fine-Dining.png" },
    { title: "Fast Food", image: "/foodie/Fast-Food.png" },
  ],
  Technology: [
    { title: "Programming", image: "/technology/Programming.png" },
    { title: "Computers", image: "/technology/Computers.png" },
    { title: "Artificial Intelligence", image: "/technology/AI.png" },
    { title: "Robotics", image: "/technology/Robotics.png" },
  ],
  Fashion: [
    { title: "Thrifting", image: "/fashion/Thrifting.png" },
    { title: "Luxury", image: "/fashion/High-heeled shoe.png" },
    { title: "Streetwear", image: "/fashion/Streetwear.png" },
    { title: "Sustainable", image: "/fashion/Sustainable.png" },
  ],
  Media: [
    { title: "Social Media", image: "/media/Social-Media.png" },
    { title: "Videography", image: "/media/Videography.png" },
    { title: "Photography", image: "/media/Camera.png" },
    { title: "Animation", image: "/media/Animation.png" },
  ],
};

export default function Onboarding() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stage, setStage] = useState<OnboardingStage>(OnboardingStage.Username);
    const [username, setUsername] = useState("");
  const [selectedStage1, setSelectedStage1] = useState<number[]>([]);
  const [selectedStage2, setSelectedStage2] = useState<number | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const [selectedStage4, setSelectedStage4] = useState<number | null>(null);
  const [hobby, selectSubHobby] = useState<{
    hob: SubHobby;
    ind: number | null;
  }>({
    hob: null,
    ind: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    username: "",
    stage1: [],
    stage2: null,
    stage3: [],
    stage4: null,
    subHobby: { hob: null, ind: null },
  });
  useEffect(() => {
    const initSession = async () => {
      setIsLoading(true);
      const { user, userData } = await fetchSession();
      setUser(user);
      console.log("User data:", userData, user);

      if (userData) {
        setUserData(userData);
        if (userData.onboardingStage === OnboardingStage.Completed) {
          console.log("Redirecting to home...");
          router.push("/");
          return;
        }

        setOnboardingData(userData.onboardingData || onboardingData);
        setUsername(userData.onboardingData?.username || "");
        setStage(userData.onboardingStage || OnboardingStage.Username);
      } else {
        setStage(OnboardingStage.Username);
      }
      setIsLoading(false);
    };

    initSession();
  }, [router]);
  const handleTopicSelection = (index: number) => {
    if (selectedTopics.includes(index)) {
      setSelectedTopics(selectedTopics.filter((item) => item !== index));
    } else if (selectedTopics.length < 3) {
      setSelectedTopics([...selectedTopics, index]);
    }
  };

  const handleStage1Selection = (index: number) => {
    if (selectedStage1.includes(index)) {
      setSelectedStage1(selectedStage1.filter((item) => item !== index));
    } else {
      setSelectedStage1([...selectedStage1, index]);
    }
  };

  const handleUsernameSubmit = async () => {
    if (!username.trim()) return;
    try {
      await saveUsername(username);
      setStage(OnboardingStage.FinancialGoals);
      setOnboardingData({ ...onboardingData, username });
      await saveOnboardingData(OnboardingStage.FinancialGoals, {
        ...onboardingData,
        username,
      });
    } catch (error) {
      console.error("Error saving username:", error);
    }
  };
  const handleContinue = async () => {
    const currentStageIndex = Object.values(OnboardingStage).indexOf(stage);
    const nextStage = Object.values(OnboardingStage)[
      currentStageIndex + 1
    ] as OnboardingStage;

    if (nextStage === OnboardingStage.Completed) {
      console.log("Onboarding completed, saving data and redirecting...");
      await saveOnboardingData(OnboardingStage.Completed, onboardingData);
      router.push("/");
    } else {
      console.log("Saving data for stage:", nextStage);
      await saveOnboardingData(nextStage, onboardingData);
      setStage(nextStage);
    }
  };

  const handleGoBack = async () => {
    const currentStageIndex = Object.values(OnboardingStage).indexOf(stage);
    const previousStage = Object.values(OnboardingStage)[
      currentStageIndex - 1
    ] as OnboardingStage;
    await saveOnboardingData(previousStage, onboardingData);
    setStage(previousStage);
  };

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <ProgressBar stage={Number(stage)} totalStage={6} />
      <div className="flex flex-col py-10">
        {stage === OnboardingStage.Username && (
          <>
            <p className="pb-7 text-lg md:text-2xl">
              Choose a username:
              <span className="text-text-secondary">
                {" "}
                This will be your display name in the app.
              </span>
            </p>
            <div className="">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e)}
                className="mb-6 w-full max-w-md"
              />
              <div className="mt-10 flex justify-end">
                <Continue
                  onClick={handleUsernameSubmit}
                  disabled={!username.trim()}
                />
              </div>
            </div>
          </>
        )}
        {stage === OnboardingStage.FinancialGoals && (
          <>
            <p className="pb-7 text-lg md:text-2xl">
              Why do you want to learn about finance?
            </p>
            <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {stage1.map((goal, index) => (
                <FinancialGoal
                  key={index}
                  title={goal.title}
                  description={goal.description}
                  image={goal.image}
                  onClick={() => handleStage1Selection(index)}
                  selected={selectedStage1.includes(index)}
                  disabled={
                    selectedStage1.length >= 3 &&
                    !selectedStage1.includes(index)
                  }
                />
              ))}
            </ul>
            <div className="mt-10 flex justify-end">
              <Continue
                onClick={handleContinue}
                disabled={selectedStage1.length === 0}
              />
            </div>
          </>
        )}
        {stage === OnboardingStage.ProficiencyLevel && (
          <>
            <p className="pb-7 text-lg md:text-2xl">
              How much do you know about finance?
            </p>
            <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {stage2.map((level, index) => (
                <ProficiencyLevel
                  key={index}
                  title={level.title}
                  description={level.description}
                  image={level.image}
                  onClick={() => setSelectedStage2(index)}
                  selected={selectedStage2 === index}
                />
              ))}
            </ul>
            <div className="mt-28 flex justify-between">
              <GoBack onClick={handleGoBack} />
              <Continue
                onClick={handleContinue}
                disabled={selectedStage2 === null}
              />
            </div>
          </>
        )}
        {stage === OnboardingStage.Topics && (
          <>
            <p className="pb-7 text-lg md:text-2xl">
              What topics are you interested in learning?
            </p>
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stage3.map((topic, index) => (
                <Topic
                  key={index}
                  title={topic.title}
                  image={topic.image}
                  onClick={() => handleTopicSelection(index)}
                  selected={selectedTopics?.includes(index)}
                  disabled={
                    selectedTopics.length >= 3 &&
                    !selectedTopics.includes(index)
                  }
                  font="md:text-2xl text-lg"
                />
              ))}
            </ul>
            <div className="mt-28 flex justify-between">
              <GoBack onClick={handleGoBack} />
              <Continue
                onClick={handleContinue}
                disabled={selectedTopics.length === 0}
              />
            </div>
          </>
        )}
        {stage === OnboardingStage.Hobby && (
          <>
            <p className="pb-7 text-lg md:text-2xl">
              What is your favorite hobby?{" "}
              <span className=" text-text-secondary">
                We&apos;ll use this to help you learn more effectively.
              </span>
            </p>
            <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {stage4.map((topic, index) => (
                <Topic
                  key={index}
                  title={topic.title}
                  image={topic.image}
                  onClick={() => setSelectedStage4(index)}
                  selected={selectedStage4 === index}
                  font="md:text-2xl text-lg"
                />
              ))}
            </ul>
            <div className="mt-28 flex justify-between">
              <GoBack onClick={handleGoBack} />
              <Continue
                onClick={handleContinue}
                disabled={selectedStage4 === null}
              />
            </div>
          </>
        )}
        {stage === OnboardingStage.SubHobby &&
          selectedStage4 !== null &&
          subHobbies[stage4[selectedStage4].title] && (
            <>
              <p className="pb-7 text-lg md:text-2xl">
                What is your favorite hobby?{" "}
                <span className=" text-text-secondary">
                  We&apos;ll use this to help you learn more effectively.
                </span>
              </p>
              <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                <Topic
                  title={stage4[selectedStage4].title}
                  image={stage4[selectedStage4].image}
                  className="col-span-2 lg:row-span-2"
                  font="text-4xl font-[500]"
                />
                {subHobbies[stage4[selectedStage4].title].map(
                  (subHobby, subIndex) => (
                    <Topic
                      key={subIndex}
                      title={subHobby.title}
                      image={subHobby.image}
                      font="text-2xl"
                      onClick={() =>
                        selectSubHobby({ hob: subHobby, ind: subIndex })
                      }
                      selected={hobby.hob === subHobby}
                    />
                  ),
                )}
              </ul>
              <div className="mt-28 flex justify-between">
                <GoBack onClick={handleGoBack} />
                <Continue
                  onClick={() => {
                    handleContinue();
                  }}
                  disabled={!hobby.hob}
                />
              </div>
            </>
          )}
      </div>
    </>
  );
}
