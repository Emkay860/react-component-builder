import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ZoomProvider } from "./context/ZoomContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ZoomProvider>
      <App />
    </ZoomProvider>
  </StrictMode>
);
