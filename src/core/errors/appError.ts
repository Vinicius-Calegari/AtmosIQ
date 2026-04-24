export type AppErrorCode =
  | 'missing_api_key'
  | 'network_error'
  | 'rate_limit'
  | 'not_found'
  | 'service_unavailable'
  | 'unauthorized'
  | 'unknown';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: AppErrorCode = 'unknown',
    public readonly status?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function toAppError(error: unknown, fallbackMessage: string): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message || fallbackMessage);
  }

  return new AppError(fallbackMessage);
}
