import { IsString } from 'class-validator';

export class UpdateCareerYearDto {
  @IsString()
  career: string;
}
