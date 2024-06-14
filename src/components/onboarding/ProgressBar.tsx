import { motion } from "framer-motion";

export default function ProgressBar({
    stage,
    totalStage,

  }: {
    stage: number;
    totalStage: number;

  }) {
    const progress = (stage / totalStage) * 100;
    return (
      <div className="h-2 w-full rounded bg-surface-base">
        <motion.div
          className="h-2 rounded bg-brand-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );
  }