import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import RegModuleCard from "./moduleCard";

interface Module {
  module_id: number;
  module_number: number;
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  slug: string
  length: string;
  image: string;
  topic: string;
}

interface Progress {
  user_id: string;
  module_id: number;
  progress_percentage: number;
}

const supabase = createClient();

const Recommended: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [userProgress, setUserProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: modulesData, error: modulesError } = await supabase
          .from("modules")
          .select("*")
          .eq("topic", "budgeting")
          .order("module_number");
        console.log(modulesData);

        if (modulesError) throw modulesError;

        if (modulesData) {
          setModules(modulesData);
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from("progress")
            .select("*")
            .eq("user_id", user.id)
            .order("module_id", { ascending: false })
            .limit(1);

          if (progressError) throw progressError;

          if (progressData && progressData.length > 0) {
            setUserProgress(progressData[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const modulesToShow = userProgress
    ? modules.filter((module) => module.module_number > userProgress.module_id)
    : modules;

  return (
    <div className="mt-10">
      <h1 className="mb-6 text-4xl font-semibold text-text-primary">
        Recommended for You
      </h1>
      <div className="mb-10">
        <h2 className="text-3xl font-medium text-text-primary">Budgeting</h2>
        <h3 className="mb-6 w-1/2 text-lg font-medium text-text-secondary">
          Gain practical insights and essential skills to effectively manage
          your finances, ensuring financial stability and peace of mind in your
          daily life.
        </h3>
        <div className="flex flex-wrap gap-6">
          {modulesToShow.map((module) => (
            <RegModuleCard
              key={module.module_id}
              moduleID={module.module_id}
              title={module.name}
              duration={module.length}
              difficulty={module.difficulty}
              topic={module.topic}
              image={module.image}
              description={module.description}
              module_number={module.module_number}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommended;
