import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AES_KEY,
  GOOGLE_CALLBACK,
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
  JWT_SECRET,
  KAKAO_API_HOST,
  KAKAO_CLIENT_ID,
  KAKAO_REDIRECT_URI,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_HOST,
} from '../common/config';
import { Result } from '../common/result.interface';
import * as CryptoJS from 'crypto-js';
import Axios from 'axios';
import qs from 'qs';
import { checkUser } from '../common/utils';
import { SNSType } from '../common/custom-type';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly _userservice: UserService,
  ) {}

  async validateToken(token: string) {
    return await this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });
  }

  async createAccessToken(email, nickname, snsId, snsType) {
    const payload = {
      type: 'accessToken',
      sns_id: snsId,
      sns_type: snsType,
      email: email,
      nickname: nickname,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: '3h',
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

  async getKakaoToken(code) {
    const param = {
      grant_type: 'authorization_code',
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT_URI,
      code: code,
    };

    try {
      const result = await Axios.post(
        'https://kauth.kakao.com/oauth/token',
        qs.stringify(param),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return result.data;
    } catch (e) {
      console.log(e.response.data, e.response.status);
      throw new HttpException(e.response.data, e.response.status);
    }
  }

  async getKakaoUserInfo(accessToken) {
    try {
      const {
        data: {
          id,
          kakao_account: {
            profile: { nickname },
            email,
          },
        },
      } = await Axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await checkUser(
        id,
        email,
        nickname,
        SNSType.KAKAO,
        this._userservice,
      );

      if (!result.success) {
        throw new HttpException(result, 500);
      }

      return {
        id,
        nickname,
        email,
      };
    } catch (e) {
      console.log(e.response.data, e.response.status);
      throw new HttpException(e.response.data, e.response.status);
    }
  }

  async getNaverToken(code) {
    const param = {
      grant_type: 'authorization_code',
      client_id: NAVER_CLIENT_ID,
      client_secret: NAVER_CLIENT_SECRET,
      state: 'state',
      code,
    };

    try {
      const result = await Axios.post(
        'https://nid.naver.com/oauth2.0/token',
        qs.stringify(param),
      );

      return result.data;
    } catch (e) {
      console.log(e.response.data, e.response.status);
      throw new HttpException(e, 500);
    }
  }

  async getNaverUserInfo(accessToken) {
    try {
      const userInfo = await Axios.get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });

      if (userInfo.data.resultcode !== '00') {
        throw new HttpException(userInfo.data, userInfo.status);
      }

      const {
        response: { id, email, name },
      } = userInfo.data;

      const result = await checkUser(
        id,
        email,
        name,
        SNSType.NAVER,
        this._userservice,
      );

      if (!result.success) {
        throw new HttpException(result, 500);
      }

      return {
        id,
        nickname: name,
        email,
      };
    } catch (e) {
      console.log(e.response.data, e.response.status);
      throw new HttpException(e.response.data, e.response.status);
    }
  }

  async getGoogleToken(code) {
    const param = {
      code: code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_SECRET,
      redirect_uri: GOOGLE_CALLBACK,
      grant_type: 'authorization_code',
    };

    try {
      const result = await Axios.post(
        `https://oauth2.googleapis.com/token?` + qs.stringify(param),
      );

      return result.data;
    } catch (e) {
      console.log("getGoogleToken", e.response.data, e.response.status);
      throw new HttpException(e.response.data, e.response.status);
    }
  }

  async getGoogleUserInfo(accessToken) {
    try {
      const userInfo = await Axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (userInfo.status === 401) {
        throw new UnauthorizedException(userInfo.data);
      }

      const { id, email, name } = userInfo.data;

      const result = await checkUser(
        id,
        email,
        name,
        SNSType.GOOGLE,
        this._userservice,
      );

      if (!result.success) {
        throw new HttpException(result, 500);
      }

      return {
        id,
        nickname: name,
        email,
      };
    } catch (e) {
      console.log('getGoogleUserInfo', e.response.data, e.response.status);
      throw new HttpException(e.response.data, e.response.status);
    }
  }

  async kakaoLogout(accessToken: string): Promise<Result> {
    const _url = KAKAO_API_HOST + '/v1/user/logout';
    const _header = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const result = await Axios.post(
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
      const result = await Axios.post(
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
      const result = await Axios.post(_url);

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
