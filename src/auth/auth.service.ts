import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import {
  AES_KEY,
  JWT_SECRET,
  KAKAO_API_HOST,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_HOST,
} from 'src/common/config';
import { Result } from 'src/common/result.interface';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateToken(token: string) {
    return await this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });
  }

  async createAccessToken(email, nickname) {
    const payload = {
      type: 'accessToken',
      email: email,
      nickname: nickname,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: '1h',
    });
    return accessToken;
  }

  async createRefreshToken(email, nickname) {
    const payload = {
      type: 'refreshToken',
      email: email,
      nickname: nickname,
    };
    const token = this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: '2w',
    });

    const refreshToken = CryptoJS.AES.encrypt(
      JSON.stringify(token),
      AES_KEY,
    ).toString();

    return refreshToken;
  }

  async kakaoLogout(accessToken: string): Promise<Result> {
    const _url = KAKAO_API_HOST + '/v1/user/logout';
    const _header = {
      Authorization: `Bearer ${accessToken}`,
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

  async kakaoUnlink(accessToken: string): Promise<Result> {
    const _url = KAKAO_API_HOST + '/v1/user/unlink';
    const _header = {
      Authorization: `Bearer ${accessToken}`,
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

  async naverLogout(accessToken: string): Promise<Result> {
    const _url =
      NAVER_HOST +
      `/oauth2.0/token?` +
      `grant_type=delete&` +
      `client_id=${NAVER_CLIENT_ID}&` +
      `client_secret=${NAVER_CLIENT_SECRET}&` +
      `access_token=${accessToken}&` +
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
