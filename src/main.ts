import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './common/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validation을 위한 decorator가 붙어있지 않은 속성들은 거름
      forbidNonWhitelisted: true, // whitelist 설정을 켜서 이상한(걸러질) 속성이 있다면 아예 요청 자체를 막음 (400 err)
      transform: true, // 요청에서 넘어온 param 자료들의 형변환을 자동으로 해줌
    }),
  );

  // custom filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // middleware
  app.use(cookieParser());

  await app.listen(PORT);

  console.log(`
    #####################################
    🛡️  Server listening on port: ${PORT} 🛡️
    #####################################
  `);
}
bootstrap();
