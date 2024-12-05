import { useState } from "react";
import { toast } from "@b-origin/ming-toast";

function App() {
  const fakeUrl = "https://fake-api.com/users";
  const [res, setRes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleApi = async () => {
    try {
      setLoading(true);
      const res = await fetch(fakeUrl);
      const result = await res?.json();
      if (!result.ok) {
        throw new Error(result.message);
      }
      setRes(JSON.stringify(result.data));
      toast("요청 성공!!");
    } catch (err) {
      setRes(null);
      if (err instanceof Error) {
        toast(err.message);
      } else {
        toast("알 수 없는 에러가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <button onClick={handleApi} style={{ width: "200px", height: "200px" }}>
        {loading ? "loading...." : `가짜 url api 요청`}
      </button>
      {!!res && <span>{res}</span>}
    </div>
  );
}

export default App;
