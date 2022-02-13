import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-naver';
import {
  NAVER_CALLBACK,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
} from 'src/common/config';
import { checkUser } from 'src/common/utils';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly _userService: UserService) {
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
    done: VerifyCallback,
  ): Promise<any> {
    const { email, nickname, id } = profile._json;

    checkUser(id, email, nickname, 'naver', this._userService, done);

    const user = {
      email,
      id,
      nickname,
    };

    done(null, user);
  }
}
