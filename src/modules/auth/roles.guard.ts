import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request} from "express";
import { Role } from "generated/prisma";
import { Roles } from "src/decorators/roles.dec";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) {}
    canActivate(context: ExecutionContext): boolean {

        const roles = this.reflector.getAllAndOverride<Role[]>(Roles, [
            context.getClass(),
            context.getHandler(),
        ]);

        if(!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();

        const user = request.user;

        if(!user) {
            return false;
        }

        if(roles.includes(user.role)) {
            return true;
        }

        throw new ForbiddenException('You do not have permission to access this resource');
    }

}