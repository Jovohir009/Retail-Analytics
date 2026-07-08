import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = exception instanceof HttpException ? exception.getResponse() : null;
    const message = this.resolveMessage(body);

    if (status >= 500) {
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    }

    response.status(status).json({
      success: false,
      message,
      errors: this.resolveErrors(body)
    });
  }

  private resolveMessage(body: unknown): string {
    if (body && typeof body === 'object' && 'message' in body) {
      const message = body.message;
      return Array.isArray(message) ? 'Validation failed.' : String(message);
    }
    return 'Unexpected server error.';
  }

  private resolveErrors(body: unknown): string[] {
    if (body && typeof body === 'object' && 'message' in body && Array.isArray(body.message)) {
      return body.message.map(String);
    }
    return [];
  }
}
