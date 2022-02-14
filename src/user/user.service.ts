import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SNSType } from 'src/common/custom-type';
import { Result } from 'src/common/result.interface';
import { SNSInfo } from 'src/entities/sns-info.entity';
import { User } from 'src/entities/user.entity';
import { Connection, Repository } from 'typeorm';
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
          snsType: type
        },
        relations: ["user"]
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

  async findOneUserByUUID(uuid: string): Promise<Result> {
    try {
      const result = await this._userRepository.findOne(uuid);
      let msg = '';

      if (!result) {
        msg = '찾는 유저가 존재하지 않음';
      } else {
        msg = '유저 찾기 성공';
      }

      return {
        success: true,
        message: msg,
        response: result,
      };
    } catch (e) {
      return {
        success: false,
        message: '유저 찾기 오류',
        response: null,
        error: e,
      };
    }
  }

  async findOneUserByNameAndEmail(
    name: string,
    email: string,
  ): Promise<Result> {
    try {
      const result = await this._userRepository.findOne({
        where: {
          nickname: name,
          email: email,
        },
      });
      let msg = '';

      if (!result) {
        msg = '찾는 유저가 존재하지 않음';
      } else {
        msg = '유저 찾기 성공';
      }

      return {
        success: true,
        message: msg,
        response: result,
      };
    } catch (e) {
      return {
        success: false,
        message: '유저 찾기 발생',
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
}
