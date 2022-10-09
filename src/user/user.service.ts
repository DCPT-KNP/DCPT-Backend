import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SNSType } from '../common/custom-type';
import { JobGroup } from '../entities/job-group.entity';
import { SNSInfo } from '../entities/sns-info.entity';
import { User } from '../entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { CreateCareerYearDto } from './dto/create-career-year.dto';
import { CreateJobGroupDto } from './dto/create-job-group.dto';
import { CreateSNSInfoDto } from './dto/create-sns-info.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateCareerYearDto } from './dto/update-career-year.dto';
import { UpdateJobGroupDto } from './dto/update-job-group.dto';
import { Result } from 'src/common/interceptors/transform.interceptor';

@Injectable()
export class UserService {
  constructor(
    private connection: Connection,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(SNSInfo)
    private readonly _snsInfoRepository: Repository<SNSInfo>,
    @InjectRepository(JobGroup)
    private readonly _jobGroupRepository: Repository<JobGroup>,
  ) {}

  async findOneUser(id: string, type: SNSType): Promise<Result<SNSInfo>> {
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

  async findOneSNSInfo(id: string, type: SNSType): Promise<Result<SNSInfo>> {
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
  ): Promise<Result<null>> {
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
  ): Promise<null> {
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

      return null;
    } catch (e) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(e, 500);
    } finally {
      await queryRunner.release();
    }
  }

  async modifyJobGroup(data: UpdateJobGroupDto): Promise<JobGroup> {
    try {
      const result = await this._jobGroupRepository.findOne(data.id);

      if (!result) {
        throw 'result is undefined';
      }

      result.name = data.name;

      await this._jobGroupRepository.save(result);

      return result;
    } catch (e) {
      switch (e) {
        case 'result is undefined':
          throw new BadRequestException('해당하는 id가 존재하지 않습니다.');

        default:
          throw new HttpException(e, 500);
      }
    }
  }

  async addCareerYear(
    id: string,
    type: SNSType,
    data: CreateCareerYearDto,
  ): Promise<null> {
    try {
      const findUser = await this.findOneUser(id, type);
      const user: User = findUser.response.user;

      user.careerYear = data.year;

      await this._userRepository.save(user);

      return null;
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  async modifyCareerYear(user: User, data: UpdateCareerYearDto): Promise<User> {
    try {
      user.careerYear = data.year;

      await this._userRepository.save(user);

      return user;
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  async getAllUserInfo(user: User): Promise<User> {
    try {
      const result = await this._userRepository.findOne({
        select: ['id', 'email', 'nickname', 'image', 'careerYear', 'jobGroups'],
        where: {
          id: user.id,
        },
        relations: ['jobGroups'],
      });

      return result;
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }
}
