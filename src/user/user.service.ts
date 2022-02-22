import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SNSType } from 'src/common/custom-type';
import { Result } from 'src/common/result.interface';
import { JobGroup } from 'src/entities/job-group.entity';
import { SNSInfo } from 'src/entities/sns-info.entity';
import { User } from 'src/entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { CreateCareerYearDto } from './dto/create-career-year.dto';
import { CreateJobGroupDto } from './dto/create-job-group.dto';
import { CreateSNSInfoDto } from './dto/create-sns-info.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private connection: Connection,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(SNSInfo)
    private readonly _snsInfoRepository: Repository<SNSInfo>,
  ) {}

  async findOneUser(id: string, type: SNSType): Promise<Result> {
    try {
      const user = await this._snsInfoRepository.findOne({
        where: {
          snsId: id,
          snsType: type,
        },
        relations: ['user'],
      });
      let msg = '';

      if (!user) {
        msg = '찾는 sns 정보가 존재하지 않음';
      } else {
        msg = 'sns 정보 찾기 성공';
      }

      return {
        success: true,
        message: msg,
        response: user,
      };
    } catch (e) {
      return {
        success: false,
        message: 'sns 정보 찾기 오류',
        response: null,
        error: e,
      };
    }
  }

  async findOneSNSInfo(id: string, type: SNSType): Promise<Result> {
    try {
      const result = await this._snsInfoRepository.findOne({
        where: {
          snsId: id,
          snsType: type,
        },
      });
      let msg = '';

      if (!result) {
        msg = '찾는 sns 정보가 존재하지 않음';
      } else {
        msg = 'sns 정보 찾기 성공';
      }

      return {
        success: true,
        message: msg,
        response: result,
      };
    } catch (e) {
      return {
        success: false,
        message: 'sns 정보 찾기 오류',
        response: null,
        error: e,
      };
    }
  }

  async create(
    userData: CreateUserDto,
    snsInfoData: CreateSNSInfoDto,
  ): Promise<Result> {
    const queryRunner = this.connection.createQueryRunner();

    // 실제 데이터베이스 연결
    await queryRunner.connect();
    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      const newUser: User = User.fromJson({ ...userData });
      await queryRunner.manager.save(User, newUser);

      const newSNSInfo: SNSInfo = SNSInfo.fromJson({ ...snsInfoData });
      newSNSInfo.user = newUser;
      await queryRunner.manager.save(SNSInfo, newSNSInfo);

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      return {
        success: true,
        message: '유저 생성 성공',
        response: null,
      };
    } catch (e) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      return {
        success: false,
        message: '유저 생성 실패',
        response: null,
        error: e,
      };
    } finally {
      // 인스턴스 해제
      await queryRunner.release();
    }
  }

  async createJobGroup(
    id: string,
    type: SNSType,
    data: CreateJobGroupDto,
  ): Promise<Result> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const findUser = await this.findOneUser(id, type);
      const user: User = findUser.response.user;

      data.names.forEach(async (name) => {
        const newJobGroup = JobGroup.fromJson({ name, user });
        await queryRunner.manager.save(JobGroup, newJobGroup);
      });

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: '직군 생성 성공',
        response: null,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();

      return {
        success: false,
        message: '직군 생성 실패',
        response: null,
        error: e,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async addCareerYear(
    id: string,
    type: SNSType,
    data: CreateCareerYearDto,
  ): Promise<Result> {
    try {
      const findUser = await this.findOneUser(id, type);
      const user: User = findUser.response.user;

      user.careerYear = data.year;

      await this._userRepository.save(user);

      return {
        success: true,
        message: '연차 등록 성공',
        response: null,
      };
    } catch (e) {
      return {
        success: false,
        message: '연차 등록 실패',
        response: null,
        error: e,
      };
    }
  }

  async getUserAndJob(user: User): Promise<Result> {
    try {
      const result = await this._userRepository.findOne({
        select: ['id', 'email', 'nickname', 'jobGroups'],
        where: {
          id: user.id,
        },
        relations: ['jobGroups'],
      });

      return {
        success: true,
        message: '유저와 직군 정보 조회 성공',
        response: result,
      };
    } catch (e) {
      return {
        success: false,
        message: '유저와 직군 정보 조회 실패',
        response: null,
        error: e,
      };
    }
  }
}
