import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE = 'ResponseMessage';
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);
