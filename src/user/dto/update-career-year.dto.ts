import { IsString } from 'class-validator';

export class UpdateCareerYearDto {
  @IsString()
  year: string;
}
