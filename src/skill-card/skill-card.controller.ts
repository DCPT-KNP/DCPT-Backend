import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSkillCardDto } from '../skill-card/dto/create-skill-card.dto';
import { UpdateStatusSkillCardDto } from '../skill-card/dto/update-status-skill-card.dto';
import { SkillCardService } from './skill-card.service';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { CreateMissionDto } from './dto/create-mission.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { SkillCard } from 'src/entities/skill-card.entity';

@Controller('skill-card')
export class SkillCardController {
  constructor(private readonly _skillCardService: SkillCardService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ResponseMessage('스킬 카드 생성 완료')
  async createSkillCard(
    @Req() req,
    @Body() data: CreateSkillCardDto,
  ): Promise<null> {
    const { user } = req.user;

    if (data.isDuplicatedType()) {
      throw new BadRequestException('중복된 역량이 존재합니다.');
    }

    return await this._skillCardService.createSkillCard(user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ResponseMessage('스킬 카드 조회 성공')
  async getSkillCard(@Req() req): Promise<any> {
    const { user } = req.user;

    return await this._skillCardService.getSkillCard(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ResponseMessage('스킬 카드 진행 상황 수정 완료')
  async modStatusSkillCard(
    @Body() data: UpdateStatusSkillCardDto,
  ): Promise<SkillCard> {
    return await this._skillCardService.modStatusSkillCard(
      data.uuid,
      data.status,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('mission')
  @ResponseMessage('미션 생성 성공')
  async addMission(@Body() data: CreateMissionDto): Promise<null> {
    const { uuid, title } = data;

    return await this._skillCardService.addMission(uuid, title);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mission/:uuid')
  @ResponseMessage('미션 리스트 조회 성공')
  async getMisisonList(@Param('uuid') uuid: string): Promise<any> {
    return await this._skillCardService.getMissionList(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('mission')
  @ResponseMessage('미션 수정 성공')
  async modMisison(@Body() data: UpdateMissionDto): Promise<null> {
    if (data.checkUndefinedProperty()) {
      throw new BadRequestException(
        'title이나 done의 속성이 하나라도 포함되어야 합니다.',
      );
    }

    const { id, title, done } = data;

    return await this._skillCardService.modMission(id, title, done);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('mission')
  @ResponseMessage('미션 삭제 성공')
  async deleteMission(@Query('id') id: number): Promise<null> {
    if (!id) {
      throw new BadRequestException('id는 필수입니다.');
    }

    return await this._skillCardService.deleteMission(id);
  }
}
