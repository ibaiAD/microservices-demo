import type { NextFunction, Request, Response } from "express";
import { UserIdSchema } from "../types/user.js";

export function validateUserId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = UserIdSchema.safeParse(req.params.id);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user id",
      details: result.error.issues,
    });
  }

  next();
}
