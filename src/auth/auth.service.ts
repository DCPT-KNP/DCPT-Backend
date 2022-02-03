import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  KAKAO_API_HOST,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_HOST,
} from 'src/common/config';
import { Result } from 'src/common/result.interface';

@Injectable()
export class AuthService {
  private accessToken = '';

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  async kakaoLogout(): Promise<Result> {
    const _url = KAKAO_API_HOST + '/v1/user/logout';
    const _header = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    try {
      const result = await axios.post(
        _url,
        { withCredentials: true },
        { headers: _header },
      );

      return {
        success: true,
        message: '카카오 로그아웃 성공',
        response: result.data,
      };
    } catch (e) {
      return {
        success: false,
        message: '카카오 로그아웃 실패',
        response: null,
        error: e,
      };
    }
  }

  async kakaoUnlink(): Promise<Result> {
    const _url = KAKAO_API_HOST + '/v1/user/unlink';
    const _header = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    try {
      const result = await axios.post(
        _url,
        { withCredentials: true },
        { headers: _header },
      );

      return {
        success: true,
        message: '카카오 연결 해제 성공',
        response: result.data,
      };
    } catch (e) {
      return {
        success: false,
        message: '카카오 연결 해제 실패',
        response: null,
        error: e,
      };
    }
  }

  async naverLogout(): Promise<Result> {
    const _url =
      NAVER_HOST +
      `/oauth2.0/token?` +
      `grant_type=delete&` +
      `client_id=${NAVER_CLIENT_ID}&` +
      `client_secret=${NAVER_CLIENT_SECRET}&` +
      `access_token=${this.accessToken}&` +
      `service_provider=NAVER`;

    try {
      const result = await axios.post(_url);

      return {
        success: true,
        message: '네이버 로그아웃 성공',
        response: result.data,
      };
    } catch (e) {
      return {
        success: false,
        message: '네이버 로그아웃 실패',
        response: null,
        error: e,
      };
    }
  }
}
