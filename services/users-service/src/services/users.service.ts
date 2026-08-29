import { randomUUID } from "node:crypto";

import { NotFoundError } from "../errors/NotFoundError.js";
import type { UserRepository } from "../repositories/UserRepository.js";
import type { CreateUserDto, User } from "../types/user.js";

export class UsersService {
  constructor(private userRepository: UserRepository) {}

  createUser(userData: CreateUserDto): User {
    const newId = randomUUID();
    const newUser = {
      id: newId,
      ...userData,
    };

    return this.userRepository.save(newUser);
  }

  getUsers(): User[] {
    return this.userRepository.findAll();
  }

  getUserById(id: string): User {
    const user = this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
