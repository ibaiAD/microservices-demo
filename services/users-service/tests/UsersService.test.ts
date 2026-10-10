import { describe, expect, it, vi } from "vitest";

import { NotFoundError } from "../src/errors/NotFoundError.js";
import type { UserRepository } from "../src/repositories/UserRepository.js";
import { UsersService } from "../src/services/users.service.js";
import type { User } from "../src/types/user.js";

describe("UsersService", () => {
  it("throws NotFoundError when the user does not exist", async () => {
    const userRepository: UserRepository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValue(undefined),
    };

    const userService = new UsersService(userRepository);

    await expect(userService.getUserById("non-existent-id")).rejects.toThrow(
      NotFoundError,
    );
  });

  it("returns the user when the user exists", async () => {
    const user: User = {
      id: "user-123",
      name: "Test Tester",
      email: "tester@test.com",
    };

    const userRepository: UserRepository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValue(user),
    };

    const userService = new UsersService(userRepository);

    await expect(userService.getUserById("user-123")).resolves.toEqual(user);
  });
});
