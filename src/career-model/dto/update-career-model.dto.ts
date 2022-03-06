import { IsNumber, IsString } from 'class-validator';

export class UpdateCareerModelDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;
}
