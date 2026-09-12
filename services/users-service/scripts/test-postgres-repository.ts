import { randomUUID } from "node:crypto";

import pool from "../src/infrastructure/database/postgres.js";
import { PostgresUserRepository } from "../src/repositories/PostgresUserRepository.js";
import type { User } from "../src/types/user.js";

try {
  const repository = new PostgresUserRepository(pool);
  const userId = randomUUID();

  const userToInsert: User = {
    id: userId,
    name: "Tester",
    email: `tester-${userId}@test.com`,
  };

  const savedUser = await repository.save(userToInsert);
  console.log({ savedUser });

  const allUsers = await repository.findAll();
  console.log({ allUsers });

  const existingUser = await repository.findById(userToInsert.id);
  console.log({ existingUser });

  const nonExistingUser = await repository.findById(randomUUID());
  console.log({ nonExistingUser });
} catch (error) {
  console.error(error);
} finally {
  await pool.end();
}

// node --env-file=.env --import=tsx scripts/test-postgres-repository.ts

/*
  BORRAR DESPUÉS DE LAS PRUEBAS:
  docker compose exec postgres psql -U users_user -d users_db -c "DELETE FROM users WHERE email LIKE 'tester-%@test.com';"

  COMPROBAR:
  docker compose exec postgres psql -U users_user -d users_db -c "SELECT * FROM users;"
*/
