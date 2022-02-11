import { Strategy, VerifyCallback } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { KAKAO_CALLBACK, KAKAO_CLIENT_ID } from 'src/common/config';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateSNSInfoDto } from 'src/user/dto/create-sns-info.dto';

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

    const findUser = await this._userService.findOneSNSInfo(id, 'kakao');

    if (findUser.success && findUser.response == null) {
      const newUser: CreateUserDto = {
        email: email,
        nickname: nickname,
        careerYear: null,
      };
      const newSNSInfo: CreateSNSInfoDto = {
        snsId: id,
        snsType: 'kakao',
        snsName: nickname,
      };
      const result = await this._userService.create(newUser, newSNSInfo);

      if (!result.success) {
        done(null, false, {
          message: result.message,
          error: result.error,
        });
      }
    }

    const user = {
      accessToken,
      refreshToken,
      nickname,
      email,
    };

    done(null, user);
  }
}
