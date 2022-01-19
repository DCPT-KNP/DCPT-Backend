import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';

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
  async callback(@Req() req): Promise<any> {
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

  /**
   * google strategy
   */
}
