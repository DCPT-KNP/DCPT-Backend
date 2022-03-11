import { Module } from '@nestjs/common';
import { SkillCardService } from './skill-card.service';
import { SkillCardController } from './skill-card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillCard } from '../entities/skill-card.entity';
import { User } from '../entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { Mission } from '../entities/mission.entity';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([User, SkillCard, Mission]),
  ],
  providers: [SkillCardService],
  controllers: [SkillCardController],
})
export class SkillCardModule {}
