import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import SidebarItem from "./sidebarItem";
import icons from "./icons";

interface SidebarItemData {
  icon: keyof typeof icons;
  name: string;
}

const mainItems: SidebarItemData[] = [
  { icon: "Home", name: "Home" },
  { icon: "Learn", name: "Learn" },
  { icon: "Play", name: "Play" },
  { icon: "Quests", name: "Quests" },
  { icon: "Store", name: "Store" },
];

const bottomItems: SidebarItemData[] = [
  { icon: "Settings", name: "Settings" },
  { icon: "Logout", name: "Logout" },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.div
      className="flex h-screen flex-col bg-white px-8 shadow-lg"
      initial={{ width: 245 }}
      animate={{ width: isCollapsed ? 100 : 245 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="flex-col items-center justify-center p-4">
        <Image
          src={isCollapsed ? "/logo.svg" : "/effinity-logo.png"}
          alt="Effinity Logo"
          width={isCollapsed ? 40 : 156}
          height={40}
        />
        {/* <button
          className="flex items-center text-gray-500 hover:text-gray-700"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <icons.Collapsed className="h-6 w-6" />
          ) : (
            <>
              <icons.Collapse className="mr-2 h-6 w-6" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button> */}
        <SidebarItem
          icon={isCollapsed ? "Collapsed" : "Collapse"}
          name="Collapse"
          isCollapsed={isCollapsed}
          onClick={toggleCollapse}
        />
      </div>
      <nav className="flex flex-grow flex-col justify-between py-4">
        <div className="">
          {mainItems.map((item) => (
            <SidebarItem
              key={item.name}
              icon={item.icon}
              name={item.name}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
        <div className="mx-auto">
          {bottomItems.map((item) => (
            <SidebarItem
              key={item.name}
              icon={item.icon}
              name={item.name}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
