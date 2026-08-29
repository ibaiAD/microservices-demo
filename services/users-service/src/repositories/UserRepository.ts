import type { User } from "../types/user.js";

export interface UserRepository {
  save(user: User): User;
  findAll(): User[];
  findById(id: string): User | undefined;
}
