import { IsString } from 'class-validator';

export class CreateMissionDto {
  @IsString()
  uuid: string;

  @IsString()
  title: string;
}
