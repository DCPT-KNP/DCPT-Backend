import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import {
  GOOGLE_CALLBACK,
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
} from 'src/common/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
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
    const { email, name } = profile._json;

    const user = {
      accessToken,
      email,
      name,
    };

    done(null, user);
  }
}
