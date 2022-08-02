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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Result } from '../common/result.interface';
import { CareerModelService } from './career-model.service';
import { CreateCareerModelDto } from './dto/create-career-model.dto';
import { UpdateCareerModelDto } from './dto/update-career-model.dto';

@Controller('career-model')
export class CareerModelController {
  constructor(private readonly _careerModelService: CareerModelService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
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
      if (!(1 <= data.otherTag.length && data.otherTag.length <= 5)) {
        throw new BadRequestException(
          'T, PI모델의 기타 역량은 1~5개 선택해야 합니다.',
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
  async getCareerModel(@Req() req) {
    const { user } = req.user;

    return await this._careerModelService.getCareerModel(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async modifyRoadmapTitle(
    @Body() data: UpdateCareerModelDto,
  ): Promise<Result> {
    return await this._careerModelService.modifyRoadmapTitle(data);
  }

  @Get('skill')
  async getSkillInfo() {
    return this._careerModelService.getSkillInfo();
  }
}
