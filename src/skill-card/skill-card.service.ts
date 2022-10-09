import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSkillCardDto } from '../skill-card/dto/create-skill-card.dto';
import { CardStatusType, DuplicateCard } from '../common/custom-type';
import { createSkill } from '../common/utils';
import { SkillCard } from '../entities/skill-card.entity';
import { User } from '../entities/user.entity';
import { Connection, Repository, getManager } from 'typeorm';
import { Mission } from '../entities/mission.entity';
import { SkillTags } from '../entities/skill-tags.entity';

@Injectable()
export class SkillCardService {
  constructor(
    private connection: Connection,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(SkillCard)
    private readonly _skillCardRepository: Repository<SkillCard>,
    // @InjectRepository(SkillTags)
    // private readonly _skillTagsRepository: Repository<SkillTags>,
    @InjectRepository(Mission)
    private readonly _missionRepository: Repository<Mission>,
  ) {}

  async createSkillCard(user: User, data: CreateSkillCardDto): Promise<null> {
    const duplicateCardList: DuplicateCard[] = [];
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // primary skill 추가
      await createSkill(
        queryRunner,
        data.primaryTag,
        user,
        true,
        duplicateCardList,
        this._skillCardRepository,
      );

      // secondary skill 추가
      if (data.secondaryTag !== undefined) {
        await createSkill(
          queryRunner,
          data.secondaryTag,
          user,
          true,
          duplicateCardList,
          this._skillCardRepository,
        );
      }

      // other skill 추가
      if (data.otherTag !== undefined) {
        for (const item of data.otherTag) {
          await createSkill(
            queryRunner,
            item,
            user,
            false,
            duplicateCardList,
            this._skillCardRepository,
          );
        }
      }

      await queryRunner.commitTransaction();

      return null;
    } catch (e) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(e, 500);
    } finally {
      await queryRunner.release();
    }
  }

  async getSkillCard(user: User): Promise<any> {
    const entityManager = getManager();

    try {
      /**
       * FIXME: Fix the code to find SkillTags
       * querybuilder로 해결했으면 좋겠음 (완)
       * 태그가 겹치는 카드를 하나로 묶었으면 함 (완)
       */
      const total_skillCards = await entityManager
        .createQueryBuilder()
        .select([
          'User.id AS User_id',
          'User.email AS User_email',
          'User.nickname AS User_nickname',
          'User__skillCards.uuid AS User__skillCards_uuid',
          'User__skillCards.title AS User__skillCards_title',
          'User__skillCards.description AS User__skillCards_description',
          'User__skillCards.tip AS User__skillCards_tip',
          'User__skillCards.status AS User__skillCards_status',
          'User__skillCards.userId AS User__skillCards_userId',
        ])
        .from(User, 'User')
        .leftJoin(
          SkillCard,
          'User__skillCards',
          'User__skillCards.userId = User.id',
        )
        .where('User.id = :userId', { userId: user.id })
        .andWhere('User.id IN (:userId)', { userId: user.id });

      const total_result = await entityManager
        .createQueryBuilder()
        .select([
          'User_email AS email',
          'User_nickname AS nickname',
          'User_id AS id',
          'User__skillCards_uuid AS skillCard_uuid',
          'tag AS skillCard_tag',
          'User__skillCards_title AS skillCard_title',
          'User__skillCards_description AS skillCard_description',
          'User__skillCards_tip AS skillCard_tip',
          'User__skillCards_status AS skillCard_status',
        ])
        .from(SkillTags, 'skillTags')
        .innerJoin(
          '(' + total_skillCards.getQuery() + ')',
          'total_skillCards',
          'skillTags.skillCardUuid = total_skillCards.User__skillCards_uuid',
        )
        .setParameters(total_skillCards.getParameters())
        .getRawMany();

      const filtered_result = total_result.reduce((acc, cur) => {
        const idx = acc.findIndex(({ skillCard_uuid }) => {
          return skillCard_uuid === cur.skillCard_uuid;
        });

        if (idx === -1) {
          cur.skillCard_tag = [cur.skillCard_tag];
          acc.push(cur);
        } else {
          acc[idx].skillCard_tag.push(cur.skillCard_tag);
        }

        return acc;
      }, []);

      const userInfo = {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      };

      const skillCards = [];
      for (const item of filtered_result) {
        skillCards.push({
          uuid: item.skillCard_uuid,
          tag: item.skillCard_tag,
          title: item.skillCard_title,
          description: item.skillCard_description,
          tip: item.skillCard_tip,
          status: item.skillCard_status,
        });
      }

      const result = {
        ...userInfo,
        skillCards,
      };

      return result;
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  async modStatusSkillCard(
    uuid: string,
    status: CardStatusType,
  ): Promise<SkillCard> {
    try {
      const result = await this._skillCardRepository.findOne({
        where: {
          uuid,
        },
      });

      result.status = status;

      await this._skillCardRepository.save(result);

      return result;
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  async addMission(uuid: string, title: string): Promise<null> {
    try {
      const skillCard = await this._skillCardRepository.findOne(uuid);

      if (!skillCard) {
        throw 'skillCard: undefined';
      }

      const newMission = new Mission(title, skillCard);

      await this._missionRepository.save(newMission);

      return null;
    } catch (e) {
      switch (e) {
        case 'skillCard: undefined':
          throw new BadRequestException(
            '해당하는 skillCard가 존재하지 않습니다.',
          );

        default:
          throw new HttpException(e, 500);
      }
    }
  }

  async deleteMission(id: number): Promise<null> {
    try {
      const mission = await this._missionRepository.findOne(id);

      if (!mission) {
        throw 'mission: undefined';
      }

      await this._missionRepository.delete(id);

      return null;
    } catch (e) {
      switch (e) {
        case 'mission: undefined':
          throw new BadRequestException('잘못된 id이거나 없는 id입니다.');

        default:
          throw new HttpException(e, 500);
      }
    }
  }

  async modMission(id: number, title?: string, done?: boolean): Promise<null> {
    try {
      const mission = await this._missionRepository.findOne(id);

      if (!mission) {
        throw 'mission: undefined';
      }

      mission.missionTitle = title !== undefined ? title : mission.missionTitle;
      mission.done = done !== undefined ? done : mission.done;

      await this._missionRepository.save(mission);

      return null;
    } catch (e) {
      switch (e) {
        case 'mission: undefined':
          throw new BadRequestException('잘못된 id이거나 없는 id입니다.');

        default:
          throw new HttpException(e, 500);
      }
    }
  }

  async getMissionList(uuid: string): Promise<any> {
    const entityManager = getManager();

    try {
      /**
       * FIXME: Fix the code to find SkillTags
       * querybuilder로 해결했으면 좋겠음
       */

      const total_missions = await entityManager
        .createQueryBuilder()
        .select([
          'SkillCard.uuid AS skillCard_uuid',
          'SkillCard.title AS skillCard_title',
          'SkillCard__missions.id AS missions_id',
          'SkillCard__missions.missionTitle AS missions_title',
          'SkillCard__missions.done AS missions_done',
        ])
        .from(SkillCard, 'SkillCard')
        .leftJoin(
          Mission,
          'SkillCard__missions',
          'SkillCard__missions.skillCardUuid = SkillCard.uuid',
        )
        .where('SkillCard.uuid = :uuid', { uuid })
        // .andWhere('SkillCard.uuid IN (:uuid)', { uuid })
        .getRawMany();

      if (total_missions.length === 0) {
        throw 'uuid: error';
      }

      const skillCardInfo = {
        uuid: total_missions[0].skillCard_uuid,
        title: total_missions[0].skillCard_title,
      };

      const missions = [];
      for (const item of total_missions) {
        if (!item.missions_id) {
          break;
        }

        missions.push({
          id: item.missions_id,
          missionTitle: item.missions_title,
          done: item.missions_done,
        });
      }

      const result = {
        ...skillCardInfo,
        missions,
      };

      return result;
    } catch (e) {
      switch (e) {
        case 'uuid: error':
          throw new BadRequestException('잘못된 uuid입니다.');

        default:
          throw new HttpException(e, 500);
      }
    }
  }
}
