import type { User } from "../types/user.js";
import type { UserRepository } from "./UserRepository.js";

export class InMemoryUserRepository implements UserRepository {
  constructor(private users: User[] = []) {}

  save(user: User): User {
    this.users.push(user);
    return user;
  }
  findAll(): User[] {
    return [...this.users];
  }
  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
