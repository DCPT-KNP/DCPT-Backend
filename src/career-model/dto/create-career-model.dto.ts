import { IsOptional, IsString } from 'class-validator';

export class CreateCareerModelDto {
  @IsString()
  type: string;

  @IsString()
  primaryTag: string;

  @IsOptional()
  @IsString()
  secondaryTag?: string = null;
}
