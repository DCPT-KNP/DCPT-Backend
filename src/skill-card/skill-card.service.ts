import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSkillCardDto } from '../skill-card/dto/create-skill-card.dto';
import { CardStatusType } from '../common/custom-type';
import { Result } from '../common/result.interface';
import { createSkill } from '../common/utils';
import { SkillCard } from '../entities/skill-card.entity';
import { User } from '../entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { Mission } from '../entities/mission.entity';

@Injectable()
export class SkillCardService {
  constructor(
    private connection: Connection,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(SkillCard)
    private readonly _skillCardRepository: Repository<SkillCard>,
    @InjectRepository(Mission)
    private readonly _missionRepository: Repository<Mission>,
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
      const result = await this._userRepository.findOne({
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

      await this._skillCardRepository.save(result);

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

  async addMission(uuid: string, title: string): Promise<Result> {
    try {
      const skillCard = await this._skillCardRepository.findOne(uuid);
      const newMission = new Mission(title, skillCard);

      await this._missionRepository.save(newMission);

      return {
        success: true,
        message: '미션 생성 성공',
        response: null,
      };
    } catch (e) {
      return {
        success: false,
        message: '미션 생성 실패',
        response: null,
        error: e,
      };
    }
  }

  async deleteMission(id: number): Promise<Result> {
    try {
      await this._missionRepository.delete(id);

      return {
        success: true,
        message: '미션 삭제 성공',
        response: null,
      };
    } catch (e) {
      return {
        success: false,
        message: '미션 삭제 실패',
        response: null,
        error: e,
      };
    }
  }

  async modMission(
    id: number,
    title?: string,
    done?: boolean,
  ): Promise<Result> {
    try {
      const mission = await this._missionRepository.findOne(id);

      mission.missionTitle = title !== undefined ? title : mission.missionTitle;
      mission.done = done !== undefined ? done : mission.done;

      await this._missionRepository.save(mission);

      return {
        success: true,
        message: '미션 수정 성공',
        response: null,
      };
    } catch (e) {
      return {
        success: false,
        message: '미션 수정 실패',
        response: null,
        error: e,
      };
    }
  }

  async getMissionList(uuid: string): Promise<Result> {
    try {
      const result = await this._skillCardRepository.findOne({
        select: ['uuid', 'tag', 'title', 'missions'],
        where: {
          uuid,
        },
        relations: ['missions'],
      });

      return {
        success: true,
        message: '미션 리스트 조회 성공',
        response: result,
      };
    } catch (e) {
      return {
        success: false,
        message: '',
        response: null,
        error: e,
      };
    }
  }
}
