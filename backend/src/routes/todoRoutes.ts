import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import prisma from "../database/prisma/prismaClient";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized user req" });
    }

    const todos = await prisma.todo.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(todos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized user req for adding content" });
    }

    const newTodo = await prisma.todo.create({
      data: { content: req.body.content, userId: req.user.userId },
    });

    return res.json(newTodo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:todoId", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { todoId: todoIdRaw } = req.params;

    if (!todoIdRaw) {
      return res.status(400).json({ message: "Todo ID is missing" });
    }

    // Convert to string if it's an array, then assert as string
    const todoId = (
      Array.isArray(todoIdRaw) ? todoIdRaw[0] : todoIdRaw
    ) as string;

    const oldStateObj = await prisma.todo.findUnique({
      where: { id: todoId },
      select: { completed: true, userId: true },
    });

    if (!oldStateObj) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (oldStateObj.userId !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newState = !oldStateObj.completed;

    await prisma.todo.update({
      where: { id: todoId },
      data: { completed: newState },
    });

    return res.status(200).json({ todoId, completed: newState });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while updating" });
  }
});

router.delete("/:todoId", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { todoId: todoIdRaw } = req.params;

    // Guard against missing ID
    if (!todoIdRaw) {
      return res.status(400).json({ message: "Todo ID is missing" });
    }

    // Ensure todoId is a string (handles string[] from req.params)
    const todoId = (
      Array.isArray(todoIdRaw) ? todoIdRaw[0] : todoIdRaw
    ) as string;

    // Check if the todo exists and belongs to the user
    const existingTodo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!existingTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (existingTodo.userId !== req.user.userId) {
      return res.status(403).json({ message: "You cannot delete this todo" });
    }

    await prisma.todo.delete({
      where: { id: todoId },
    });

    return res
      .status(200)
      .json({ message: "Todo deleted successfully", id: todoId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while deleting" });
  }
});

export default router;
