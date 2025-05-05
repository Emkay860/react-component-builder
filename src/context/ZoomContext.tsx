/* eslint-disable react-refresh/only-export-components */
// src/context/ZoomContext.tsx
import React, { createContext, ReactNode, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export type ZoomContextType = {
  currentScale: number;
  setCurrentScale: (newVal: number) => void;
};

const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

export const ZoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize the current scale using your custom hook so that it reads from localStorage.
  const [currentScale, setCurrentScale] = useLocalStorage<number>(
    "currentScale",
    1
  );

  return (
    <ZoomContext.Provider value={{ currentScale, setCurrentScale }}>
      {children}
    </ZoomContext.Provider>
  );
};

export const useZoom = (): ZoomContextType => {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error("useZoom must be used within a ZoomProvider");
  }
  return context;
};

// A dedicated hook for just retrieving the current zoom scale.
export const useCurrentScale = (): number => {
  const { currentScale } = useZoom();
  return currentScale;
};
