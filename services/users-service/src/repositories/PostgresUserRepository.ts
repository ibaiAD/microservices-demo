import type { Pool, QueryResult } from "pg";

import { ConflictError } from "../errors/ConflictError.js";
import type { User } from "../types/user.js";
import type { UserRepository } from "./UserRepository.js";

export class PostgresUserRepository implements UserRepository {
  constructor(private pool: Pool) {}

  async save(user: User): Promise<User> {
    let result: QueryResult<User>;

    try {
      result = await this.pool.query<User>(
        `
        INSERT INTO users (id, name, email)
        VALUES ($1, $2, $3)
        RETURNING id, name, email
      `,
        [user.id, user.name, user.email],
      );
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "23505") {
        throw new ConflictError("A unique constraint was violated");
      }

      throw error;
    }

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
