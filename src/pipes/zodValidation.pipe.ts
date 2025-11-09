import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodType } from "zod";

export class ZodValidationPipe<T> implements PipeTransform {
    constructor(private schema: ZodType<T>) {} 

    transform(value: T, metadata: ArgumentMetadata) {
        try {
            console.log(metadata);
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        }
        catch {
            throw new BadRequestException("Validation Failed!")
        }
    }
}