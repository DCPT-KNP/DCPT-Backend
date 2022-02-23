import { IsEnum, IsUUID } from "class-validator";
import { CardStatusType } from "src/common/custom-type";

export class UpdateStatusSkillCardDto {
  @IsUUID()
  uuid: string;

  @IsEnum(CardStatusType)
  type: CardStatusType;
}