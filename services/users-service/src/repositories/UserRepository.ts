import type { User } from "../types/user.js";

export interface UserRepository {
  save(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
}
