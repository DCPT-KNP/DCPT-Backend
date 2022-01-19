import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly host: any = {
    kakao: 'https://kapi.kakao.com',
    naver: 'https://nid.naver.com',
  };
  private accessToken = '';

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  async kakaoLogout(): Promise<any> {
    const _url = this.host.kakao + '/v1/user/logout';
    const _header = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    try {
      const result = await axios.post(_url, { headers: _header });

      return {
        success: 1,
        result: result.data,
      };
    } catch (e) {
      return {
        success: 0,
        error: e,
      };
    }
  }

  async kakaoUnlink(): Promise<any> {
    const _url = this.host.kakao + '/v1/user/unlink';
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
        success: 1,
        result: result.data,
      };
    } catch (e) {
      return {
        success: 0,
        error: e,
      };
    }
  }
}
