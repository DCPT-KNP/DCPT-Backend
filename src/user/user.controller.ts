import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCareerYearDto } from './dto/create-career-year.dto';
import { CreateJobGroupDto } from './dto/create-job-group.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post("job-group")
  async createJobGroup(@Req() req, @Body() data: CreateJobGroupDto) {
    const { snsId, snsType } = await req.user;
    return await this._userService.createJobGroup(snsId, snsType, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post("career-year")
  async addCareerYear(@Req() req, @Body() data: CreateCareerYearDto) {
    const { snsId, snsType } = req.user;
    return await this._userService.addCareerYear(snsId, snsType, data);
  }
}
