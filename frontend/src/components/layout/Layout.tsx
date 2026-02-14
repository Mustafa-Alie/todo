import Background from "@/components/UI/Background";
import Todo from "@/components/UI/Todo";

import { ThemeContext } from "@/context/ThemeContext";
import { use, useEffect, useState } from "react";
import Footer from "@/components/UI/Footer";
import Login from "@/components/UI/Login";
import Signup from "@/components/UI/Signup";

export default function Layout() {
  const { theme } = use(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signInUp, setSignInUp] = useState<"signIn" | "signUp">("signIn");

  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          setIsLoggedIn(false);
          return;
        }

        setIsLoggedIn(true);

        //after successful signin, fetch todos:
        const todosRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/todos`,
          { credentials: "include" },
        );

        if (!todosRes.ok) return;

        const data = await todosRes.json();
        setTodos(data);
      } catch (err) {
        //silent
        // console.error(err);
      }
    }

    init();
  }, []);

  return (
    <main
      className={`min-h-screen ${theme === "light" ? "bg-white" : "bg-black"}`}
    >
      <Background />

      {isLoggedIn ? (
        <Todo
          onLogout={() => setIsLoggedIn(false)}
          todos={todos}
          setTodos={setTodos}
        />
      ) : signInUp === "signUp" ? (
        <Signup
          onLogin={() => setIsLoggedIn(true)}
          onSignIn={() => setSignInUp("signIn")}
        />
      ) : (
        <Login
          onLogin={() => setIsLoggedIn(true)}
          onSignUp={() => setSignInUp("signUp")}
        />
      )}

      <Footer />
    </main>
  );
}
