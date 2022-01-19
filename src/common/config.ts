import * as dotenv from 'dotenv';

const envFound = dotenv.config({
  path: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
});

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

export const PORT = parseInt(process.env.PORT) || 5000;

export const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;

export const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
export const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
