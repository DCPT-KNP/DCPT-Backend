import { IsNumber, IsString } from 'class-validator';

export class UpdateJobGroupDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}
