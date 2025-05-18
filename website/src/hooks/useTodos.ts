import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import type { Todo } from "../types/todo";

const API_URL = "https://fake-server.com/todo";

// API 호출 함수들
async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Network response was not ok while fetching todos");
  }

  return response.json();
}

async function addTodoAPI(newTodoText: string): Promise<Todo> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: newTodoText, completed: false }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok while adding todo");
  }

  return response.json();
}

async function updateTodoAPI(
  updatedTodo: Partial<Todo> & { id: number }
): Promise<Todo> {
  const response = await fetch(`${API_URL}/${updatedTodo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok while updating todo");
  }
  // 실제 서버가 없으므로, 다음은 예시입니다.
  // return response.json();
  console.warn(
    "updateTodoAPI: Fake API call, returning placeholder. Uncomment and adjust when real API is available."
  );
  // PUT 요청 시 전체 객체를 반환하거나, 업데이트된 부분만 반환할 수 있습니다. 여기서는 전체를 가정합니다.
  // 서버의 응답에 따라 아래를 수정해야 합니다.
  const fullUpdatedTodo = await fetchTodos().then(
    (todos) =>
      todos.find((t) => t.id === updatedTodo.id) || (updatedTodo as Todo)
  );
  return { ...fullUpdatedTodo, ...updatedTodo };
}

async function deleteTodoAPI(todoId: number): Promise<void> {
  const response = await fetch(`${API_URL}/${todoId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok while deleting todo");
  }
  // DELETE는 보통 내용 없이 204 No Content를 반환합니다.
  console.warn(
    "deleteTodoAPI: Fake API call. Uncomment and adjust when real API is available."
  );
}

export function useTodos() {
  const queryClient = useQueryClient();
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const {
    data: todos = [],
    isLoading,
    isError,
    error,
  } = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const addTodoMutation = useMutation<Todo, Error, string>({
    mutationFn: addTodoAPI,
    onSuccess: (newTodo) => {
      // Optimistic update 방법 1: 반환된 새 todo를 직접 캐시에 추가
      // queryClient.setQueryData<Todo[]>(['todos'], (oldTodos = []) => [...oldTodos, newTodo]);
      // Optimistic update 방법 2: 서버에서 전체 목록을 다시 가져오도록 무효화 (더 간단)
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      window.alert("Failed to add todo: " + error.message);
    },
  });

  const updateTodoMutation = useMutation<
    Todo,
    Error,
    Partial<Todo> & { id: number }
  >({
    mutationFn: updateTodoAPI,
    onSuccess: (updatedTodo) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      // 또는 특정 아이템만 업데이트:
      // queryClient.setQueryData<Todo[]>(['todos'], (oldTodos = []) =>
      //   oldTodos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)
      // );
      if (editingTodoId === updatedTodo.id) {
        setEditingTodoId(null);
        setEditText("");
      }
    },
  });

  const deleteTodoMutation = useMutation<void, Error, number>({
    mutationFn: deleteTodoAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const addTodo = useCallback(
    (text: string) => {
      if (text.trim() === "") return;
      addTodoMutation.mutate(text.trim());
    },
    [addTodoMutation]
  );

  const toggleComplete = useCallback(
    (id: number, currentCompleted: boolean, currentText: string) => {
      if (editingTodoId === id) return;
      // PUT 요청을 위해 전체 Todo 객체 또는 업데이트할 필드를 전달해야 합니다.
      // 여기서는 전체 Todo 객체를 구성하여 전달한다고 가정합니다.
      // 실제 서버 API 스펙에 따라 text 필드를 포함할지 결정합니다.
      updateTodoMutation.mutate({
        id,
        completed: !currentCompleted,
        text: currentText,
      });
    },
    [updateTodoMutation, editingTodoId]
  );

  const deleteTodo = useCallback(
    (id: number) => {
      deleteTodoMutation.mutate(id);
      if (editingTodoId === id) {
        setEditingTodoId(null);
        setEditText("");
      }
    },
    [deleteTodoMutation, editingTodoId]
  );

  const startEdit = useCallback((todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditText(todo.text);
  }, []);

  const saveEdit = useCallback(
    (id: number) => {
      if (editText.trim() === "") {
        deleteTodoMutation.mutate(id); // 텍스트가 비면 삭제
        setEditingTodoId(null);
        setEditText("");
        return;
      }
      updateTodoMutation.mutate({ id, text: editText.trim() });
      // 성공 시 onSuccess에서 editingTodoId 등이 초기화됩니다.
    },
    [editText, updateTodoMutation, deleteTodoMutation]
  );

  const cancelEdit = useCallback(() => {
    setEditingTodoId(null);
    setEditText("");
  }, []);

  return {
    todos,
    isLoading,
    isError,
    error,
    editingTodoId,
    editText,
    setEditText, // TodoItem에서 직접 사용
    addTodo,
    toggleComplete, // id, currentCompleted, currentText를 받도록 수정 필요
    deleteTodo,
    startEdit,
    saveEdit,
    cancelEdit,
    // mutation 상태도 필요에 따라 반환 가능
    // isAdding: addTodoMutation.isPending,
    // isUpdating: updateTodoMutation.isPending,
    // isDeleting: deleteTodoMutation.isPending,
  };
}
