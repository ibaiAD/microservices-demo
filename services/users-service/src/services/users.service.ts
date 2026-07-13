import { randomUUID } from "node:crypto";

import { NotFoundError } from "../errors/NotFoundError.js";
import type { CreateUserDto, User } from "../types/user.js";

const users: User[] = [];

export function createUser(userData: CreateUserDto): User {
  const newId = randomUUID();
  const newUser = {
    id: newId,
    ...userData,
  };

  users.push(newUser);
  return newUser;
}

export function getUsers(): User[] {
  return users;
}

export function getUserById(id: string): User {
  const user = users.find((user) => user.id === id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}
