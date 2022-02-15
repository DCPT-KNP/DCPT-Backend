import { IsString } from "class-validator";

export class CreateCareerYearDto {
  @IsString()
  year: string;
}