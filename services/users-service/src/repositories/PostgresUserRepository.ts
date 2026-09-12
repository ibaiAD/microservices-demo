import type { Pool } from "pg";
import type { User } from "../types/user.js";
import type { UserRepository } from "./UserRepository.js";

export class PostgresUserRepository implements UserRepository {
  constructor(private pool: Pool) {}

  async save(user: User): Promise<User> {
    const result = await this.pool.query<User>(
      `
        INSERT INTO users (id, name, email)
        VALUES ($1, $2, $3)
        RETURNING id, name, email
      `,
      [user.id, user.name, user.email],
    );

    const savedUser = result.rows[0];

    if (!savedUser) {
      throw new Error("User was inserted but could not be retrieved");
    }

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    const result = await this.pool.query<User>(
      `
        SELECT id, name, email
        FROM users
      `,
    );

    return result.rows;
  }

  async findById(id: string): Promise<User | undefined> {
    const result = await this.pool.query<User>(
      `
        SELECT id, name, email
        FROM users
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0];
  }
}
