/* eslint-disable react-refresh/only-export-components */
// src/context/ZoomContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

export type ZoomContextType = {
  currentScale: number;
  setCurrentScale: (newVal: number) => void;
};

const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

export const ZoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Remove zoom: always use 1
  const [currentScale, setCurrentScale] = useState<number>(1);

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
  return 1;
};
