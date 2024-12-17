/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

const JsonDisplay = ({ data }: { data: any }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const jsonString = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="bg-gray-100 p-4 overflow-auto h-96 scrollbar">
        <code className="text-sm">{JSON.stringify(data, null, 2)}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default JsonDisplay;
