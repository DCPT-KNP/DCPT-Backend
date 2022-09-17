import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';

export const getNestApp = async (): Promise<INestApplication> => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,
    ],
  }).compile();

  const app: INestApplication = module.createNestApplication();

  return app;
};

export const getResponseData = async (res): Promise<any> => {
  const { body: { response } } = await res;

  return response;
}