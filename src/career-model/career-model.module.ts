import { Module } from '@nestjs/common';
import { CareerModelService } from './career-model.service';
import { CareerModelController } from './career-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerModel } from 'src/entities/career-model.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/entities/user.entity';

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
