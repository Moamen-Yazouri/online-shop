import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
  mixin,
} from '@nestjs/common';

import type {Request} from 'express';

type FolderArg = string;

export function FolderInterceptor(folder: FolderArg): Type<NestInterceptor> {
  @Injectable()
  class FolderInterceptor implements NestInterceptor {
    intercept(ctx: ExecutionContext, next: CallHandler) {
      const req = ctx.switchToHttp().getRequest<Request>();
      
      req.folder = folder;
      return next.handle();
    }
  }
  return mixin(FolderInterceptor);
}
