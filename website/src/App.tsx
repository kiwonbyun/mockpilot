import { useState } from "react";
import { toast } from "@b-origin/ming-toast";

function App() {
  const fakeUrl = "https://fake-api.com/users";
  const fakeUrl2 = "https://fake-api.com/items";
  const [res, setRes] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApi = async (url: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(url);
      if (!res.ok) {
        const errorRes = await res.json();
        console.error("Error data:", JSON.stringify(errorRes));
        throw new Error(res.statusText);
      }
      const result = await res?.json();
      setRes(JSON.stringify(result));
      toast("요청 성공!!");
    } catch (err) {
      setRes(null);
      if (err instanceof Error) {
        toast(err.message);
      } else {
        toast("알 수 없는 에러가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => handleApi(fakeUrl)}
          style={{ width: "200px", height: "200px" }}
        >
          가짜 url api 요청
        </button>
        <button
          onClick={() => handleApi(fakeUrl2)}
          style={{ width: "200px", height: "200px" }}
        >
          가짜 url api 요청2
        </button>
        {isLoading && <h1>Loading...</h1>}
        {!!res && <h1>{res}</h1>}
      </div>
    </div>
  );
}

export default App;
