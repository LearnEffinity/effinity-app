export enum OnboardingStage {
    Username = "0",
    FinancialGoals = "1",
    ProficiencyLevel = "2",
    Topics = "3",
    Hobby = "4",
    SubHobby = "5",
    Completed = "-1"
  }
  
  export type SubHobby = {
    title: string;
    image: string;
  } | null;
  
  export type OnboardingData = {
    username: string;
    stage1: number[];
    stage2: number | null;
    stage3: number[];
    stage4: number | null;
    subHobby: {
      hob: SubHobby;
      ind: number | null;
    };
  };
  
  export type UserData = {
    username: string;
    onboardingStage: OnboardingStage;
    onboardingData: OnboardingData;
  };