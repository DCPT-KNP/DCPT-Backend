import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(KakaoAuthGuard)
  @Get('kakao')
  async kakaoLogin() {
    console.log(3);
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('kakao/callback')
  async callback(@Req() req): Promise<any> {
    console.log(req.user);
    return req.user;
  }
}
