import { ReactNode, useEffect, useRef, useState } from "react";
import { HttpMethod, HttpStatus, MockPilot, MockState } from "../core/types";
import { Drawer } from "vaul";
import MocksList from "./MocksList";
import Logo from "./Logo";
import JsonEditor from "./JsonEditor";

const METHOD = ["get", "post", "put", "delete", "patch"] as const;
const RESPONSE_STATUS = [
  { label: "Pass Through", status: null },
  { label: "Success", status: 200 },
  { label: "Error", status: 400 },
];

function MockPilotTools({ children }: { children: ReactNode }) {
  const mockPilotInstance = useRef<MockPilot | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMount, setIsMount] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<HttpMethod>("get");
  const [delay, setDelay] = useState<number>(0);
  const [status, setStatus] = useState<HttpStatus>(null);
  const [mockRes, setMockRes] = useState<string>('{ "key": "name" }');
  const [error, setError] = useState<{ field: string | null }>({ field: null });
  const [mocks, setMocks] = useState<MockState[]>([]);
  const mocksBadgeCount = mocks.length > 99 ? "99+" : mocks.length;
  const responseBodyError = useRef(false);

  const initMockPilot = async () => {
    if (process.env.NODE_ENV === "development") {
      try {
        const { mockPilot } = await import("../core/MockPilot");
        mockPilot.subscribe((mocks) => setMocks(mocks));
        await mockPilot.start();
        mockPilotInstance.current = mockPilot;
        setIsMount(true);
      } catch (error) {
        console.error("Failed to initialize MockPilot:", error);
      }
    } else {
      setIsMount(true);
    }
  };

  const handleAddMock = async () => {
    if (!mockPilotInstance.current) return;
    if (!url.length) {
      setError({ field: "url" });
      return;
    }

    if (responseBodyError.current) {
      setError({ field: "responseBody" });
      return;
    }

    mockPilotInstance.current.mock({
      url,
      method,
      delay,
      status,
      response: JSON.parse(mockRes || "{}"),
    });
    setError({ field: null });
    setUrl("");
    setMockRes("");
  };

  const handleReset = () => {
    setUrl("");
    setMethod("get");
    setDelay(0);
    setStatus(null);
    setMockRes("");
  };

  useEffect(() => {
    initMockPilot();
  }, []);

  if (!isMount) {
    return null;
  }

  return (
    <>
      {children}
      {process.env.NODE_ENV === "development" && (
        <div className="mock-pilot">
          <Drawer.Root direction="right" onOpenChange={setIsOpen}>
            <Drawer.Trigger data-mm-drawer-trigger data-mm-open={isOpen}>
              <Logo isActive={mocks.length > 0} />
              {!!mocksBadgeCount && (
                <div data-mm-drawer-trigger data-mm-count-badge>
                  {mocksBadgeCount}
                </div>
              )}
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay data-mm-drawer-overlay />
              <Drawer.Content data-mm-drawer-content className="mock-pilot">
                <div data-mm-drawer-content-wrapper>
                  <Drawer.Title data-mm-drawer-title>
                    MockPolit tools
                  </Drawer.Title>
                  <section data-mm-config-section>
                    <div data-mm-label-wrapper>
                      <label data-mm-label>Method</label>
                      <div style={{ display: "flex", gap: "10px" }}>
                        {METHOD.map((mtd) => (
                          <button
                            key={mtd}
                            data-mm-method-button
                            data-button-selected={mtd === method}
                            onClick={() => setMethod(mtd)}
                          >
                            {mtd.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div data-mm-label-wrapper>
                      <label
                        data-mm-label
                        data-mm-label-error={error.field === "url"}
                        htmlFor="endpoint"
                      >
                        Endpoint URL{" "}
                        {error.field === "url" && (
                          <span>Invalid input value</span>
                        )}
                      </label>
                      <input
                        id="endpoint"
                        data-mm-input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onPointerDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div data-mm-label-wrapper>
                      <label data-mm-label>
                        <span>Response Delay</span>
                        <span>{delay + "ms"}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={delay}
                        onChange={(e) => setDelay(+e.target.value)}
                        onPointerDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div data-mm-label-wrapper>
                      <label data-mm-label>Response Status</label>
                      <div style={{ display: "flex", gap: "10px" }}>
                        {RESPONSE_STATUS.map((sts) => (
                          <button
                            key={sts.status}
                            data-mm-method-button
                            data-button-selected={sts.status === status}
                            onClick={() => setStatus(sts.status as HttpStatus)}
                          >
                            {sts.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div data-mm-label-wrapper>
                      <label
                        data-mm-label
                        data-mm-label-error={error.field === "responseBody"}
                      >
                        Response Body
                        {error.field === "responseBody" && (
                          <span>Invalid input value</span>
                        )}
                      </label>
                      <JsonEditor
                        value={mockRes}
                        onChange={(value) => setMockRes(value ?? "")}
                        onError={(value) => (responseBodyError.current = value)}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        data-mm-last-button
                        data-mm-close
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                      <button
                        data-mm-last-button
                        data-mm-submit
                        onClick={handleAddMock}
                      >
                        Add Mock
                      </button>
                    </div>
                    {!!mocks?.length && mockPilotInstance.current && (
                      <MocksList
                        setUrl={setUrl}
                        setMethod={setMethod}
                        setDelay={setDelay}
                        setStatus={setStatus}
                        setMockRes={setMockRes}
                      />
                    )}
                  </section>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      )}
    </>
  );
}

export { MockPilotTools };
