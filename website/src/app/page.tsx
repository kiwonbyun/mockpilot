"use client";

import { useTodos } from "../hooks/useTodos";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

export default function HomePage() {
  const {
    todos,
    isLoading,
    isError,
    error,
    editingTodoId,
    editText,
    setEditText,
    addTodo,
    toggleComplete,
    deleteTodo,
    startEdit,
    saveEdit,
    cancelEdit,
  } = useTodos();

  if (isLoading) {
    return <div className="text-center p-10">Loading todos...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-10 text-red-500 flex flex-col gap-4">
        Error fetching todos: {error?.message}
        <p>직접 endpoint에 대한 모킹을 작성해보세요.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        My Todo List (with API)
      </h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todos={todos}
        editingTodoId={editingTodoId}
        editText={editText}
        onToggleComplete={toggleComplete}
        onDelete={deleteTodo}
        onStartEdit={startEdit}
        onSaveEdit={saveEdit}
        onCancelEdit={cancelEdit}
        onEditTextChange={setEditText}
      />
    </div>
  );
}
