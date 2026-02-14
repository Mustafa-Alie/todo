import { ThemeContext } from "@/context/ThemeContext";
import { use } from "react";

export default function Footer() {
  const { theme } = use(ThemeContext);

  return (
    <footer
      className={`mt-12 text-center ${`${theme === "light" ? "text-cyan-800" : "text-gray-400"}`}`}
    >
      <p>
        Challenge by: &nbsp;
        <a
          href="https://www.frontendmentor.io/"
          target="_blank"
          className={`text-lg font-semibold ${theme === "light" ? "text-cyan-700" : "text-cyan-500"}`}
        >
          Frontend Mentor
        </a>
      </p>

      <p>
        Coded by: &nbsp;
        <a
          href="https://github.com/Mustafa-Alie"
          target="_blank"
          className={`pb-4 text-lg font-semibold ${theme === "light" ? "text-cyan-700" : "text-cyan-500"}`}
        >
          Mustafa Ali
        </a>
      </p>
    </footer>
  );
}
