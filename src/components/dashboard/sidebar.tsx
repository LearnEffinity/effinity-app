import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import SidebarItem from "./sidebarItem";
import icons from "./icons";

interface SidebarItemData {
  icon: keyof typeof icons;
  name: string;
  route: string;
}

const mainItems: SidebarItemData[] = [
  { icon: "Home", name: "Home", route: "/" },
  { icon: "Learn", name: "Learn", route: "/learn" },
  { icon: "Play", name: "Play", route: "/play" },
  { icon: "Quests", name: "Quests", route: "/quests" },
  { icon: "Store", name: "Store", route: "/store" },
];

const bottomItems: SidebarItemData[] = [
  { icon: "Settings", name: "Settings", route: "/settings" },
  { icon: "Logout", name: "Logout", route: "/signout" },
];

interface SidebarProps {
  currentRoute: string;
  onWidthChange: (width: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onWidthChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    onWidthChange(isCollapsed ? 100 : 245);
  }, [isCollapsed, onWidthChange]);

  return (
    <motion.div
      className="sidebar fixed left-0 top-0 flex h-screen flex-col bg-white px-8 shadow-lg"
      initial={{ width: 245 }}
      animate={{ width: isCollapsed ? 100 : 245 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
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
              isSelected={currentRoute === item.route}
              route={item.route}
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
              isSelected={currentRoute === item.route}
              route={item.route}
            />
          ))}
        </div>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
