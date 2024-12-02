import { useEffect, useRef, useState } from "react";
import { HttpMethod, HttpStatus, MockMate, MockState } from "../core/types";
import { Drawer } from "vaul";
import MocksList from "./MocksList";

const METHOD = ["get", "post", "put", "delete", "patch"] as const;
const RESPONSE_STATUS = [
  { label: "Pass Through", status: null },
  { label: "Success", status: 200 },
  { label: "Error", status: 400 },
];

function MockMateTools() {
  const mockMateInstance = useRef<MockMate | null>(null);
  const [isMount, setIsMount] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<HttpMethod>("get");
  const [delay, setDelay] = useState<number>(0);
  const [status, setStatus] = useState<HttpStatus>(null);
  const [mockRes, setMockRes] = useState<string>("");
  const [error, setError] = useState(false);
  const [mocks, setMocks] = useState<MockState[]>([]);

  const updateMocks = () => {
    if (mockMateInstance.current) {
      setMocks(mockMateInstance.current.getMocks());
    }
  };

  const initMockMate = async () => {
    try {
      const { mockmate } = await import("../core/MockMate");
      await mockmate.start();
      mockMateInstance.current = mockmate;
      setIsMount(true);
    } catch (error) {
      console.error("Failed to initialize MockMate:", error);
    }
  };

  const handleAddMock = async () => {
    if (!mockMateInstance.current) return;
    if (!url.length) {
      setError(true);
      return;
    }
    mockMateInstance.current.mock({
      url,
      method,
      delay,
      status,
      response: mockRes,
    });
    setError(false);
    updateMocks();
    // setUrl("");
  };

  const handleReset = () => {
    setUrl("");
    setMethod("get");
    setDelay(0);
    setStatus(null);
    setMockRes("");
  };

  const handleRemove = (id: string) => {
    if (!mockMateInstance.current) return;
    mockMateInstance.current.remove(id);
    updateMocks();
  };

  useEffect(() => {
    initMockMate();
  }, []);

  if (!isMount) {
    return null;
  }

  return (
    <div className="mockmate">
      <Drawer.Root direction="right" data-drawer-root>
        <Drawer.Trigger>Open MockMate</Drawer.Trigger>
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
                    data-mm-input-error={error}
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
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
                    placeholder='{"key": "value"}'
                    disabled={status === null}
                    value={mockRes}
                    onChange={(e) => setMockRes(e.target.value)}
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
                {!!mocks?.length && (
                  <MocksList mocks={mocks} handleRemove={handleRemove} />
                )}
              </section>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

export { MockMateTools };
