import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillInfo, SkillType, SNSType } from '../common/custom-type';
import { CareerModel } from '../entities/career-model.entity';
import { OtherCategory } from '../entities/other-category.entity';
import { User } from '../entities/user.entity';
import { UserService } from '../user/user.service';
import { Connection, Repository } from 'typeorm';
import { CreateCareerModelDto } from './dto/create-career-model.dto';
import skillList from '../static/skill_category.json';
import { UpdateCareerModelDto } from './dto/update-career-model.dto';

@Injectable()
export class CareerModelService {
  constructor(
    private connection: Connection,
    private readonly _userService: UserService,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(CareerModel)
    private readonly _careerModelRepository: Repository<CareerModel>,
  ) {}

  async createCareerModel(
    snsId: string,
    snsType: SNSType,
    data: CreateCareerModelDto,
  ): Promise<null> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const findUser = await this._userService.findOneUser(snsId, snsType);
      const user: User = findUser.response.user;

      // 기타 역량 생성
      if (data.otherTag !== undefined) {
        data.otherTag.forEach(async (tag) => {
          const newOtherCategory = OtherCategory.fromJson({ tag, user });
          await queryRunner.manager.save(OtherCategory, newOtherCategory);
        });
      }

      // career model 생성
      delete data.otherTag;

      const newCareerModel = CareerModel.fromJson({ ...data, user });
      await queryRunner.manager.save(CareerModel, newCareerModel);

      // user와 mapping
      user.addCareerModel(newCareerModel.id);
      await queryRunner.manager.save(User, user);

      await queryRunner.commitTransaction();

      return null;
    } catch (e) {
      await queryRunner.rollbackTransaction();

      switch (e.code) {
        case 'ER_WARN_DATA_TRUNCATED':
          throw new BadRequestException(
            '유효하지 않은 shape model이거나 skill type',
          );
        default:
          throw new BadRequestException(e);
      }
    } finally {
      await queryRunner.release();
    }
  }

  async getCareerModel(user: User): Promise<User> {
    try {
      const result = await this._userRepository.findOne({
        select: ['id', 'email', 'nickname', 'careerModel', 'otherCategories'],
        where: {
          id: user.id,
        },
        relations: ['careerModel', 'otherCategories'],
      });

      return result;
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  async modifyRoadmapTitle(data: UpdateCareerModelDto): Promise<CareerModel> {
    try {
      const result = await this._careerModelRepository.findOne(data.id);

      result.title = data.title;

      await this._careerModelRepository.save(result);

      return result;
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  getSkillInfo(): SkillInfo[] {
    const result: SkillInfo[] = [];

    for (const i in SkillType) {
      result.push({
        name: i,
        full_name: skillList[i].full_name,
        description: skillList[i].description,
      });
    }

    return result;
  }
}
