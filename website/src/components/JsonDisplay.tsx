/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

const JsonDisplay = ({ data }: { data: any }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const jsonString = JSON.stringify(data, null, 2);

    try {
      // clipboard API 지원 여부 확인
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(jsonString);
      } else {
        // 폴백: 구형 방식 사용
        const textArea = document.createElement("textarea");
        textArea.value = jsonString;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
          textArea.remove();
        } catch (error) {
          console.error("클립보드 복사 실패:", error);
          textArea.remove();
          return;
        }
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
    }
  };

  return (
    <div className="relative">
      <pre className="bg-black text-white p-4 overflow-auto h-52 scrollbar">
        <code className="text-sm">{JSON.stringify(data, null, 2)}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-4 px-3 py-1 text-white text-sm bg-gray-700 hover:bg-gray-500 rounded transition-colors"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default JsonDisplay;
