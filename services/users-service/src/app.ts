import express from "express";

import { UsersController } from "./controllers/users.controller.js";
import pool from "./infrastructure/database/postgres.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { PostgresUserRepository } from "./repositories/PostgresUserRepository.js";
import type { UserRepository } from "./repositories/UserRepository.js";
import healthRoutes from "./routes/health.routes.js";
import { createUsersRoutes } from "./routes/users.routes.js";
import { UsersService } from "./services/users.service.js";

const app = express();

app.use(express.json());

app.use(healthRoutes);

const userRepository: UserRepository = new PostgresUserRepository(pool);
const usersService = new UsersService(userRepository);
const usersController = new UsersController(usersService);
app.use(createUsersRoutes(usersController));

app.use(errorHandler);

export default app;
