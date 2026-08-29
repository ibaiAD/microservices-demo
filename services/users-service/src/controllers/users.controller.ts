import type { Request, Response } from "express";
import type { UsersService } from "../services/users.service.js";
import type { CreateUserDto, User } from "../types/user.js";

export class UsersController {
  constructor(private usersService: UsersService) {}

  async createNewUser(req: Request, res: Response) {
    const userData: CreateUserDto = req.body;
    const newUser = this.usersService.createUser(userData);

    res.status(201).json(newUser);
  }

  async getAllUsers(_req: Request, res: Response) {
    const users: User[] = this.usersService.getUsers();

    res.json(users);
  }

  async getUser(req: Request, res: Response) {
    const id = req.params.id as string;

    const user = this.usersService.getUserById(id);

    res.json(user);
  }
}
