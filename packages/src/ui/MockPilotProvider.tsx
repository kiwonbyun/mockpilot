import { useEffect, useState } from "react";
import { mockPilot } from "../core/MockPilotCore";
import { MockPilotEvent } from "../core/EventEmitter";
import DevTools from "./DevTools";

interface MockPilotProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export const MockPilotProvider = ({
  children,
  defaultOpen,
  position = "bottom-right",
}: MockPilotProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    const unsubscribe = mockPilot.on(MockPilotEvent.INITIALIZED, () => {
      setIsInitialized(true);
    });

    mockPilot.init();

    return () => {
      unsubscribe();
      mockPilot.cleanup();
    };
  }, []);

  if (!isInitialized) return null;

  return (
    <>
      {children}
      {isDev && <DevTools defaultOpen={defaultOpen} position={position} />}
    </>
  );
};
