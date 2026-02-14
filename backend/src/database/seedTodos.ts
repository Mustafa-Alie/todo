import prisma from "./prisma/prismaClient";

export async function createDefaultTodos(userId: string) {
  return prisma.todo.createMany({
    data: [
      { content: "Read War and Peace novel", userId },
      { content: "Buy groceries list from the supermarket", userId },
      { content: "Go to the gym after work", userId },
    ],
  });
}
