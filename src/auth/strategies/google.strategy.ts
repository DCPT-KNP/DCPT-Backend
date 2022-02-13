import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import {
  GOOGLE_CALLBACK,
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
} from 'src/common/config';
import { checkUser } from 'src/common/utils';
import { UserService } from 'src/user/user.service';

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

    checkUser(id, email, name, 'google', this._userService, done);

    const user = {
      email,
      nickname: name,
    };

    done(null, user);
  }
}
