import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardStatusType, SkillType, SNSType } from 'src/common/custom-type';
import { Result } from 'src/common/result.interface';
import { CareerModel } from 'src/entities/career-model.entity';
import { OtherCategory } from 'src/entities/other-category.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Connection, Repository } from 'typeorm';
import { CreateCareerModelDto } from './dto/create-career-model.dto';
import skillList from '../static/skill_category.json';
import { CreateSkillCardDto } from './dto/create-skill-card.dto';
import { createSkill } from 'src/common/utils';
import { SkillCard } from 'src/entities/skill-card.entity';

@Injectable()
export class CareerModelService {
  constructor(
    private connection: Connection,
    private readonly _userService: UserService,
    @InjectRepository(CareerModel)
    private readonly _careerModelRepository: Repository<CareerModel>,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(SkillCard)
    private readonly _skillCardRepository: Repository<SkillCard>,
  ) {}

  async createCareerModel(
    snsId: string,
    snsType: SNSType,
    data: CreateCareerModelDto,
  ): Promise<Result> {
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

      return {
        success: true,
        message: '커리어 모델 생성 성공',
        response: null,
      };
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

  async getCareerModel(user: User): Promise<Result> {
    try {
      const result = await this._userRepository.findOne({
        select: ['id', 'email', 'nickname', 'careerModel', 'otherCategories'],
        where: {
          id: user.id,
        },
        relations: ['careerModel', 'otherCategories'],
      });

      return {
        success: true,
        message: '커리어 모델 조회 성공',
        response: result,
      };
    } catch (e) {
      return {
        success: false,
        message: '커리어 모델 조회 실패',
        response: null,
        error: e,
      };
    }
  }

  getSkillInfo(): Result {
    const result = [];

    for (const i in SkillType) {
      result.push({
        name: i,
        full_name: skillList[i].full_name,
        desc: skillList[i].description,
      });
    }

    return {
      success: true,
      message: '스킬 조회 성공',
      response: result,
    };
  }

  async createSkillCard(user: User, data: CreateSkillCardDto): Promise<Result> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // primary skill 추가
      await createSkill(queryRunner, data.primaryTag, user, true);

      // secondary skill 추가
      if (data.secondaryTag !== undefined) {
        await createSkill(queryRunner, data.secondaryTag, user, true);
      }

      // other skill 추가
      if (data.otherTag !== undefined) {
        data.otherTag.forEach(async (item) => {
          await createSkill(queryRunner, item, user, false);
        });
      }

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: '스킬 카드 생성 완료',
        response: null,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();

      return {
        success: false,
        message: '스킬 카드 생성 실패',
        response: null,
        error: e,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async getSkillCard(user: User): Promise<Result> {
    try {
      const result = await this._userRepository.find({
        select: ['id', 'email', 'nickname', 'skillCards'],
        where: {
          id: user.id,
        },
        relations: ['skillCards'],
      });

      return {
        success: true,
        message: '스킬 카드 조회 성공',
        response: result,
      };
    } catch (e) {
      return {
        success: false,
        message: '스킬 카드 조회 실패',
        response: null,
        error: e,
      };
    }
  }

  async modStatusSkillCard(uuid: string, type: CardStatusType): Promise<Result> {
    try {
      const result = await this._skillCardRepository.findOne({
        where: {
          uuid,
        },
      });

      result.status = type;

      this._skillCardRepository.save(result);

      return {
        success: true,
        message: '스킬 카드 진행 상황 수정 완료',
        response: result,
      };
    } catch (e) {
      return {
        success: false,
        message: '스킬 카드 진행 상황 수정 실패',
        response: null,
        error: e,
      };
    }
  }
}
