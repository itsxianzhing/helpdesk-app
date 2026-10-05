export class ApiError extends Error {
  statusCode: number;
  errors: string[];
  code?: string;

  constructor(message: string, statusCode: number, errors: string[] = [], code?: string) {
    super(message);

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
  }
}
