import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RegisterDTO, UserResponse } from '../auth/dto/auth.dto';
import { extractFields, removeFields } from 'src/utils/object.utils';
import { User } from 'generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaClient: DatabaseService) {}

  create(newUser: RegisterDTO) {
    return this.prismaClient.user.create({
      data: newUser,
    });
  }

  findByEmailOrThrow(email: string) {
    return this.prismaClient.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findById(id: number) {
    return this.prismaClient.user.findUnique({
      where: {
        id,
      },
    });
  }

  prepareUserForDTO(user: User): UserResponse['user'] {
    return removeFields(user, ['password']);
  }

  prepareForToken(user: User) {
    return extractFields(user, ['id', 'role', 'email', 'name']);
  }
}
