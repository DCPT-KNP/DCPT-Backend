import { IsString } from 'class-validator';

export class CreateSNSInfoDto {
  @IsString()
  snsId: string;

  @IsString()
  snsType: string;

  @IsString()
  snsName: string;
}
