import { ThemeContext } from "@/context/ThemeContext";
import React, { use, useState } from "react";

import TodoList from "@/components/UI/TodoList";
import Header from "@/components/UI/Header";
import type { todosType } from "@/types/types";
import { addTodo, handleSignout } from "@/api/todoApi";

export default function Todo({
  onLogout,
  todos,
  setTodos,
}: {
  onLogout: () => void;
  todos: todosType[];
  setTodos: React.Dispatch<React.SetStateAction<todosType[]>>;
}) {
  // console.log(todos);
  const { theme } = use(ThemeContext);

  const [newTodo, setNewTodo] = useState("");

  return (
    <>
      <section className="relative mx-auto -mt-[40%] max-w-10/12 md:-mt-[15%] md:max-w-8/12 lg:max-w-4/12">
        <Header />

        <div
          className={`flex items-center gap-4 rounded-lg p-2 ${theme === "light" ? "bg-white" : "bg-slate-800"}`}
        >
          <span className="ms-2 h-5 w-5 rounded-full border border-gray-400"></span>

          <div
            className="grow"
            onKeyDown={
              // (e) => addTodo(e)
              (e) => addTodo(e, newTodo, setTodos, setNewTodo)
            }
          >
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              maxLength={100}
              placeholder="Create a new todo"
              className={`w-full p-2 text-xl focus:outline-none ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}
            />
          </div>
        </div>

        <TodoList todos={todos} />
      </section>

      <div className="flex justify-center pt-8">
        <button
          type="button"
          onClick={() => {
            handleSignout(onLogout);
          }}
          className={`cursor-pointer rounded-md px-8 py-2 font-medium transition ${theme === "light" ? "bg-slate-400 text-gray-50 hover:bg-slate-500" : "bg-slate-800 text-gray-300 hover:bg-slate-700"}`}
        >
          Sign out
        </button>
      </div>
    </>
  );
}
