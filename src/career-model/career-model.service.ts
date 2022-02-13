import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from 'src/common/result.interface';
import { CareerModel } from 'src/entities/career-model.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Connection, Repository } from 'typeorm';
import { CreateCareerModelDto } from './dto/create-career-model.dto';

@Injectable()
export class CareerModelService {
  constructor(
    private connection: Connection,
    private readonly _userService: UserService,
    @InjectRepository(CareerModel)
    private readonly _careerModelRepository: Repository<CareerModel>,
  ) {}

  async create(
    nickname: string,
    email: string,
    data: CreateCareerModelDto,
  ): Promise<Result> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const findUser = await this._userService.findOneUserByNameAndEmail(
        nickname,
        email,
      );
      const user: User = findUser.response;

      const newCareerModel = CareerModel.fromJson({ ...data, user });
      await queryRunner.manager.save(CareerModel, newCareerModel);

      user.addCareerModel(newCareerModel.id);
      await queryRunner.manager.save(User, user);

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: '커리어 모델 생성 성공',
        response: {
          user,
          newCareerModel,
        },
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return {
        success: false,
        message: '커리어 모델 생성 실패',
        response: null,
        error: e,
      };
    } finally {
      await queryRunner.release();
    }
  }
}
