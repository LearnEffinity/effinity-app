import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import ContinueModule from "./continueCard";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface Module {
  module_id: number;
  module_number: number;
  name: string;
  description: string;
  difficulty: Difficulty;
  length: string;
  image: string;
  topic: string;
  progress: number;
}

interface Progress {
  user_id: string;
  module_id: number;
  progress_percentage: number;
}

const supabase = createClient();

const Continue: React.FC = () => {
  const [userModules, setUserModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from("progress")
            .select("*")
            .eq("user_id", user.id);

          if (progressError) throw progressError;

          if (progressData && progressData.length > 0) {
            const moduleIds = progressData.map((p) => p.module_id);
            const { data: modulesData, error: modulesError } = await supabase
              .from("modules")
              .select("*")
              .in("module_id", moduleIds);

            if (modulesError) throw modulesError;

            if (modulesData) {
              const userModules = modulesData.map((module) => ({
                ...module,
                progress:
                  progressData.find((p) => p.module_id === module.module_id)
                    ?.progress_percentage || 0,
              }));

              setUserModules(userModules);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (userModules.length === 0) {
    return null;
  }

  return (
    <div className="my-10">
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">
        Continue Learning
      </h1>
      <div className="flex flex-row items-start gap-6">
        {userModules.map((module) => (
          <ContinueModule
            key={module.module_id}
            moduleID={module.module_id}
            title={module.name}
            duration={module.length}
            difficulty={module.difficulty}
            progress={module.progress || 0}
            image={module.image}
            slug={module.topic}
          />
        ))}
      </div>
    </div>
  );
};

export default Continue;
