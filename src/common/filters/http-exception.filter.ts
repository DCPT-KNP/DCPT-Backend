import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const msg = exception.message;
    const exResponse = exception.getResponse();

    const exError = exResponse['message'];

    if (Array.isArray(exError)) {
      response.status(status).json({
        success: false,
        message: msg,
        response: null,
        error: {
          message: exResponse['message'],
          error: exResponse['error'],
        },
      });
    } else {
      response.status(status).json({
        success: false,
        message: msg,
        response: null,
        error: exResponse['error'],
      });
    }
  }
}
