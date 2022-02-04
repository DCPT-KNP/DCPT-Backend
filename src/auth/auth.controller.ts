import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import {
  KAKAO_AUTH_HOST,
  KAKAO_CLIENT_ID,
  LOGOUT_REDIRECT_URI,
} from 'src/common/config';
import { Result } from 'src/common/result.interface';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { NaverAuthGuard } from './guards/naver-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * test
   */
  @Get('/')
  foo() {
    return {
      success: true,
    };
  }

  /**
   * kakao strategy
   */
  @UseGuards(KakaoAuthGuard)
  @Get('kakao')
  async kakaoLogin() {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('kakao/callback')
  async kakaoCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Result> {
    const { accessToken, refreshToken, nickname, email } = req.user;

    this.authService.setAccessToken(accessToken);

    res.cookie('resfreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30 * 2,
      sameSite: 'none',
      httpOnly: true,
    });

    return {
      success: true,
      message: '카카오 로그인 성공',
      response: {
        accessToken,
        nickname,
        email,
      },
    };
  }

  @Get('kakao/logout')
  async logout(@Res() res): Promise<any> {
    await this.authService.kakaoLogout();

    const _url =
      KAKAO_AUTH_HOST +
      '/oauth/logout?' +
      `client_id=${KAKAO_CLIENT_ID}&` +
      `logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;

    res.redirect(_url);
  }

  @Get('kakao/unlink')
  async unlink(): Promise<Result> {
    return await this.authService.kakaoUnlink();
  }

  /**
   * naver strategy
   */

  @UseGuards(NaverAuthGuard)
  @Get('naver')
  async naverLogin() {
    return;
  }

  @UseGuards(NaverAuthGuard)
  @Get('naver/callback')
  async naverCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { accessToken, refreshToken, email, id } = req.user;

    this.authService.setAccessToken(accessToken);

    res.cookie('resfreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30 * 2,
      sameSite: 'none',
      httpOnly: true,
    });

    return {
      success: true,
      message: '네이버 로그인 성공',
      response: {
        accessToken,
        id,
        email,
      },
    };
  }

  @Get('naver/logout')
  async naverLogout(): Promise<Result> {
    return await this.authService.naverLogout();
  }

  /**
   * google strategy
   */

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleLogin() {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req): Promise<any> {
    const { accessToken, email, name } = req.user;

    this.authService.setAccessToken(accessToken);

    return {
      success: true,
      message: '구글 로그인 성공',
      response: {
        accessToken,
        name,
        email,
      },
    };
  }
}
