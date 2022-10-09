import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CareerModel } from '../entities/career-model.entity';
import { User } from '../entities/user.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Result } from '../common/result.interface';
import { CareerModelService } from './career-model.service';
import { CreateCareerModelDto } from './dto/create-career-model.dto';
import { UpdateCareerModelDto } from './dto/update-career-model.dto';
import { SkillInfo } from '../common/custom-type';

@Controller('career-model')
export class CareerModelController {
  constructor(private readonly _careerModelService: CareerModelService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ResponseMessage('커리어 모델 생성 성공')
  async create(
    @Req() req,
    @Body() data: CreateCareerModelDto,
  ): Promise<Result> {
    const { snsId, snsType } = req.user;

    if (data.type === 'PI') {
      if (data.secondaryTag === undefined) {
        throw new BadRequestException(
          'PI모델은 secondary 역량(secondaryTag)이 포함되어야 합니다.',
        );
      }
    }

    if (data.type === 'T' || data.type === 'I') {
      if (data.secondaryTag !== undefined) {
        throw new BadRequestException(
          'I, T모델은 secondary 역량(secondaryTag)이 포함되지 않습니다.',
        );
      }
      if (data.type === 'I' && data.otherTag.length > 0) {
        throw new BadRequestException(
          'I모델은 기타 역량(otherTag)이 포함되지 않습니다.',
        );
      }
    }

    if (data.type === 'T' || data.type === 'PI') {
      if (!(1 <= data.otherTag.length)) {
        throw new BadRequestException(
          'T, PI모델의 기타 역량은 1개 이상 선택해야 합니다.',
        );
      }
    }

    if (data.isDuplicatedType()) {
      throw new BadRequestException('중복된 역량이 존재합니다.');
    }

    return await this._careerModelService.createCareerModel(
      snsId,
      snsType,
      data,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ResponseMessage('커리어 모델 조회 성공')
  async getCareerModel(@Req() req): Promise<User> {
    const { user } = req.user;

    return await this._careerModelService.getCareerModel(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ResponseMessage('로드맵 제목 수정 성공')
  async modifyRoadmapTitle(
    @Body() data: UpdateCareerModelDto,
  ): Promise<CareerModel> {
    return await this._careerModelService.modifyRoadmapTitle(data);
  }

  @Get('skill')
  @ResponseMessage('스킬 조회 성공')
  getSkillInfo(): SkillInfo[] {
    return this._careerModelService.getSkillInfo();
  }
}
