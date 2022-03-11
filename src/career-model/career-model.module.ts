import { Module } from '@nestjs/common';
import { CareerModelService } from './career-model.service';
import { CareerModelController } from './career-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerModel } from '../entities/career-model.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([CareerModel, User]),
  ],
  providers: [CareerModelService],
  controllers: [CareerModelController],
})
export class CareerModelModule {}
