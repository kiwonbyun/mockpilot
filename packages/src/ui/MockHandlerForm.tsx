import { useState } from "react";
import { mockPilot } from "../core/MockPilotCore";
import { Handler } from "../core/types";
import Editor from "@monaco-editor/react";
import isUrl from "is-url";

interface MockHandlerFormProps {
  onClose: () => void;
  editingHandler?: Handler; // For editing existing handler
}

export const MockHandlerForm = ({
  onClose,
  editingHandler,
}: MockHandlerFormProps) => {
  const isEditing = !!editingHandler;

  // Form state
  const [formData, setFormData] = useState<Partial<Handler>>(
    editingHandler || {
      method: "GET",
      url: "",
      status: 200,
      delay: 0,
      response: {},
      active: true,
      description: "",
    }
  );

  // Response JSON state and validation
  const [responseText, setResponseText] = useState<string>(
    editingHandler ? JSON.stringify(editingHandler.response, null, 2) : "{}"
  );
  const [responseError, setResponseError] = useState<string>("");

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle number inputs
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0,
      });
      return;
    }

    // Handle checkbox inputs
    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: isChecked,
      });
      return;
    }

    // Handle regular inputs
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle Monaco Editor content change
  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || "";
    setResponseText(newValue);
    setResponseError("");

    try {
      const parsed = JSON.parse(newValue);
      setFormData({
        ...formData,
        response: parsed,
      });
    } catch (err) {
      // Don't set responseError immediately on every keystroke if it's invalid JSON temporarily
      // The error will be caught by validateForm or shown below the editor
      if (newValue.trim() !== "" && !isValidJson(newValue)) {
        setResponseError("Invalid JSON format");
      } else {
        setResponseError(""); // Clear error if JSON becomes valid or editor is empty
      }
    }
  };

  // Helper function to check for valid JSON (optional, can be simpler)
  const isValidJson = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.url?.trim()) {
      newErrors.url = "URL is required";
    }

    if (formData.url && !isUrl(formData.url)) {
      newErrors.url = "Invalid URL";
    }

    if (!formData.method?.trim()) {
      newErrors.method = "HTTP method is required";
    }

    if (responseError) {
      newErrors.response = responseError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (isEditing && editingHandler?.id) {
      // Update existing handler
      mockPilot.updateHandler(editingHandler.id, formData);
    } else {
      // Add new handler
      mockPilot.addHandler(formData as Handler);
    }

    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 10000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
          padding: "1.5rem",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold" }}>
            {isEditing ? "Edit Mock Handler" : "Add New Mock Handler"}
          </h2>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#718096",
            }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* URL */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="url"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              URL Pattern *
            </label>
            <input
              id="url"
              name="url"
              type="text"
              value={formData.url || ""}
              onChange={handleInputChange}
              placeholder="/api/users/:id"
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: errors.url ? "1px solid #f56565" : "1px solid #e2e8f0",
              }}
            />
            {errors.url && (
              <p
                style={{
                  color: "#f56565",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.url}
              </p>
            )}
            <p
              style={{
                fontSize: "0.75rem",
                color: "#718096",
                marginTop: "0.25rem",
              }}
            >
              Supports MSW URL pattern matching (e.g. /api/users,
              /api/users/:id)
            </p>
          </div>

          {/* Method and Status */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label
                htmlFor="method"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                HTTP Method *
              </label>
              <select
                id="method"
                name="method"
                value={formData.method || "GET"}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: errors.method
                    ? "1px solid #f56565"
                    : "1px solid #e2e8f0",
                }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
                <option value="OPTIONS">OPTIONS</option>
                <option value="HEAD">HEAD</option>
              </select>
              {errors.method && (
                <p
                  style={{
                    color: "#f56565",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.method}
                </p>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <label
                htmlFor="status"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Status Code
              </label>
              <input
                id="status"
                name="status"
                type="number"
                value={formData.status || 200}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #e2e8f0",
                }}
              />
            </div>
          </div>

          {/* Delay and Active */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: 1 }}>
              <label
                htmlFor="delay"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Delay (ms)
              </label>
              <input
                id="delay"
                name="delay"
                type="number"
                value={formData.delay || 0}
                onChange={handleInputChange}
                min="0"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #e2e8f0",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <input
                id="active"
                name="active"
                type="checkbox"
                checked={formData.active !== false}
                onChange={handleInputChange}
                style={{ marginRight: "0.5rem" }}
              />
              <label htmlFor="active">Active</label>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="description"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Optional description of this mock handler"
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
              }}
            />
          </div>

          {/* Response */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="response"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Response JSON
            </label>
            <Editor
              height="200px"
              language="json"
              theme="vs-light"
              value={responseText}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                scrollbar: {
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
                lineNumbers: "on",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
            {responseError && (
              <p
                style={{
                  color: "#f56565",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                }}
              >
                {responseError}
              </p>
            )}
          </div>

          {/* Form actions */}
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#3182ce",
                color: "white",
                cursor: "pointer",
              }}
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MockHandlerForm;
