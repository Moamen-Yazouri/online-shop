import type { User } from 'generated/prisma/client';

export type RegisterDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>;

export type LoginDTO = Pick<User, 'email' | 'password'>;
export type UserResponse = {
  token: string;
  user: Omit<User, 'password' | 'id'> & {
    id: string;
  };
};
