import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  jest.useRealTimers();

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

  describe('test test', () => {
    it('test', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(404);
    });
  })

  // describe('auth', () => {
  //   it('구글 로그인', () => {
  //     return request(app.getHttpServer())
  //       .get('/auth/google')
  //       .query({ code: '4%2F0AX4XfWgX9vAYvv3gJrWCE7sDlzAqE8kXb9EYD3fcmj2xcuhxwP4h7BITamohjwn3n_CuxQ' })
  //       .expect(400);
  //   });
  // });

  // describe('user', () => {
  //   it('모든 유저 정보 가져옴', () => {
  //     return request(app.getHttpServer())
  //       .get('/user')
  //       .set('Authorization', `Bearer ${}`)
  //       .expect(200);
  //   })
  // })
});
