import {
  FinancialGoal,
  ProficiencyLevel,
  Topic,
} from "@/components/onboarding/Option";

const stage1 = (
  <FinancialGoal
    title="Achieve Financial Freedom"
    description="Achieve a life of financial independence and retire early"
    image="/screen-1/Trophy.png"
  />
);

const stage2 = (
  <ProficiencyLevel
    title="Beginner"
    description="I'm new to financial concepts and want to learn the basics."
    image="/screen-2/Wonder-Image.png"
  />
);

const stage3 = <Topic title="Budgeting" image="/screen-3/Budget.png" />;

export default function Onboarding() {
  return (
    <div className="flex flex-col gap-16 py-16">
      <ul className="grid grid-cols-2 gap-6">
        {stage1}
        {stage1}
        {stage1}
        {stage1}
        {stage1}
        {stage1}
      </ul>
      <hr />
      <ul className="grid grid-cols-3 gap-6">
        {stage2}
        {stage2}
        {stage2}
      </ul>
      <hr />
      <ul className="grid grid-cols-4 gap-6">
        {stage3}
        {stage3}
        {stage3}
        {stage3}
        {stage3}
        {stage3}
        {stage3}
        {stage3}
      </ul>
      <hr />
      <ul className="grid grid-cols-3 gap-6">
        <Topic
          title="Budgeting"
          image="/screen-3/Budget.png"
          className="row-span-2 !text-4xl"
          disabled
        />
        {stage3}
        {stage3}
        {stage3}
        {stage3}
      </ul>
    </div>
  );
}
