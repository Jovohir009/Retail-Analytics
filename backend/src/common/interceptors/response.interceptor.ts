import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((value) => {
        const data = value && typeof value === 'object' && 'data' in value ? value.data : value;
        const message =
          value && typeof value === 'object' && 'message' in value
            ? String(value.message)
            : 'Operation completed successfully.';
        return { success: true, message, data };
      })
    );
  }
}
