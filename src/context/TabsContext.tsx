// src/context/TabsContext.tsx
import React, { createContext, useContext } from "react";

export interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const useTabsContext = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("useTabsContext must be used within <TabsContext.Provider>");
  return ctx;
};
