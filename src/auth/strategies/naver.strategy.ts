import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import {
  NAVER_CALLBACK,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
} from 'src/common/config';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: NAVER_CLIENT_ID,
      clientSecret: NAVER_CLIENT_SECRET,
      callbackURL: NAVER_CALLBACK,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { email, id } = profile._json;

    // TODO: 필수 제공 항목엔 이름이 포함되어 있는데 왜 닉네임만 실려오지?

    return {
      accessToken,
      refreshToken,
      email,
      id
    };
  }
}
