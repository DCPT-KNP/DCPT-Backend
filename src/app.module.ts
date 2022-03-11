import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_USERNAME,
} from './common/config';
import { UserModule } from './user/user.module';
import { CareerModelModule } from './career-model/career-model.module';
import { SkillCardModule } from './skill-card/skill-card.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DB_HOST,
      port: 3306,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}', '**/src/entity/*{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    CareerModelModule,
    SkillCardModule,
    ImageModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
