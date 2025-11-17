import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError } from "rxjs";
import { FileService } from "src/modules/file/file.service";
import type { Request } from 'express'
@Injectable()
export class FileCleanupInterceptor implements NestInterceptor {
    constructor(private readonly fileService: FileService) {};
    intercept(cxt: ExecutionContext, next: CallHandler) {
        const req = cxt.switchToHttp().getRequest<Request>();
        const file = req.file;

        return next
            .handle()
            .pipe(
                catchError(async(err) => {
                    if(file) {
                        await this.fileService.deleteFileFromImagekit(file.fileId!);
                    }
                    else {
                        throw err;
                    }
                })
            )

    }
}