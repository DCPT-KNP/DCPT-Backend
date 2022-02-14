import { Strategy, VerifyCallback } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { KAKAO_CALLBACK, KAKAO_CLIENT_ID } from 'src/common/config';
import { UserService } from 'src/user/user.service';
import { checkUser } from 'src/common/utils';
import { SNSType } from 'src/common/custom-type';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly _userService: UserService) {
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

    const { id } = profile;
    const { nickname } = info.profile;
    const { email } = info;

    checkUser(id, email, nickname, SNSType.KAKAO, this._userService, done);

    const user = {
      id,
      nickname,
      email,
    };

    done(null, user);
  }
}
