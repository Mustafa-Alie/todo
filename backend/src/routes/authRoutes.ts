import { Router } from "express";
import { loginSchema, signupSchema } from "../validators/authValidator";
import {
  loginController,
  signoutController,
  signupController,
} from "../controllers/authControllers";
import authMiddleware from "../middlewares/authMiddleware";

import { googleController } from "../controllers/oauthControllers";
import prisma from "../database/prisma/prismaClient";

const router = Router();

router.get("/me", authMiddleware, async (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ message: "Unauthorized access for the user" });

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  return res.json({ user });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.message });
  }

  await loginController(req, res, parsed.data);
});

router.get("/signout", (req, res) => {
  signoutController(req, res);
});

router.post("/signup", (req, res) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  signupController(req, res);
});

/////////////////////////////////

//Google:
router.get("/google/start", async (req, res) => {
  //generate random state
  const state = crypto.randomUUID();

  res.cookie("oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 5 * 60 * 1000, // 5 min
  });

  // //build Google OAuth2 URL
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.BACKEND_URL}/auth/google`,
    response_type: "code",
    scope: "openid email profile",
    state,
  });

  //redirect the browser to Google
  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
});

router.get("/google", async (req, res) => {
  try {
    //validate google auth Code by comparing it to the state
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Missing authorization code" });
    }

    const cookieState = req.cookies.oauth_state;

    if (!state || !cookieState || state !== cookieState) {
      return res.status(400).json({ message: "Invalid OAuth state" });
    }

    await googleController(req, res, code as string, state as string);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
