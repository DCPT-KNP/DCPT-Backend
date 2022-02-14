import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Result } from 'src/common/result.interface';
import { CareerModelService } from './career-model.service';
import { CreateCareerModelDto } from './dto/create-career-model.dto';

@Controller('career-model')
export class CareerModelController {
  constructor(private readonly _careerModelService: CareerModelService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() data: CreateCareerModelDto): Promise<Result> {
    const { snsId, snsType } = await req.user;

    if (data.type === "PI") {
      if (data.secondaryTag === null) {
        throw new BadRequestException("secondary 역량이 포함되어 있지 않습니다");
      }
    }

    return await this._careerModelService.create(snsId, snsType, data);
  }
}
