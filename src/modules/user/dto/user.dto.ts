import { User } from "generated/prisma";

export type UpdateUserDTO = Partial<Pick<User, 'email' | 'password' | 'name'>>;

export type UserResponseDTO = Omit<User, 'password'>;