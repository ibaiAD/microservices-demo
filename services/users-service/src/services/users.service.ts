import { randomUUID } from "node:crypto";

import { NotFoundError } from "../errors/NotFoundError.js";
import type { UserRepository } from "../repositories/UserRepository.js";
import type { CreateUserDto, User } from "../types/user.js";

export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const newId = randomUUID();
    const newUser = {
      id: newId,
      ...userData,
    };

    return this.userRepository.save(newUser);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
