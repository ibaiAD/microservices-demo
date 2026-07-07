import { Router } from "express";

import { createNewUser, getAllUsers, getUser } from "../controllers/users.controller.js";
import { validateCreateUser } from "../middlewares/validateCreateUser.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router()

router.post('/users', validateCreateUser, asyncHandler(createNewUser))
router.get('/users', asyncHandler(getAllUsers))
router.get('/users/:id', asyncHandler(getUser))

export default router