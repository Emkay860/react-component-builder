// src/components/Tabs.tsx
import React, { useState, ReactNode } from "react";
import { TabsContext } from "../context/TabsContext";
import { useTabs } from "../hooks/useTabs";

interface TabsProps {
  defaultTab: string;
  children: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="flex flex-col h-full">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  children: ReactNode;
}
export const TabList: React.FC<TabListProps> = ({ children }) => (
  <div className="flex border-b">{children}</div>
);

interface TabProps {
  tab: string;
  children: ReactNode;
}
export const Tab: React.FC<TabProps> = ({ tab, children }) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === tab;
  return (
    <button
      className={`flex-1 py-2 text-sm font-semibold border-b-2 focus:outline-none ${
        isActive
          ? "border-blue-500 text-blue-700 bg-blue-50"
          : "border-transparent text-gray-500 hover:bg-gray-100"
      }`}
      onClick={() => setActiveTab(tab)}
      type="button"
    >
      {children}
    </button>
  );
};

interface TabPanelProps {
  tab: string;
  children: ReactNode;
}
export const TabPanel: React.FC<TabPanelProps> = ({ tab, children }) => {
  const { activeTab } = useTabs();
  if (activeTab !== tab) return null;
  return <div className="flex-1 overflow-y-auto">{children}</div>;
};
