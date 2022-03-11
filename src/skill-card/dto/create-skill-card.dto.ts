import { IsEnum, IsOptional } from 'class-validator';
import { SkillType } from '../../common/custom-type';

export class CreateSkillCardDto {
  @IsEnum(SkillType)
  primaryTag: SkillType;

  @IsOptional()
  @IsEnum(SkillType)
  secondaryTag?: SkillType;

  @IsOptional()
  @IsEnum(SkillType, { each: true })
  otherTag?: SkillType[];
}
