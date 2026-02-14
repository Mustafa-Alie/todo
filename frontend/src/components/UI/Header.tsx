import { ThemeContext } from "@/context/ThemeContext";
import { use } from "react";

import moonIcon from "@/assets/images/icon-moon.svg";
import sunIcon from "@/assets/images/icon-sun.svg";

export default function Header() {
  const { theme, setTheme } = use(ThemeContext);

  return (
    <div className="mb-10 flex justify-between">
      <h1 className="text-4xl font-bold tracking-[10px] text-white uppercase">
        todo
      </h1>

      <button
        type="button"
        className="cursor-pointer"
        onClick={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
      >
        <img
          alt="theme icon"
          className=""
          src={theme === "light" ? moonIcon : sunIcon}
        />
      </button>
    </div>
  );
}
