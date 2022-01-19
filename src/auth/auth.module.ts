import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { NaverStrategy } from './strategies/naver.strategy';

@Module({
  providers: [AuthService, KakaoStrategy, NaverStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
