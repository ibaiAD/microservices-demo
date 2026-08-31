import pool from "../src/infrastructure/database/postgres.js";

try {
  const res = await pool.query("SELECT 1");
  console.log(res.rows);
} catch (error) {
  console.error(error);
} finally {
  await pool.end();
}

// node --env-file=.env --import=tsx scripts/test-postgres.ts
