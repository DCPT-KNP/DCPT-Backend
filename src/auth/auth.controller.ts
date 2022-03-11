import { Controller, Get, Query, Res } from '@nestjs/common';
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
    const refreshToken = await this._authService.createRefreshToken(
      email,
      nickname,
    );

    res.cookie('resfreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 14,
      sameSite: 'none',
      httpOnly: true,
    });

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
    const refreshToken = await this._authService.createRefreshToken(
      email,
      nickname,
    );

    res.cookie('resfreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 14,
      sameSite: 'none',
      httpOnly: true,
    });

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
    const refreshToken = await this._authService.createRefreshToken(
      email,
      nickname,
    );

    res.cookie('resfreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 14,
      sameSite: 'none',
      httpOnly: true,
    });

    return {
      success: true,
      message: '구글 로그인 성공',
      response: {
        accessToken,
      },
    };
  }

  // @UseGuards(GoogleAuthGuard)
  // @Get('google')
  // async googleLogin() {
  //   return;
  // }

  // @UseGuards(GoogleAuthGuard)
  // @Get('google/callback')
  // async googleCallback(
  //   @Req() req,
  //   @Res({ passthrough: true }) res: Response,
  // ): Promise<any> {
  //   const { id, email, nickname } = req.user;

  //   const accessToken = await this._authService.createAccessToken(
  //     email,
  //     nickname,
  //     id,
  //     'google',
  //   );
  //   const refreshToken = await this._authService.createRefreshToken(
  //     email,
  //     nickname,
  //   );

  //   res.cookie('resfreshToken', refreshToken, {
  //     maxAge: 1000 * 60 * 60 * 24 * 14,
  //     sameSite: 'none',
  //     httpOnly: true,
  //   });

  //   return {
  //     success: true,
  //     message: '구글 로그인 성공',
  //     response: {
  //       accessToken,
  //       email,
  //       nickname,
  //     },
  //   };
  // }
}
