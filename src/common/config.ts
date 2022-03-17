import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT) || 5000;

export const JWT_SECRET = process.env.JWT_SECRET;
export const AES_KEY = process.env.AES_KEY;

export const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
export const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
export const LOGOUT_REDIRECT_URI = process.env.LOGOUT_REDIRECT_URI;

export const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
export const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
export const NAVER_CALLBACK = process.env.NAVER_CALLBACK;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
export const GOOGLE_CALLBACK = process.env.GOOGLE_CALLBACK;

export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_S3_HOST = process.env.AWS_S3_HOST;

export const DB_HOST = process.env.DB_HOST;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE;

export const KAKAO_API_HOST = 'https://kapi.kakao.com';
export const KAKAO_AUTH_HOST = 'https://kauth.kakao.com';

export const NAVER_HOST = 'https://nid.naver.com';

export const AUTHORIZATION_CODE = process.env.AUTHORIZATION_CODE || '';