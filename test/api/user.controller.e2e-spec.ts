import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getNestApp, getResponseData, getResponseError } from '../utils';
import { User } from 'src/entities/user.entity';

describe('User Controller Test', () => {
  const apiPath = '/user';
  const accessToken = `Bearer ${process.env.ACCESS_TOKEN}`;
  const headerKeyName = 'Authorization';

  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

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
    
    req = request(app.getHttpServer());
  });

  describe('유저 정보 조회', () => {
    const path = `${apiPath}/me`;

    it('유저 정보 조회 성공 (200)', async () => {
      // given

      // when
      const response = req
        .get(path)
        .set(headerKeyName, accessToken)
        .expect(200);

      // then
      const result = await getResponseData(response);

      expect(result).toBeInstanceOf(Object);

      return response;
    });

    it('헤더가 없음 (400)', async () => {
      // given

      // when
      const response = req
        .get(path)
        .expect(400);

      // then
      const { message, error } = await getResponseError(response);

      expect(error).toEqual('Bad Request');
      expect(message).toEqual('Authorization 헤더가 정의되어 있지 않습니다.');

      return response;
    });

    it('토큰이 유효하지 않음 (401)', async () => {
      // given
      const wrongToken = `${accessToken}hi`;

      // when
      const response = req
        .get(path)
        .set(headerKeyName, wrongToken)
        .expect(401);

      response.then(res => console.log(res));

      // then
      return response;
    });
  });
});
