import React, { useState } from "react";
import { motion } from "framer-motion";
import icons from "./icons";

interface SidebarItemProps {
  icon: keyof typeof icons;
  name: string;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  name,
  isCollapsed,
  onClick,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const Icon = icons[icon];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsSelected(!isSelected);
    }
  };

  return (
    <motion.div
      className={`my-4 flex cursor-pointer rounded-xl px-8 py-3 transition-colors duration-200 ease-in-out
        ${isSelected ? "bg-brand-accent text-white" : "hover:bg-gray-100"}
        ${isCollapsed ? "justify-start" : "justify-start"}`}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-start">
        <Icon
          strokeColor={isSelected ? "#fff" : "#080808"}
          className={`h-6 w-6 ${isSelected ? "text-white" : "text-gray-600"}`}
        />
        {!isCollapsed && (
          <span
            className={`ml-4 font-medium ${isSelected ? "text-white" : "text-gray-800"}`}
          >
            {name}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default SidebarItem;
