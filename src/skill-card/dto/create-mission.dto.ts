import { IsString, IsUUID } from 'class-validator';

export class CreateMissionDto {
  @IsUUID()
  uuid: string;

  @IsString()
  title: string;
}
