import { useEffect, useRef, useState } from "react";
import { HttpMethod, HttpStatus, MockMate, MockState } from "../core/types";
import { Drawer } from "vaul";
import MocksList from "./MocksList";
import Logo from "./Logo";
import DeleteIcon from "./DeleteIcon";

const METHOD = ["get", "post", "put", "delete", "patch"] as const;
const RESPONSE_STATUS = [
  { label: "Pass Through", status: null },
  { label: "Success", status: 200 },
  { label: "Error", status: 400 },
];

function MockMateTools() {
  const mockMateInstance = useRef<MockMate | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMount, setIsMount] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<HttpMethod>("get");
  const [delay, setDelay] = useState<number>(0);
  const [status, setStatus] = useState<HttpStatus>(null);
  const [mockRes, setMockRes] = useState<string>("");
  const [error, setError] = useState<{ field: string | null }>({ field: null });
  const [mocks, setMocks] = useState<MockState[]>([]);
  const mocksBadgeCount = mocks.length > 99 ? "99+" : mocks.length;

  const initMockMate = async () => {
    if (process.env.NODE_ENV === "development") {
      try {
        const { mockmate } = await import("../core/MockMate");
        mockmate.subscribe((mocks) => setMocks(mocks));
        await mockmate.start();
        mockMateInstance.current = mockmate;
        setIsMount(true);
      } catch (error) {
        console.error("Failed to initialize MockMate:", error);
      }
    }
  };

  const handleAddMock = async () => {
    if (!mockMateInstance.current) return;
    if (!url.length) {
      setError({ field: "url" });
      return;
    }

    let parsedResponse = "";
    if (mockRes.length) {
      try {
        const validJsonString = mockRes
          .replace(/'/g, '"')
          .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
          .replace(/,(\s*[}\]])/g, "$1");

        parsedResponse = JSON.parse(validJsonString);
      } catch (e) {
        console.error("Invalid JSON format:", e);
        setError({ field: "response" });

        return;
      }
    }

    mockMateInstance.current.mock({
      url,
      method,
      delay,
      status,
      response: parsedResponse,
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
    initMockMate();
  }, []);

  if (!isMount) {
    return null;
  }

  return (
    <div className="mockmate">
      <Drawer.Root direction="right" data-drawer-root onOpenChange={setIsOpen}>
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
          <Drawer.Content data-mm-drawer-content>
            <div data-mm-drawer-content-wrapper>
              <Drawer.Title>MockMate tools</Drawer.Title>
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
                  <label data-mm-label htmlFor="endpoint">
                    Endpoint URL
                  </label>
                  <input
                    id="endpoint"
                    data-mm-input
                    data-mm-input-error={error.field === "url"}
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
                  <label data-mm-label>Response Body</label>
                  <textarea
                    data-mm-textarea
                    data-mm-input-error={error.field === "response"}
                    placeholder='{ key: "value" }'
                    disabled={status === null}
                    value={mockRes}
                    onChange={(e) => setMockRes(e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
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
                {!!mocks?.length && mockMateInstance.current && <MocksList />}
              </section>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

export { MockMateTools };
