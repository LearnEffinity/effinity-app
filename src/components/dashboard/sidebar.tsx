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
      <div
        className={`mt-5 flex-col ${isCollapsed ? "" : ""} items-center justify-center`}
      >
        <Image
          src={isCollapsed ? "/logo.svg" : "/effinity-logo.png"}
          alt="Effinity Logo"
          width={isCollapsed ? 40 : 156}
          height={40}
        />
        <div
          className={`${isCollapsed ? "ml-1" : "ml-7"} mt-6 flex justify-start `}
        >
          <button className="flex items-center " onClick={toggleCollapse}>
            {isCollapsed ? (
              <icons.Collapsed className="h-7 w-7 transform transition-all duration-300 ease-in-out hover:scale-110" />
            ) : (
              <>
                <icons.Collapse className="mr-[10px]  h-7 w-7" />
                <span className="transform font-medium transition-all duration-300 ease-in-out hover:scale-110 hover:text-zinc-700">
                  Collapse
                </span>
              </>
            )}
          </button>
        </div>
      </div>
      <nav className="flex flex-grow flex-col justify-between py-4">
        <div className="mt-20">
          {mainItems.map((item) => (
            <SidebarItem
              key={item.name}
              icon={item.icon}
              name={item.name}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
        <div className="">
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
