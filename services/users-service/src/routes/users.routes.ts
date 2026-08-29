import { Router } from "express";

import type { UsersController } from "../controllers/users.controller.js";
import { validateCreateUser } from "../middlewares/validateCreateUser.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export function createUsersRoutes(usersController: UsersController) {
  const router = Router();

  router.post(
    "/users",
    validateCreateUser,
    asyncHandler(usersController.createNewUser.bind(usersController)),
  );
  router.get(
    "/users",
    asyncHandler(usersController.getAllUsers.bind(usersController)),
  );
  router.get(
    "/users/:id",
    asyncHandler(usersController.getUser.bind(usersController)),
  );

  return router;
}
