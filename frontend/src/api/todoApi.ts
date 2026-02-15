import type { todosType } from "@/types/types";

export async function handleSignout(onLogout: () => void) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signout`, {
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    console.log(data);
    return;
  }

  onLogout();
}

export async function addTodo(
  e: React.KeyboardEvent,
  newTodo: string,
  setTodos: React.Dispatch<React.SetStateAction<todosType[]>>,
  setNewTodo: React.Dispatch<React.SetStateAction<string>>,
) {
  if (e.code !== "Enter") return;

  if (newTodo === "") return;

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: newTodo }),
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    console.log(data);
    return;
  }

  const data = await res.json();

  setTodos((oldTodos) => [data, ...oldTodos]);

  //clear input
  setNewTodo("");
}

/////////////////////////////////

export async function updateTodoCompletion(
  id: string,
  setLocalTodos: React.Dispatch<React.SetStateAction<todosType[]>>,
) {
  setLocalTodos((prev) =>
    prev.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    ),
  );

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to update");
    }
  } catch (err) {
    console.error(err);

    //rollback if server fails
    setLocalTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }
}

export async function deleteTodo(id: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/todos/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to update");
    }
    return true;
  } catch (err) {
    console.error(err);

    return false;
  }
}
