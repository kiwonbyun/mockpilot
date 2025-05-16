import { useState, useEffect } from "react";
import { MockPilotEvent } from "../core/EventEmitter";
import { mockPilot } from "../core/MockPilotCore";
import { Handler } from "../core/types";
import MockHandlerForm from "./MockHandlerForm";
import useKeyPress from "../hooks/useKeyPress";

// Note: vaul library will need to be installed
// import { Drawer } from "vaul";

interface DevToolsProps {
  defaultOpen?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export const DevTools = ({
  defaultOpen = false,
  position = "bottom-right",
}: DevToolsProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [handlers, setHandlers] = useState<Handler[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHandler, setEditingHandler] = useState<Handler | undefined>(
    undefined
  );
  useKeyPress("Escape", () => {
    if (showForm) {
      setShowForm(false);
      return;
    }
    setIsOpen(false);
  });

  useEffect(() => {
    // Initialize handlers
    console.log(mockPilot.getHandlers());
    setHandlers(mockPilot.getHandlers());

    // Subscribe to handler changes
    const unsubscribe = mockPilot.on(MockPilotEvent.HANDLER_CHANGED, () => {
      setHandlers(mockPilot.getHandlers());
    });

    return unsubscribe;
  }, []);

  // Position styles based on props
  const getPositionStyle = () => {
    switch (position) {
      case "top-left":
        return { top: "1rem", left: "1rem" };
      case "top-right":
        return { top: "1rem", right: "1rem" };
      case "bottom-left":
        return { bottom: "1rem", left: "1rem" };
      case "bottom-right":
      default:
        return { bottom: "1rem", right: "1rem" };
    }
  };

  // Icon button styles
  const iconButtonStyle = {
    position: "fixed" as const,
    ...getPositionStyle(),
    zIndex: 9999,
    width: "3rem",
    height: "3rem",
    borderRadius: "50%",
    backgroundColor: "#3182ce",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    fontSize: "1.25rem",
    fontWeight: "bold",
    transition: "transform 0.2s ease-in-out",
    ":hover": {
      transform: "scale(1.05)",
    },
  };

  // Temporary drawer styles (will be replaced with vaul)
  const drawerStyle = {
    position: "fixed" as const,
    bottom: isOpen ? "0" : "-100%",
    left: "0",
    width: "100%",
    height: "70vh",
    backgroundColor: "white",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
    transition: "bottom 0.3s ease-in-out",
    zIndex: 9998,
    overflow: "hidden" as const,
    display: "flex",
    flexDirection: "column" as const,
  };

  // Header styles
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    borderBottom: "1px solid #e2e8f0",
  };

  // Content styles
  const contentStyle = {
    flex: 1,
    padding: "1rem 1.5rem",
    overflowY: "auto" as const,
  };

  // Toggle handler active state
  const toggleHandlerActive = (id: string) => {
    const handler = handlers.find((h) => h.id === id);
    if (handler) {
      mockPilot.updateHandler(id, { active: !handler.active });
    }
  };

  // Delete handler
  const deleteHandler = (id: string) => {
    if (window.confirm("Are you sure you want to delete this handler?")) {
      mockPilot.removeHandler(id);
    }
  };

  // Reset all handlers
  const resetHandlers = () => {
    if (window.confirm("Are you sure you want to reset all handlers?")) {
      mockPilot.reset();
    }
  };

  // Add new mock handler
  const addNewHandler = () => {
    setEditingHandler(undefined);
    setShowForm(true);
  };

  // Edit existing handler
  const editHandler = (handler: Handler) => {
    setEditingHandler(handler);
    setShowForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setEditingHandler(undefined);
  };

  return (
    <>
      {/* Floating icon button */}
      {!isOpen && (
        <div style={iconButtonStyle} onClick={() => setIsOpen(true)}>
          MP
        </div>
      )}

      {/* Drawer (temporary implementation until vaul is installed) */}
      <div style={drawerStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold" }}>
            MockPilot
          </h2>
          <div>
            <button
              onClick={resetHandlers}
              style={{
                marginRight: "1rem",
                padding: "0.5rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#718096",
              }}
            >
              Reset
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: "0.5rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#718096",
              }}
            >
              Close
            </button>
          </div>
        </div>

        <div style={contentStyle}>
          {handlers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <p>No mock handlers configured yet.</p>
              <p>Click the "+" button to add your first handler.</p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {handlers.map((handler) => (
                <div
                  key={handler.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "1rem",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: getMethodColor(handler.method),
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        {handler.method.toUpperCase()}
                      </span>
                      <span style={{ fontWeight: "500" }}>{handler.url}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <label
                        className="toggle-switch"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          checked={handler.active !== false}
                          onChange={() => toggleHandlerActive(handler.id)}
                          style={{ marginRight: "0.25rem" }}
                        />
                        <span>Active</span>
                      </label>
                      <button
                        onClick={() => editHandler(handler)}
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: "#4299e1",
                          marginRight: "0.5rem",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteHandler(handler.id)}
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: "#e53e3e",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      fontSize: "0.875rem",
                      color: "#4a5568",
                    }}
                  >
                    <div>Status: {handler.status}</div>
                    {handler.delay !== undefined && (
                      <div>Delay: {handler.delay}ms</div>
                    )}
                    {handler.description && (
                      <div>Description: {handler.description}</div>
                    )}
                  </div>
                  <div style={{ marginTop: "0.75rem" }}>
                    <details>
                      <summary
                        style={{
                          cursor: "pointer",
                          userSelect: "none",
                          padding: "0.25rem 0",
                        }}
                      >
                        Response
                      </summary>
                      <pre
                        style={{
                          backgroundColor: "#edf2f7",
                          padding: "0.75rem",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                          overflowX: "auto",
                          marginTop: "0.5rem",
                        }}
                      >
                        {JSON.stringify(handler.response, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add button */}
        <button
          onClick={addNewHandler}
          style={{
            position: "absolute" as const,
            bottom: "1.5rem",
            right: "1.5rem",
            width: "3.5rem",
            height: "3.5rem",
            borderRadius: "50%",
            backgroundColor: "#3182ce",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          +
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <MockHandlerForm onClose={closeForm} editingHandler={editingHandler} />
      )}
    </>
  );
};

// Helper function to get color for HTTP method
function getMethodColor(method: string): string {
  const methodMap: Record<string, string> = {
    GET: "#4299e1", // blue
    POST: "#48bb78", // green
    PUT: "#ed8936", // orange
    DELETE: "#f56565", // red
    PATCH: "#9f7aea", // purple
  };

  return methodMap[method.toUpperCase()] || "#a0aec0"; // default gray
}

export default DevTools;
