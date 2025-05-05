// src/react-easy-panzoom.d.ts
declare module "react-easy-panzoom" {
    import * as React from "react";
  
    export interface PanZoomProps {
      autoCenter?: boolean;
      disableKeyInteraction?: boolean;
      minZoom?: number;
      maxZoom?: number;
      wheelZoom?: boolean;
      pinchZoom?: boolean;
      doubleClickZoom?: boolean;
      enableBoundingBox?: boolean;
      disablePan?: boolean;
      disableZoom?: boolean;
      style?: React.CSSProperties;
      children?: React.ReactNode;
      // onStateChange callback to receive the current state.
      onStateChange?: (state: {
        scale: number;
        translateX: number;
        translateY: number;
      }) => void;
    }
  
    // Define the imperative methods exposed by PanZoom.
    export interface PanZoomHandle {
      zoomIn: () => void;
      zoomOut: () => void;
      reset: () => void;
    }
  
    // Export PanZoom as a forward-ref component supporting the imperative handle.
    const PanZoom: React.ForwardRefExoticComponent<
      PanZoomProps & React.RefAttributes<PanZoomHandle>
    >;
    export default PanZoom;
  }
  