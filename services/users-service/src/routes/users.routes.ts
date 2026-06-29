import { Router } from "express";
import { createNewUser, getAllUsers, getUser } from "../controllers/users.controller.js";
import { validateCreateUser } from "../middlewares/validateCreateUser.js";

const router = Router()

router.post('/users', validateCreateUser, createNewUser)
router.get('/users', getAllUsers)
router.get('/users/:id', getUser)

export default router