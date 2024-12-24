import { Editor, EditorProps, OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";

interface JsonEditorProps {
  value: EditorProps["value"];
  onChange: EditorProps["onChange"];
  onError?: (hasError: boolean) => void;
}

function JsonEditor({ value, onChange, onError }: JsonEditorProps) {
  const handleChange = (
    value: string | undefined,
    ev: editor.IModelContentChangedEvent
  ) => {
    try {
      if (value) {
        JSON.parse(value);
        onError?.(false);
      }
    } catch (e) {
      onError?.(true);
    }
    onChange?.(value, ev);
  };
  return (
    <div onPointerDown={(e) => e.stopPropagation()}>
      <Editor
        height={350}
        defaultLanguage="json"
        value={value}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
}

export default JsonEditor;
