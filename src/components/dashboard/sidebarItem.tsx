import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import icons from "./icons";

interface SidebarItemProps {
  icon: keyof typeof icons;
  name: string;
  isCollapsed: boolean;
  isSelected: boolean;
  route: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  name,
  isCollapsed,
  isSelected,
  route,
}) => {
  const Icon = icons[icon];

  return (
    <Link href={route} passHref>
      <motion.div
        className={`mx-auto my-4 flex cursor-pointer rounded-xl py-3 transition-colors duration-200 ease-in-out
        ${isSelected ? "bg-brand-accent text-white" : "hover:bg-gray-100"}
        ${isCollapsed ? " justify-start" : "justify-start px-8"}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className={`flex items-start ${isCollapsed ? "mx-auto" : ""}`}>
          <Icon
            strokeColor={isSelected ? "#fff" : "#080808"}
            className={`h-6 w-6 ${isSelected ? "text-white" : "text-gray-600"}`}
          />
          {!isCollapsed && (
            <span
              className={`font-medium ${isSelected ? "text-white" : "text-gray-800"} ${isCollapsed ? "mx-auto" : "ml-4"} `}
            >
              {name}
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default SidebarItem;
