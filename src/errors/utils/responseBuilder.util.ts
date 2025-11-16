import { ApiErrorResponse } from "src/@types";
import { $ZodIssue } from "zod/v4/core";

export function buildApiErrorResponse(args: {
  statusCode: number;
  path: string;
  message?: string;
}): ApiErrorResponse {
  const { statusCode, path, message } = args;

  return {
    timestamp: new Date().toISOString(),
    success: false,
    statusCode,
    path,
    message: message ?? 'Something went wrong!',
  };
}

export function buildZodValidationErrorResponse(
  url: string,
  status: number,
  issues: $ZodIssue[]
): ApiErrorResponse {
  return {
    timestamp: new Date().toISOString(),
    success: false,
    statusCode: status,
    path: url,
    message: 'Validation failed',
    fields: issues.map((iss) => ({
      field: iss.path.join('.'),
      message: iss.message, 
    })),
}
  }