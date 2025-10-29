import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from 'src/@types';
import { DatabaseService } from '../database/database.service';
import { removeFields } from 'src/utils/object.utils';
import { Reflector } from '@nestjs/core';
import { IsPublic } from 'src/decorators/auth.dec';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService,
    private reflector: Reflector
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    
    const isPublic = this.reflector.get(IsPublic, context.getHandler());

    if(isPublic) {
      return true
    };
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const jwt = authHeader?.split(' ')[1];
    if (!jwt) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = this.jwtService.verify<IJWTPayload>(jwt);
      const user = await this.databaseService.user.findUniqueOrThrow({
        where: {
          id: BigInt(payload.sub),
        },
      });
      const userWithoutPass = removeFields(user, ['password']);
      request.user = {
        ...userWithoutPass,
        id: String(userWithoutPass.id),
      }

      return true;

    } catch  {

      throw new ForbiddenException('You do not have permission to access this resource');
      
    }
    
  }
}
