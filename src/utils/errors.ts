export class AlexAndAsherError extends Error {
    public statusCode: number; // Explicitly define the property type

    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
  
      // To maintain proper stack trace (only in V8-based environments like Node.js)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }

      this.name = this.constructor.name;
    }
}

export class NestError extends Error {
  public statusCode: number; // Explicitly define the property type

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // To maintain proper stack trace (only in V8-based environments like Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
  }
}

export const enum SERVER_RESPONSE_CODES {
  ACCEPTED = 200,
  CREATED = 201,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500,
}