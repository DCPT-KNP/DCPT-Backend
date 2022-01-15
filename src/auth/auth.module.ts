import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoStrategy } from './strategies/kakao.strategy';

@Module({
  providers: [AuthService, KakaoStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
