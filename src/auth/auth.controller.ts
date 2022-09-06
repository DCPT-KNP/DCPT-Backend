import { Controller, Get, HttpException, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SNSType } from '../common/custom-type';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  /**
   * kakao strategy
   */
  @Get('kakao')
  async kakaoLogin(
    @Query('code') code,
    @Res({ passthrough: true }) res: Response,
  ) {
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

    return {
      success: true,
      message: '카카오 로그인 성공',
      response: {
        accessToken,
      },
    };
  }

  /**
   * naver strategy
   */

  @Get('naver')
  async naverLogin(
    @Query('code') code,
    @Res({ passthrough: true }) res: Response,
  ) {
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

    return {
      success: true,
      message: '네이버 로그인 성공',
      response: {
        accessToken,
      },
    };
  }

  /**
   * google strategy
   */

  @Get('google')
  async googleLogin(
    @Query('code') code,
    @Res({ passthrough: true }) res: Response,
  ) {
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

    return {
      success: true,
      message: '구글 로그인 성공',
      response: {
        accessToken,
      },
    };
  }
}
