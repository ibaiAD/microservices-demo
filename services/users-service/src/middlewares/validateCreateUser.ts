import type { NextFunction, Request, Response } from "express";
import { CreateUserSchema } from "../types/user.js";

export function validateCreateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid request body",
      details: result.error.issues,
    });
  }

  next();
}
