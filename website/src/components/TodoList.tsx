import type { Todo } from "../types/todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  editingTodoId: number | null;
  editText: string;
  onToggleComplete: (
    id: number,
    currentCompleted: boolean,
    currentText: string
  ) => void;
  onDelete: (id: number) => void;
  onStartEdit: (todo: Todo) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
}

export default function TodoList({
  todos,
  editingTodoId,
  editText,
  onToggleComplete,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTextChange,
}: TodoListProps) {
  if (todos.length === 0) {
    return <p className="text-center text-gray-500">No todos yet. Add some!</p>;
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingTodoId === todo.id}
          editText={editText}
          onToggleComplete={() =>
            onToggleComplete(todo.id, todo.completed, todo.text)
          }
          onDelete={onDelete}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onEditTextChange={onEditTextChange}
        />
      ))}
    </ul>
  );
}
