import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getNestApp } from '../utils';

describe('Skill Card Controller Test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await getNestApp();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    await app.init();
  });

  it('dummy', () => {
    expect(2+2).toEqual(4);
  });
});
