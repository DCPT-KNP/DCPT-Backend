import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SNSType } from '../common/custom-type';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  /**
   * kakao strategy
   */
  @Get('kakao')
  @ResponseMessage('카카오 로그인 성공')
  async kakaoLogin(@Query('code') code) {
    if (!code) {
      throw new HttpException('code query가 없습니다.', 400);
    }

    const { access_token } = await this._authService.getKakaoToken(code);
    const { id, nickname, email } = await this._authService.getKakaoUserInfo(
      access_token,
    );

    const accessToken = await this._authService.createAccessToken(
      email,
      nickname,
      id,
      SNSType.KAKAO,
    );

    return accessToken;
  }

  /**
   * naver strategy
   */

  @Get('naver')
  @ResponseMessage('네이버 로그인 성공')
  async naverLogin(@Query('code') code) {
    if (!code) {
      throw new HttpException('code query가 없습니다.', 400);
    }

    const { access_token } = await this._authService.getNaverToken(code);
    const { id, nickname, email } = await this._authService.getNaverUserInfo(
      access_token,
    );

    const accessToken = await this._authService.createAccessToken(
      email,
      nickname,
      id,
      SNSType.NAVER,
    );

    return accessToken;
  }

  /**
   * google strategy
   */

  @Get('google')
  @ResponseMessage('구글 로그인 성공')
  async googleLogin(@Query('code') code) {
    if (!code) {
      throw new HttpException('code query가 없습니다.', 400);
    }

    const { access_token } = await this._authService.getGoogleToken(code);
    const { id, nickname, email } = await this._authService.getGoogleUserInfo(
      access_token,
    );

    const accessToken = await this._authService.createAccessToken(
      email,
      nickname,
      id,
      SNSType.GOOGLE,
    );

    return accessToken;
  }
}
