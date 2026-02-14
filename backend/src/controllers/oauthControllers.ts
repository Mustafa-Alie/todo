import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import prisma from "../database/prisma/prismaClient";
import { sendEmail } from "../services/emailService";

import { OAuth2Client } from "google-auth-library";
import { createDefaultTodos } from "../database/seedTodos";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleController(
  req: Request,
  res: Response,
  code: string,
  state: string,
) {
  try {
    //  Exchange code for tokens
    const params = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.BACKEND_URL}/auth/google`,
      grant_type: "authorization_code",
    });

    const authTokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!authTokenRes.ok) {
      return res.status(500).json({
        message: `Failed to exchange code: ${authTokenRes.statusText}`,
      });
    }

    const authTokenData = await authTokenRes.json();

    //Verify Google id token using OAuth2Client
    const ticket = await googleClient.verifyIdToken({
      idToken: authTokenData.id_token,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res
        .status(400)
        .json({ message: "Google token verfication failed" });
    }

    const email = payload.email;
    const providerId = payload.sub;
    const name = payload.name;

    //  Parse name into firstName & lastName
    let firstName = "";
    let lastName = "";

    if (name && typeof name === "string") {
      const words = name.trim().split(" ");
      firstName = words[0] ?? "";
      lastName = words.slice(1).join(" ") ?? "";
    }

    // Check if user exists in DB
    let user = await prisma.user.findUnique({ where: { email } });

    // If user doesn't exist, create
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          provider: "GOOGLE",
          providerId: providerId ?? null,
        },
      });

      //seed default todos
      await createDefaultTodos(user.id);

      // Send welcome email
      const subject = "Welcome to TODO!";
      const html = `
        <h1>Hello ${firstName || "there"} 👋</h1>
        <p>Thanks for signing up!</p>
        <p>Enjoy using TODO!</p>
      `;
      sendEmail(email, subject, html).catch((err) =>
        console.error("Email error:", err),
      );
    }

    // Create JWT and set cookie
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const jwtToken = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });

    res.cookie("jwt", jwtToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    //  Respond
    return res.redirect(process.env.FRONTEND_URL!);
  } catch (err: any) {
    console.error("Google OAuth error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
