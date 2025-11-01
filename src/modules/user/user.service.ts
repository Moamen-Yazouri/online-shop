import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RegisterDTO, UserResponse } from '../auth/dto/auth.dto';
import { extractFields, removeFields } from 'src/utils/object.utils';
import { User } from 'generated/prisma/client';
import { IPaginationQuery, IPaginationResult } from 'src/@types';
import { serializeUser, serializeUsers } from './utils/users.serialize';
import { UpdateUserDTO } from './dto/user.dto';

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
        email: email,
      },
    });
  }

  findAll(
    query: IPaginationQuery
  ): Promise<IPaginationResult<UserResponse['user']>> {

    const usersForRes = this.prismaClient.$transaction(async (prisma) => {

      const users = (await prisma.user.findMany({
        omit: {
          password: true
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }));

      const total = await prisma.user.count();

      return {
        data: serializeUsers(users),
        meta: {
          total,
          page: query.page,
          limit: query.limit,
        }
      }
    });

    return usersForRes;

  }

  findById(id: bigint) {
    return this.prismaClient.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: bigint, data: UpdateUserDTO) {
     const updatedUser = await this.prismaClient.user.update({
      where: {
        id,
      },
      omit: {
        password: true
      },
      data,
    });

    return serializeUser(updatedUser);
  }

  async delete(id: bigint) {
    const deletedUser = await this.prismaClient.user.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
      omit: {
        password: true,
      }
    });

    return serializeUser(deletedUser);
  }
  prepareUserForDTO(user: User): Omit<UserResponse['user'], 'id' > & {
    id: string;
  } {
    const userWithoutPass = removeFields(user, ['password']);

    return {
      ...userWithoutPass,
      id: String(user.id),
    }
      
    
  }

  prepareForToken(user: User) {
    const neededFields = extractFields(user, ['id', 'role', 'email', 'name']);
    
    return {
      ...neededFields,
      id: String(neededFields.id),
    }
  }
}
