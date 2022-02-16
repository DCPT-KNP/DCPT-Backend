import { IsString } from 'class-validator';

export class CreateJobGroupDto {
  @IsString({ each: true })
  names: string[];
}
