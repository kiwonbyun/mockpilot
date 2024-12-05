import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { MockMateTools } from "mockmate";
import { Toaster } from "@b-origin/ming-toast";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster position="top-center" />
    <MockMateTools />
  </>
);
