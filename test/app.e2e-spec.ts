import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { expect } from 'chai';
import { AUTHORIZATION_CODE } from '../src/common/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken = "";

  jest.setTimeout(60000);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  describe('my test', () => {
    it('test', () => {
      return request(app.getHttpServer()).get('/').expect(404);
    });
  });

  describe('auth', () => {
    it('카카오 로그인 (잘못된 인가 코드)', () => {
      return request(app.getHttpServer())
        .get('/auth/kakao')
        .query({
          code: 'wrong code',
        })
        .expect(401);
    });

    it('카카오 로그인 (옳은 인가 코드)', () => {
      return request(app.getHttpServer())
        .get('/auth/kakao')
        .query({
          code: AUTHORIZATION_CODE,
        })
        .expect(200)
        .then(res => {
          const { body } = res;
          
          console.log(body);

          expect(body.success).to.equal(true);
          expect(body.response).to.haveOwnProperty("accessToken");

          accessToken = body.response.accessToken;
        });
    });
  });

  describe('user', () => {
    it('get all user info', () => {
      return request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(res => {
          const { body } = res;

          console.log(body);
        })
    });
  });
});
