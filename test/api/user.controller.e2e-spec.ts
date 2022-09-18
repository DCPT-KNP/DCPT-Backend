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

      // then
      const { message, error } = await getResponseError(response);

      // expect(message).toEqual('jwt malformed');
      // expect(error).toEqual('Unauthorized');

      return response;
    });
  });

  describe('직군 등록', () => {
    const path = `${apiPath}/job`;

    it('헤더 인증 실패 (401)', async () => {
      // given

      // when
      const response = req
        .post(path)
        .set(headerKeyName, `${accessToken}_mal`)
        .expect(401);

      // then
      const { message, error } = await getResponseError(response);

      // expect(message).toEqual('Authorization 헤더가 정의되어 있지 않습니다.');
      // expect(error).toEqual('Bad Request');

      return response;
    });

    it('헤더가 없음 (400)', async () => {
      // given

      // when
      const response = req
        .post(path)
        .expect(400);

      // then
      const { message, error } = await getResponseError(response);

      expect(message).toEqual('Authorization 헤더가 정의되어 있지 않습니다.');
      expect(error).toEqual('Bad Request');

      return response;
    });

    it('body 에러 (400)', async () => {
      // given
      const body = {
        names: "error_job_list"
      };

      // when
      const response = req
        .post(path)
        .set(headerKeyName, accessToken)
        .send(body)
        .expect(400);

      // then
      const { message, error } = await getResponseError(response);

      console.log("body error -", message, error);

      expect(message).toEqual('names가 배열이 아닙니다.');
      expect(error).toEqual('Bad Request');

      return response;
    });

    it('직군 등록 성공 (201)', async () => {
      // given
      const body = {
        names: ['job1', 'job2', 'job3']
      };

      // when
      const response = req
        .post(path)
        .set(headerKeyName, accessToken)
        .send(body)
        .expect(201);

      // then
      const result = await getResponseData(response);

      return response;
    });
  });

  describe('직군 수정', () => {
    const path = `${apiPath}/job`;

    it.todo('직군 수정 api test 작성');
  });

  describe('연차 등록', () => {
    const path = `${apiPath}/career-year`;

    it.todo('연차 등록 api test 작성');
  });

  describe('연차 수정', () => {
    const path = `${apiPath}/career-year`;

    it.todo('연차 수정 api test 작성');
  });
});
