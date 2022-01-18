import { Strategy } from 'passport-kakao';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { KAKAO_CLIENT_ID } from 'src/common/config';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    // private readonly authService
  ) {
    super({
      clientID: KAKAO_CLIENT_ID,
      callbackURL: "/api/auth/kakao/callback"
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {

    console.log(1);

    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    console.log(done);

    return {
      accessToken,
      refreshToken,
      profile,
      done
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