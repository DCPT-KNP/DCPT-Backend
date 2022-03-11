import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import {
  GOOGLE_CALLBACK,
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
} from '../../common/config';
import { SNSType } from '../../common/custom-type';
import { checkUser } from '../../common/utils';
import { UserService } from '../../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly _userService: UserService) {
    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: GOOGLE_CALLBACK,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id } = profile;
    const { email, name } = profile._json;

    checkUser(id, email, name, SNSType.GOOGLE, this._userService, done);

    const user = {
      id,
      email,
      nickname: name,
    };

    done(null, user);
  }
}
