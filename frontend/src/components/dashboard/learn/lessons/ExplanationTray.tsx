import React from "react";
import { motion } from "framer-motion";

interface ExplanationTrayProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: string;
}

export default function ExplanationTray({
  isOpen,
  onClose,
  explanation,
}: ExplanationTrayProps) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 border border-t-green-500 bg-green-100 px-56  py-6 shadow-lg"
      style={{ minHeight: "200px", maxHeight: "80vh", overflow: "auto" }}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <CloseIcon />
        </button>
        <h2 className="mb-4 text-xl font-semibold text-green-600">
          Explanation:
        </h2>
        <p className="w-2/3 text-green-600">{explanation}</p>
      </div>
    </motion.div>
  );
}

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-green-600 hover:text-green-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
