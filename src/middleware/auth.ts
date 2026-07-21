import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../lib/firebase-admin.ts";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing or invalid token format" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
    };

    next();
  } catch (error) {
    console.error("Authentication verification error:", error);
    res.status(401).json({ error: "Unauthorized: Token verification failed" });
  }
}
