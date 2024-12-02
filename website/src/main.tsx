import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { MockMateTools } from "mockmate";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <MockMateTools />
  </>
);
