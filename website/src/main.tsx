import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { MockPilotTools } from "mockpilot";
import { Toaster } from "@b-origin/ming-toast";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 0, refetchOnWindowFocus: false },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <MockPilotTools>
      <App />
      <Toaster position="top-right" />
    </MockPilotTools>
  </QueryClientProvider>
);
