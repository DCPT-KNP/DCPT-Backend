import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getNestApp, getResponseData } from '../utils';

describe('Auth Controller Test', () => {
  const apiPath = '/auth';
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

  describe('카카오 로그인 테스트', () => {
    const path = `${apiPath}/kakao`;

    it('인가코드 인증 성공 (200)', async () => {
      // given
      const query = {
        code: process.env.KAKAO_TOKEN
      };

      // when
      const response = request(app.getHttpServer())
        .get(path)
        .query(query)
        .expect(200);

      // then
      const result = await getResponseData(response);
      console.log(result);

      expect(result).toBeInstanceOf(Object);

      return response;
    });

    it('카카오 인가코드 인증 실패 (400)', async () => {
      // Given
      const token = 'wrong token';
      const query = {
        code: token
      };

      // When
      const response = request(app.getHttpServer())
        .get(path)
        .query(query)
        .expect(400);

      // Then
      return response;
    });
  });
});
