import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSkillCardDto } from 'src/skill-card/dto/create-skill-card.dto';
import { CardStatusType } from 'src/common/custom-type';
import { Result } from 'src/common/result.interface';
import { createSkill } from 'src/common/utils';
import { SkillCard } from 'src/entities/skill-card.entity';
import { User } from 'src/entities/user.entity';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class SkillCardService {
  constructor(
    private connection: Connection,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(SkillCard)
    private readonly _skillCardRepository: Repository<SkillCard>,
  ) {}

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

  async modStatusSkillCard(
    uuid: string,
    type: CardStatusType,
  ): Promise<Result> {
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
