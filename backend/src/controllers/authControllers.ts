import type { Request, Response } from "express";
import type { loginType, singUpType } from "../validators/authValidator";
import prisma from "../database/prisma/prismaClient";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

import { sendEmail } from "../services/emailService";
import { createDefaultTodos } from "../database/seedTodos";

export async function loginController(
  req: Request,
  res: Response,
  data: loginType,
) {
  try {
    //search for user in db using his email
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //compare the input password with hashed password:
    const validPass = argon2.verify(user.password, data.password);

    if (!validPass) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //Create JWT token
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7d
    });

    res.status(200).json({
      message: `Login successful for ${data.email}`,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function signoutController(req: Request, res: Response) {
  res.cookie("jwt", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ message: "Signed out successfully" });
}

export async function signupController(req: Request, res: Response) {
  try {
    const data: singUpType = req.body;

    //duplicate emails:
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    //hash the password before saving it
    const hashedPassword = await argon2.hash(data.password);

    const newUser = await prisma.user.create({
      data: {
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
        email: data.email,
        password: hashedPassword,
      },
    });

    //seed default todos
    await createDefaultTodos(newUser.id);

    if (!newUser)
      return res.status(500).json({ message: "failed to create user" });

    //Send a confirmation email using nodemailer
    const subject = "Welcome to TODO!";
    const html = `
      <h1>Hello ${data.firstName || "there"} 👋</h1>
      <p>Thanks for signing up!</p>
      <p>Enjoy using TODO!</p>
    `;

    await sendEmail(data.email, subject, html);

    //JWT
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ userId: newUser.id }, secret, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: `Signup successful`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
