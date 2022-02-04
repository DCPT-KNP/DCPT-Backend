import { Strategy, VerifyCallback } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { KAKAO_CALLBACK, KAKAO_CLIENT_ID } from 'src/common/config';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: KAKAO_CLIENT_ID,
      callbackURL: KAKAO_CALLBACK,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const info = profile._json.kakao_account;

    const { nickname } = info.profile;
    const { email } = info;

    const user = {
      accessToken,
      refreshToken,
      nickname,
      email,
    };

    done(null, user);
  }
}
