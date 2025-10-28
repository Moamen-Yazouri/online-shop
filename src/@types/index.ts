import { User } from "generated/prisma";

export interface EnvVars {
    JWT_SECRET: string
}

export interface IJWTPayload {
    sub:User['id'],
    role:User['role'],
    email:User['email'],
    name:User['name'],

}