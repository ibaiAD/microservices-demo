import type { Request, Response } from "express";
import { createUser, getUserById, getUsers } from "../services/users.service.js";
import type { CreateUserDto, User } from "../types/user.js";

export function createNewUser(req: Request, res: Response) {
  const userData: CreateUserDto = req.body
  const newUser = createUser(userData)

  res.status(201).json(newUser)
}

export function getAllUsers(_req: Request, res: Response) {
  const users: User[] = getUsers()
  res.json(users)
}

export function getUser(req: Request, res: Response) {
  const id = req.params.id as string

  const user = getUserById(id)
  if (!user) return res.status(404).end()

  res.json(user)
}