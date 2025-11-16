import { HttpStatus } from "@nestjs/common";
import { Prisma, User } from "generated/prisma";
import { UserResponse } from "src/modules/auth/dto/auth.dto";

export interface EnvVars {
    JWT_SECRET: string
    IMAGEKIT_PRIVATE_KEY: string
}

export interface IJWTPayload {
    sub:UserResponse['user']['id'],
    role:User['role'],
    email:User['email'],
    name:User['name'],
}

export interface IPaginationQuery {
    page: number;
    limit: number;
}
export interface IMetaPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number,
}

export interface IPaginationResult<T> {
    data: T[];
    meta: IMetaPagination;
}

export type PrismaClientTX = Prisma.TransactionClient;
export type SuccessResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: true;
      data: T[];
      meta: IMetaPagination; 
    };


export type ApiErrorResponse = {
  success: false;
  message: string;
  timestamp: string;
  statusCode: HttpStatus;
  path: string;
  fields?: { field: string; message: string }[];
};



