import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSkillCardDto } from '../skill-card/dto/create-skill-card.dto';
import { CardStatusType, DuplicateCard } from '../common/custom-type';
import { Result } from '../common/result.interface';
import { createSkill } from '../common/utils';
import { SkillCard } from '../entities/skill-card.entity';
import { User } from '../entities/user.entity';
import { Connection, Repository, getManager } from 'typeorm';
import { Mission } from '../entities/mission.entity';
import { SkillTags } from 'src/entities/skill-tags.entity';

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

  async createSkillCard(user: User, data: CreateSkillCardDto): Promise<Result> {
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
    const entityManager = getManager();

    try {
      /**
       * FIXME: Fix the code to find SkillTags
       * querybuilder로 해결했으면 좋겠음
       */
      const result = await entityManager.query(
        `SELECT \
          User_email AS email, \
          User_nickname AS nickname, \
          User_id AS id, \
          User__skillCards_uuid AS skillCard_uuid, \
          tag AS skillCard_tag, \
          User__skillCards_title AS skillCard_title, \
          User__skillCards_description AS skillCard_description, \
          User__skillCards_tip AS skillCard_tip, \
          User__skillCards_status AS skillCard_status
        FROM \
          skill_tags SkillTags \
          INNER JOIN ( \
            SELECT \
              User.id AS User_id, \
              User.email AS User_email, \
              User.nickname AS User_nickname, \
              User__skillCards.uuid AS User__skillCards_uuid, \
              User__skillCards.title AS User__skillCards_title, \
              User__skillCards.description AS User__skillCards_description, \
              User__skillCards.tip AS User__skillCards_tip, \
              User__skillCards.status AS User__skillCards_status, \
              User__skillCards.userId AS User__skillCards_userId \
            FROM \
              users User \
              LEFT JOIN skill_cards User__skillCards ON User__skillCards.userId = User.id \
            WHERE \
              (User.id = ${user.id}) \
              AND ( \
                User.id IN (${user.id}) \
              )) inline_view ON SkillTags.skillCardUuid = inline_view.User__skillCards_uuid`
      );

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
    const entityManager = getManager();

    try {
      /**
       * FIXME: Fix the code to find SkillTags
       * querybuilder로 해결했으면 좋겠음
       */

      const result = await entityManager.query(
        `SELECT \
          SkillCard_uuid AS uuid, \
          tag, \
          SkillCard_title AS title, \
          SkillCard__missions_id AS mission_id, \
          SkillCard__missions_missionTitle AS mission_title, \
          SkillCard__missions_done AS mission_done \
        FROM \
          skill_tags SkillTags \
          INNER JOIN ( \
            SELECT \
              SkillCard.uuid AS SkillCard_uuid, \
              SkillCard.title AS SkillCard_title, \
              SkillCard__missions.id AS SkillCard__missions_id, \
              SkillCard__missions.missionTitle AS SkillCard__missions_missionTitle, \
              SkillCard__missions.done AS SkillCard__missions_done, \
              SkillCard__missions.skillCardUuid AS SkillCard__missions_skillCardUuid \
            FROM \
              skill_cards SkillCard \
              LEFT JOIN missions SkillCard__missions ON SkillCard__missions.skillCardUuid = SkillCard.uuid \
            WHERE \
              (SkillCard.uuid = "${uuid}") \
              AND ( \
                SkillCard.uuid IN ("${uuid}") \
              )) inline_view ON SkillTags.skillCardUuid = inline_view.SkillCard_uuid`
      );

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
