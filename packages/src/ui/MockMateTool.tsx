import { useEffect, useRef, useState } from "react";
import { HttpMethod, HttpStatus, MockMate } from "../core/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/src/components/ui/drawer";

function MockMateTool() {
  const mockMateInstance = useRef<MockMate | null>(null);
  const [isMount, setIsMount] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<HttpMethod>("get");
  const [delay, setDelay] = useState<number>(1000);
  const [status, setStatus] = useState<HttpStatus>(200);
  const [response, setResponse] = useState<string>("");
  const mocks = mockMateInstance.current?.getMocks();
  console.log(mocks);

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
    mockMateInstance.current.mock({
      url,
      method,
      delay,
      status,
      response,
    });
    setUrl("");
  };

  useEffect(() => {
    initMockMate();
  }, []);

  if (!isMount) {
    return null;
  }

  return (
    <div className="mockmate">
      <Drawer direction="right" modal={false}>
        <DrawerTrigger asChild>
          <button>sad</button>
        </DrawerTrigger>
        <DrawerContent className="w-[550px] bg-white">
          <div>
            <div>asd</div>
          </div>
        </DrawerContent>
      </Drawer>
      <div>
        <input value={url} onChange={(e) => setUrl(e.target.value)} />
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
        <button onClick={handleAddMock}>add</button>
        <button onClick={() => setStatus(500)}>에러 발생</button>
        <button onClick={() => setStatus(200)}>정상 응답</button>
      </div>
      <ul>
        {mocks?.map((mock) => {
          return <li key={mock.id}>{mock.id}</li>;
        })}
      </ul>
    </div>
  );
}

export { MockMateTool };
