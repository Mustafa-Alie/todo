import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

// Extend Express Request to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    //read the jwt token
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    //verify the jwt token
    const decoded = jwt.verify(token, secret) as JwtPayload;

    //attach user info to the request
    req.user = { userId: decoded.userId };

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}
