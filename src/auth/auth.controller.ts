import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { NaverAuthGuard } from './guards/naver-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  async kakaoCallback(@Req() req): Promise<any> {
    this.authService.setAccessToken(req.user.accessToken);
    return req.user;
  }

  @Get('kakao/logout')
  async logout(): Promise<any> {
    return await this.authService.kakaoLogout();
  }

  @Get('kakao/unlink')
  async unlink(): Promise<any> {
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
  async naverCallback(@Req() req): Promise<any> {
    this.authService.setAccessToken(req.user.accessToken);
    return req.user;
  }

  @Get('naver/logout')
  async naverLogout(): Promise<any> {
    return await this.authService.naverLogout();
  }

  /**
   * google strategy
   */
}
