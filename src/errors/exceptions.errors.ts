import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { Response, Request } from "express";
import { buildApiErrorResponse, buildZodValidationErrorResponse } from "./utils/responseBuilder.util";
import { Prisma } from "generated/prisma";
import { ZodError } from "zod";
import { APIError } from "@imagekit/nodejs";

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
    Prisma.PrismaClientUnknownRequestError,
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

                    defaultError.message = exception.message;

                    if (exception.meta) {
                        if (typeof exception.meta.target === 'string') {
                            defaultError.message = `Unique constraint failed on this field: ${exception.meta.target}`;
                            defaultError.fields = [
                                {
                                    field: exception.meta.target,
                                    message: exception.message,
                                },
                            ];
                        } else if (Array.isArray(exception.meta.target)) {
                            const fields = exception.meta.target.join(', ');
                            defaultError.message = `Unique constraint failed on the fields: ${fields}`;
                            defaultError.fields = exception.meta.target.map((field) => ({
                                field: String(field),
                                message: `Unique constraint failed on: ${String(field)}`,
                            }));
                        }
                    }
                    
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

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = HttpStatus.BAD_REQUEST;
    const errorResponse = buildZodValidationErrorResponse(
        req.url,
        status,
        exception.issues,
    );

    res.status(status).json(errorResponse);
  }
}

@Catch()
export class UncaughtExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const res = ctx.getResponse<Response>();

        const req = ctx.getRequest<Request>();

        const status = HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception  instanceof Error 
            ? exception.message
            : "Internal Server Error, try again later!"
            
        const error = buildApiErrorResponse({
                statusCode: status,
                path: req.url,
                message,
        });

        res.status(status).json(error);
    }
}

@Catch(APIError)
export class ImageKitExceptionFilter implements ExceptionFilter {
    catch(exception: APIError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const res = ctx.getResponse<Response>();

        const req = ctx.getRequest<Request>();

        const status = 
                typeof exception.status === 'number' 
                && exception.status >= 400 
                && exception.status < 500 
                ? exception.status 
                : HttpStatus.BAD_GATEWAY;

        const message = "We can not handle your image right now, try again later!";
            
        const error = buildApiErrorResponse({
                statusCode: status,
                path: req.url,
                message,
        });

        res.status(status).json(error);
    }
}