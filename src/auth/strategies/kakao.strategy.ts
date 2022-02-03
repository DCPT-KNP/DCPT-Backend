import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { KAKAO_CALLBACK, KAKAO_CLIENT_ID } from 'src/common/config';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    // private readonly authService
    super({
      clientID: KAKAO_CLIENT_ID,
      callbackURL: KAKAO_CALLBACK,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const info = profile._json.kakao_account;

    const { nickname } = info.profile;
    const { email } = info;

    return {
      accessToken,
      refreshToken,
      nickname,
      email,
    };

    // const user_profile = {
    //   user_email:  profile._json.kakao_acount.email,
    //   user_nick: profile._json.properties.nickname,
    //   provider: profile.provider
    // };

    // const user = await this.

    // return user_profile;
  }
}
