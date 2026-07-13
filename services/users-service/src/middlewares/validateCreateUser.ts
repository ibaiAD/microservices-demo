import type { NextFunction, Request, Response } from "express";
import type { CreateUserDto } from "../types/user.js";

export function validateCreateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user: CreateUserDto = req.body;
  if (!user.name || !user.email) {
    return res.status(400).json({
      error: "name and email are required",
    });
  }

  next();
}
