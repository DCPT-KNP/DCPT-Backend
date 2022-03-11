import {
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
import { Result } from '../common/result.interface';
import { SkillCardService } from './skill-card.service';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { CreateMissionDto } from './dto/create-mission.dto';

@Controller('skill-card')
export class SkillCardController {
  constructor(private readonly _skillCardService: SkillCardService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createSkillCard(
    @Req() req,
    @Body() data: CreateSkillCardDto,
  ): Promise<Result> {
    const { user } = req.user;

    return await this._skillCardService.createSkillCard(user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getSkillCard(@Req() req) {
    const { user } = req.user;

    return await this._skillCardService.getSkillCard(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async modStatusSkillCard(@Body() data: UpdateStatusSkillCardDto) {
    return await this._skillCardService.modStatusSkillCard(
      data.uuid,
      data.type,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('mission')
  async addMission(@Body() data: CreateMissionDto) {
    const { uuid, title } = data;

    return await this._skillCardService.addMission(uuid, title);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mission/:uuid')
  async getMisisonList(@Param('uuid') uuid: string) {
    return await this._skillCardService.getMissionList(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('mission')
  async modMisison(@Body() data: UpdateMissionDto) {
    const { id, title, done } = data;

    return await this._skillCardService.modMission(id, title, done);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('mission')
  async deleteMission(@Query('id') id: number) {
    return await this._skillCardService.deleteMission(id);
  }
}
