//Context Types:
export type ThemeType = "light" | "dark";

export type ThemeContextType = {
  theme: ThemeType;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
};

export type todosType = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  userId: string;
};
