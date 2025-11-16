import { ApiErrorResponse } from "src/@types";

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