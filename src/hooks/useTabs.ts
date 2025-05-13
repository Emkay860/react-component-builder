// src/hooks/useTabs.ts
import { useContext } from "react";
import { TabsContext } from "../context/TabsContext";

export const useTabs = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("useTabs must be used within <Tabs>");
  return ctx;
};
