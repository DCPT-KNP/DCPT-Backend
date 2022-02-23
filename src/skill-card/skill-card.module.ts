import { Module } from '@nestjs/common';
import { SkillCardService } from './skill-card.service';
import { SkillCardController } from './skill-card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillCard } from 'src/entities/skill-card.entity';
import { User } from 'src/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, AuthModule, TypeOrmModule.forFeature([User, SkillCard])],
  providers: [SkillCardService],
  controllers: [SkillCardController],
})
export class SkillCardModule {}
