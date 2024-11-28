import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MockMateTool } from "mockmate";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <MockMateTool />
  </>
);
