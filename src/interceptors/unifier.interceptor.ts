import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { IPaginationResult, SuccessResponse } from "src/@types";

@Injectable()
export class UnifierInterceptor<T> implements NestInterceptor<IPaginationResult<T> | T, SuccessResponse<T>> {
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
        return next.handle().pipe(
            map((data: IPaginationResult<T> | T) => {
                if (isPaginationResponse(data)) {
                    return { success: true, data: data.data, meta: data.meta };
                }
                return { success: true, data };
            }),
        );
    }
}

const isPaginationResponse = <T>(data: IPaginationResult<T> | T): data is IPaginationResult<T> => {
    return data 
        && typeof data === 'object' 
        && 'data' in data 
        && Array.isArray(data.data) 
        && 'meta' in data;
}
