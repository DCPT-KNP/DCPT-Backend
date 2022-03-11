import { Strategy, VerifyCallback } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { KAKAO_REDIRECT_URI, KAKAO_CLIENT_ID } from '../../common/config';
import { UserService } from '../../user/user.service';
import { checkUser } from '../../common/utils';
import { SNSType } from '../../common/custom-type';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly _userService: UserService) {
    super({
      clientID: KAKAO_CLIENT_ID,
      callbackURL: KAKAO_REDIRECT_URI,
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
