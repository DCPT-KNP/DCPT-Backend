import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateSkillCardDto } from 'src/skill-card/dto/create-skill-card.dto';
import { UpdateStatusSkillCardDto } from 'src/skill-card/dto/update-status-skill-card.dto';
import { Result } from 'src/common/result.interface';
import { SkillCardService } from './skill-card.service';

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
}
