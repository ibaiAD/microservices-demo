import type { NextFunction, Request, Response } from "express";
import {
  createUser,
  getUserById,
  getUsers,
} from "../services/users.service.js";
import type { CreateUserDto, User } from "../types/user.js";

export async function createNewUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userData: CreateUserDto = req.body;
  const newUser = createUser(userData);

  res.status(201).json(newUser);
}

export async function getAllUsers(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const users: User[] = getUsers();
  res.json(users);
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id as string;

  const user = getUserById(id);

  res.json(user);
}
