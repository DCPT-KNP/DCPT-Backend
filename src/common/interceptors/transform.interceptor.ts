import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator';

export interface Result<T> {
  success: boolean;
  message: string;
  response: T;
  error?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Result<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Result<T>> {
    const responseMessage =
      this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) ?? '';

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: responseMessage,
        response: data,
      })),
    );
  }
}
