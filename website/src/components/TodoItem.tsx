import { useTransition } from "react";
import type { Todo } from "../types/todo";

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  editText: string;
  onToggleComplete: () => void;
  onDelete: (id: number) => Promise<number>;
  onStartEdit: (todo: Todo) => void;
  onSaveEdit: (id: number) => Promise<void>;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
}

export default function TodoItem({
  todo,
  isEditing,
  editText,
  onToggleComplete,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTextChange,
}: TodoItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: number) => {
    try {
      startTransition(async () => {
        await onDelete(id);
      });
    } catch (err) {
      window.alert("Failed to delete todo: " + err);
    }
  };

  const handleSave = async (id: number) => {
    try {
      startTransition(async () => {
        await onSaveEdit(id);
      });
    } catch (err) {
      window.alert("Failed to save todo: " + err);
    }
  };

  return (
    <li
      className={`flex items-center justify-between p-4 rounded-md shadow hover:shadow-lg transition-shadow ${
        isEditing
          ? "bg-yellow-50"
          : todo.completed
          ? "bg-green-100 line-through text-green-700 cursor-pointer"
          : "bg-white cursor-pointer"
      }`}
      onClick={() => !isEditing && onToggleComplete()}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => onEditTextChange(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && onSaveEdit(todo.id)}
            className="flex-grow p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <div className="ml-2 flex-shrink-0">
            <button
              onClick={() => handleSave(todo.id)}
              disabled={isPending}
              className="mr-1 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <span className={`flex-grow ${todo.completed ? "italic" : ""}`}>
            {todo.text}
          </span>
          <div className="ml-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit(todo);
              }}
              className="mr-1 bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(todo.id);
              }}
              disabled={isPending}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
