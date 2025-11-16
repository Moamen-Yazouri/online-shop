import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { ZodType } from "zod";

export class ZodValidationPipe<T> implements PipeTransform {
    constructor(private schema: ZodType<T>) {} 

    transform(value: T, metadata: ArgumentMetadata) {
            console.log(metadata);
            const parsedValue = this.schema.parse(value);
            return parsedValue;
    }
}