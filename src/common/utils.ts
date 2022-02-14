import { CreateSNSInfoDto } from 'src/user/dto/create-sns-info.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { VerifyCallback } from 'passport-kakao';
import { SNSType } from './custom-type';

export const checkUser = async (
  id: string,
  email: string,
  nickname: string,
  type: SNSType,
  _userService: UserService,
  done: VerifyCallback,
) => {
  const findUser = await _userService.findOneSNSInfo(id, type);

  if (findUser.success && findUser.response == null) {
    const newUser: CreateUserDto = {
      email: email,
      nickname: nickname,
      careerYear: null,
    };
    const newSNSInfo: CreateSNSInfoDto = {
      snsId: id,
      snsType: type,
      snsName: nickname,
    };
    const result = await _userService.create(newUser, newSNSInfo);

    if (!result.success) {
      done(null, false, {
        message: result.message,
        error: result.error,
      });
    }
  }
};
