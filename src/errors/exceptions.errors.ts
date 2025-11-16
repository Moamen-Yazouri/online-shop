import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { Response, Request } from "express";
import { buildApiErrorResponse } from "./utils/responseBuilder.util";
import { Prisma } from "generated/prisma";
@Catch(HttpException) 
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const errorResponse = buildApiErrorResponse(
            {
                statusCode: status,
                path: request.url,
                message: exception.message || 'Something went wrong!',
            }
        )
        response.status(status).json(errorResponse);
    }
}

@Catch(
    Prisma.PrismaClientKnownRequestError,
    Prisma.PrismaClientValidationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        const message = 'Something went wrong!';

        const defaultError = buildApiErrorResponse(
            {
                statusCode: status,
                path: request.url,
                message,
            }
        )

        if (exception instanceof Prisma.PrismaClientValidationError) {
            defaultError.statusCode = HttpStatus.BAD_REQUEST;
            defaultError.message = exception.message;
        } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            switch(exception.code) {
                case 'P2002': {
                    defaultError.statusCode = HttpStatus.CONFLICT;
                    if(exception.meta && typeof exception.meta.target === 'string') {
                        defaultError.message = `Unique constraint failed on this field: ${exception.meta.target}`;
                        defaultError.fields = [
                            {
                                field: exception.meta.target,
                                message: exception.message,
                            }
                        ]
                        break;
                    }
                    defaultError.message = exception.message;
                    break;
                }

                case 'P2025': {
                    defaultError.statusCode = HttpStatus.NOT_FOUND;
                    defaultError.message = 'Record not found';
                    break;
                }
                 case 'P2003': {                        
                        defaultError.statusCode = HttpStatus.CONFLICT;
                        defaultError.message = 'Invalid relation reference';
                        break;
                }
                case 'P2000': {

                    defaultError.statusCode = HttpStatus.BAD_REQUEST;
                    defaultError.message = 'Value too long for column';
                    break;
                }
                case 'P2014': {

                    defaultError.statusCode = HttpStatus.CONFLICT;
                    defaultError.message = 'Relation constraint failed';
                    break;

                }
                case 'P2024': {

                    defaultError.statusCode = HttpStatus.SERVICE_UNAVAILABLE;
                    defaultError.message = 'Database connection timeout';
                    break;

                }
                default: {
                    defaultError.message = exception.message;
                }
            }
        }
        return response.status(defaultError.statusCode).json(defaultError);
    }
}