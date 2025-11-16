import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RegisterDTO, UserResponse } from '../auth/dto/auth.dto';
import { extractFields, removeFields } from 'src/utils/object.utils';
import { User } from 'generated/prisma/client';
import { IPaginationQuery, IPaginationResult } from 'src/@types';
import { UpdateUserDTO, UserResponseDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaClient: DatabaseService) {}

  create(newUser: RegisterDTO) {
    return this.prismaClient.user.create({
      data: newUser,
    });
  }

  findByEmail(email: string) {
    
    return this.prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  findAll(
    query: IPaginationQuery
  ): Promise<IPaginationResult<UserResponseDTO>> {

    const usersForRes = this.prismaClient.$transaction(async (prisma) => {
      const pagination = this.prismaClient.handlePagination(query);
      const users = (await prisma.user.findMany({
        omit: {
          password: true
        },
        ...pagination
      }));

      const total = await prisma.user.count();
      const meta = this.prismaClient.handleMetaWithPagination(query.limit, query.page, total)
      return {
        data: users,
        meta,
      }
    });

    return usersForRes;

  }

  async findById(id: bigint) {
    const foundedUser = await this.prismaClient.user.findUniqueOrThrow({
      where: {
        id,
      },
      omit: {
        password: true
      }
    });

    return foundedUser;
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

    return updatedUser;
  }

  async delete(id: bigint) {
    const deletedUser = await this.prismaClient.user.update({
      where: {
        id,
      },
      data: {
        isDeleted: true
      },
      omit: {
        password: true,
      }
    });

    return deletedUser;
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
