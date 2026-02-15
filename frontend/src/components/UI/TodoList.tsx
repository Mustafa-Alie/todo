import { ThemeContext } from "@/context/ThemeContext";
import { use, useEffect, useState } from "react";

import checkIcon from "@/assets/images/icon-check.svg";
import crossIcon from "@/assets/images/icon-cross.svg";
import type { todosType } from "@/types/types";
import { deleteTodo, updateTodoCompletion } from "@/api/todoApi";

type FilterType = "all" | "active" | "completed";

export default function TodoList({ todos }: { todos: todosType[] }) {
  const { theme } = use(ThemeContext);

  const [localTodos, setLocalTodos] = useState<todosType[]>(todos);
  const [filter, setFilter] = useState<FilterType>("all");

  // Sync local state when parent todos change
  useEffect(() => {
    setLocalTodos(todos);
  }, [todos]);

  // Filtered todos
  const filteredTodos = localTodos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // all
  });

  // Handle deleting a todo
  const handleDelete = async (id: string) => {
    setLocalTodos((prev) => prev.filter((todo) => todo.id !== id));

    const success = await deleteTodo(id);
    if (!success) {
      setLocalTodos(todos);
      alert("Failed to delete todo. Please try again.");
    }
  };

  // Handle clearing completed todos
  const handleClearCompleted = async () => {
    const completedTodos = localTodos.filter((t) => t.completed);
    setLocalTodos((prev) => prev.filter((t) => !t.completed));

    // Delete each completed todo from backend
    await Promise.all(completedTodos.map((todo) => deleteTodo(todo.id)));
  };

  return (
    <>
      <ul
        className={`mt-4 flex flex-col rounded-lg ${
          theme === "light"
            ? "bg-white shadow-xl shadow-gray-200"
            : "bg-slate-800"
        }`}
      >
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`group flex items-center gap-4 border-b p-2 pr-4 text-xl ${
              theme === "light"
                ? "border-b-gray-400 text-gray-700"
                : "border-b-gray-700 text-gray-400"
            }`}
          >
            <div
              className={`ms-2 flex min-h-5 min-w-5 cursor-pointer items-center justify-center rounded-full border border-gray-400 ${
                todo.completed
                  ? "bg-linear-to-br from-cyan-400 to-violet-500"
                  : ""
              }`}
              onClick={() => updateTodoCompletion(todo.id, setLocalTodos)}
            >
              <img
                alt="check icon"
                className={`${todo.completed ? "block" : "hidden"}`}
                src={checkIcon}
              />
            </div>

            <span
              className={`max-w-[80%] shrink cursor-pointer p-2 ${
                theme === "light" ? "text-gray-700" : "text-gray-400"
              }`}
              onClick={() => updateTodoCompletion(todo.id, setLocalTodos)}
            >
              {todo.content}
            </span>

            <button
              type="button"
              className="ml-auto block cursor-pointer p-1 md:hidden md:group-hover:block"
              onClick={() => handleDelete(todo.id)}
            >
              <img
                alt="cross icon"
                className="min-h-4 min-w-4"
                src={crossIcon}
              />
            </button>
          </li>
        ))}

        <li
          className={`flex items-center justify-between gap-2 p-4 text-xs font-normal text-nowrap md:gap-4 ${
            theme === "light" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <p>
            <span className="pr-1 font-extrabold">
              {localTodos.filter((t) => !t.completed).length}
            </span>
            items left
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              className={`cursor-pointer p-1 ${
                filter === "all" ? "font-bold" : ""
              } ${theme === "light" ? "hover:text-gray-900" : "hover:text-gray-300"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={`cursor-pointer p-1 ${
                filter === "active" ? "font-bold" : ""
              } ${theme === "light" ? "hover:text-gray-900" : "hover:text-gray-300"}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              type="button"
              className={`cursor-pointer p-1 ${
                filter === "completed" ? "font-bold" : ""
              } ${theme === "light" ? "hover:text-gray-900" : "hover:text-gray-300"}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          <button
            type="button"
            className={`cursor-pointer p-1 ${
              theme === "light" ? "hover:text-gray-900" : "hover:text-gray-300"
            }`}
            onClick={handleClearCompleted}
          >
            Clear Completed
          </button>
        </li>
      </ul>

      {/* Mobile filter buttons */}
      <div
        className={`mt-8 flex justify-center gap-8 rounded-lg p-2 md:hidden ${
          theme === "light"
            ? "bg-white text-gray-500 shadow-xl shadow-gray-200"
            : "bg-slate-800 text-gray-300"
        }`}
      >
        <button
          type="button"
          className={`cursor-pointer p-1 ${
            filter === "all" ? "font-bold text-blue-600" : ""
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          type="button"
          className={`cursor-pointer p-1 ${
            filter === "active" ? "font-bold" : ""
          }`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          type="button"
          className={`cursor-pointer p-1 ${
            filter === "completed" ? "font-bold" : ""
          }`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>
    </>
  );
}
