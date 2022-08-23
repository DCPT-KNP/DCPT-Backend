import { IsEnum, IsUUID } from 'class-validator';
import { CardStatusType } from '../../common/custom-type';

export class UpdateStatusSkillCardDto {
  @IsUUID()
  uuid: string;

  @IsEnum(CardStatusType)
  status: CardStatusType;
}
