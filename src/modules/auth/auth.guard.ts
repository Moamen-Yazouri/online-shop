import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from 'src/@types';
import { DatabaseService } from '../database/database.service';
import { removeFields } from 'src/utils/object.utils';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
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
          id: payload.sub,
        },
      });

      request.user = removeFields(user, ['password']);

      return true;

    } catch  {

      throw new ForbiddenException('You do not have permission to access this resource');
      
    }
    
  }
}
