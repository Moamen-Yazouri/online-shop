import { User } from "generated/prisma";
import { UserResponse } from "src/modules/auth/dto/auth.dto";

export interface EnvVars {
    JWT_SECRET: string
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
}

export interface IPaginationResult<T> {
    data: T[];
    meta: IMetaPagination;
}