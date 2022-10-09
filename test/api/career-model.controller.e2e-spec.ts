import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getNestApp, getResponseData } from '../utils';

describe('Career Model Controller Test', () => {
  const apiPath = '/career-model';
  let app: INestApplication;

  beforeEach(async () => {
    app = await getNestApp();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  describe('커리어 모델 목록 조회 (no login)', () => {
    const path = `${apiPath}/skill`;

    it('목록 조회 성공 (200)', async () => {
      // given

      // when
      const response = request(app.getHttpServer()).get(path).expect(200);

      // then
      const result = await getResponseData(response);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(7);

      return result;
    });
  });
});
