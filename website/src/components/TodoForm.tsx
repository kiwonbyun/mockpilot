import { useState, useTransition } from "react";

interface TodoFormProps {
  onAddTodo: (text: string) => Promise<void>;
}

export default function TodoForm({ onAddTodo }: TodoFormProps) {
  const [inputText, setInputText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputText.trim() === "") return;
    try {
      startTransition(async () => {
        await onAddTodo(inputText.trim());
        setInputText("");
      });
    } catch (err) {
      window.alert("Failed to add todo: " + err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex">
      <input
        disabled={isPending}
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Add a new todo"
        className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        disabled={isPending}
        type="submit"
        className="bg-blue-500 text-white p-3 rounded-r-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add
      </button>
    </form>
  );
}
