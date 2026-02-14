import { createContext, useState, type ReactNode } from "react";
import type { ThemeContextType, ThemeType } from "@/types/types";

const systemTheme: ThemeType = window.matchMedia(
  "(prefers-color-scheme: light)",
).matches
  ? "light"
  : "dark";

export const ThemeContext = createContext<ThemeContextType>({
  theme: systemTheme,
  setTheme: () => {},
});

// Context Provider Component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>(systemTheme);

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}
