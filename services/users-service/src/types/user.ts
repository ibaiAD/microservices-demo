import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
});

export const UserIdSchema = z.uuid();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export interface User {
  id: string;
  name: string;
  email: string;
}
