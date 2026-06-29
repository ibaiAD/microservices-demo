import { randomUUID } from "node:crypto";
import type { CreateUserDto, User } from "../types/user.js";

const users: User[] = []

export function createUser(userData: CreateUserDto): User {
  const newId = randomUUID()
  const newUser = {
    id: newId,
    ...userData
  }

  users.push(newUser)
  return newUser
}

export function getUsers(): User[] {
  return users
}

export function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id)
}